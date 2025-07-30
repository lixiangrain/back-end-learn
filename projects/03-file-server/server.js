/**
 * 文件服务器 - 综合实战项目
 * 
 * 功能：
 * - 📁 列出所有文件
 * - 📤 上传文件
 * - 📥 下载文件
 * - 🗑️ 删除文件
 * - ✏️ 重命名文件
 * 
 * 运行方式：node server.js
 * 访问地址：http://localhost:3000
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// 服务器配置
const PORT = 3000;
const HOST = 'localhost';
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const FILES_DB = path.join(DATA_DIR, 'files.json');

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.zip': 'application/zip'
};

/**
 * 初始化服务器
 */
async function initServer() {
  try {
    // 创建必要的目录
    await ensureDir(UPLOAD_DIR);
    await ensureDir(DATA_DIR);

    // 初始化文件数据库
    await initFilesDB();

    console.log('✅ 服务器初始化完成');
  } catch (error) {
    console.error('❌ 服务器初始化失败:', error.message);
    process.exit(1);
  }
}

/**
 * 确保目录存在
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log('📁 创建目录:', dirPath);
  }
}

/**
 * 初始化文件数据库
 */
async function initFilesDB() {
  try {
    await fs.access(FILES_DB);
  } catch {
    const initialData = { files: [] };
    await fs.writeFile(FILES_DB, JSON.stringify(initialData, null, 2));
    console.log('📄 创建文件数据库:', FILES_DB);
  }
}

/**
 * 读取文件数据库
 */
async function readFilesDB() {
  try {
    const data = await fs.readFile(FILES_DB, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取文件数据库失败:', error.message);
    return { files: [] };
  }
}

/**
 * 写入文件数据库
 */
async function writeFilesDB(data) {
  try {
    await fs.writeFile(FILES_DB, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('写入文件数据库失败:', error.message);
    throw error;
  }
}

/**
 * 生成文件 ID
 */
function generateFileId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * 获取 MIME 类型
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * 解析 multipart/form-data
 */
function parseMultipart(body, boundary) {
  // body = --boundary\r\nContent-Disposition: form-data; name="file"; filename="logo.png"\r\nContent-Type: image/png\r\n\r\n<FILE_DATA>\r\n--boundary--
  const parts = body.split(`--${boundary}`); // file的二进制
  const files = [];

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data')) {
      const lines = part.split('\r\n');
      let filename = '';
      let content = '';
      let isFile = false;

      // 解析头部
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('filename=')) {
          const match = line.match(/filename="([^"]+)"/);
          if (match) {
            filename = match[1];
            isFile = true;
          }
        } else if (line === '' && isFile) {
          // 空行后是文件内容
          content = lines.slice(i + 1, -1).join('\r\n');
          break;
        }
      }

      if (filename && content) {
        files.push({ filename, content });
      }
    }
  }

  return files;
}

/**
 * 创建 HTTP 服务器
 */

// localhost:3000/
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname; // 请求路径, /
  const method = req.method;  // 请求方法 get

  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`📥 ${method} ${pathname} - ${new Date().toLocaleString()}`);

  try {
    // 路由处理
    // get: api/v1/
    if (pathname === '/') {
      await handleHome(req, res);
    } else if (pathname === '/api/files' && method === 'GET') {
      await handleListFiles(req, res);
    } else if (pathname === '/api/files' && method === 'POST') {
      await handleUploadFile(req, res);
    } else if (pathname.startsWith('/api/files/') && method === 'GET') {
      await handleDownloadFile(req, res, pathname);
    } else if (pathname.startsWith('/api/files/') && method === 'DELETE') {
      await handleDeleteFile(req, res, pathname);
    } else if (pathname.startsWith('/api/files/') && method === 'PUT') {
      await handleRenameFile(req, res, pathname);
    } else {
      await handle404(req, res);
    }
  } catch (error) {
    console.error('❌ 请求处理错误:', error.message);
    await handleError(res, error);
  }
});

/**
 * 首页处理
 */
async function handleHome(req, res) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>文件服务器</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .upload-area { border: 2px dashed #007acc; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .upload-area.dragover { background: #e3f2fd; border-color: #1976d2; }
            .file-list { margin: 20px 0; }
            .file-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #ddd; margin: 5px 0; border-radius: 4px; }
            .file-info { flex: 1; }
            .file-actions button { margin: 0 5px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; }
            .btn-download { background: #4caf50; color: white; }
            .btn-delete { background: #f44336; color: white; }
            .btn-rename { background: #ff9800; color: white; }
            .btn-upload { background: #007acc; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
            .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📁 文件服务器</h1>
            <p>支持文件上传、下载、删除和重命名功能</p>
            
            <div class="upload-area" id="uploadArea">
                <p>📤 拖拽文件到这里或点击选择文件</p>
                <input type="file" id="fileInput" multiple style="display: none;">
                <button class="btn-upload" onclick="document.getElementById('fileInput').click()">选择文件</button>
            </div>
            
            <div id="status"></div>
            
            <div class="file-list">
                <h3>📋 文件列表</h3>
                <div id="fileList">加载中...</div>
            </div>
        </div>
        
        <script>
            // 页面加载时获取文件列表
            window.onload = loadFileList;
            
            // 文件上传处理
            const fileInput = document.getElementById('fileInput');
            const uploadArea = document.getElementById('uploadArea');
            
            fileInput.addEventListener('change', handleFileUpload);
            
            // 拖拽上传
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                uploadFiles(files);
            });
            
            async function handleFileUpload() {
                const files = fileInput.files;
                await uploadFiles(files);
                fileInput.value = ''; // 清空选择
            }
            
            async function uploadFiles(files) {
                for (const file of files) {
                    await uploadFile(file);
                }
                loadFileList();
            }
            
            async function uploadFile(file) {
                const formData = new FormData();
                formData.append('file', file);
                
                try {
                    showStatus('上传中: ' + file.name, 'info');
                    const response = await fetch('/api/files', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        showStatus('上传成功: ' + file.name, 'success');
                    } else {
                        const error = await response.text();
                        showStatus('上传失败: ' + error, 'error');
                    }
                } catch (error) {
                    showStatus('上传错误: ' + error.message, 'error');
                }
            }
            
            async function loadFileList() {
                try {
                    const response = await fetch('/api/files');
                    const data = await response.json();
                    displayFileList(data.files);
                } catch (error) {
                    showStatus('加载文件列表失败: ' + error.message, 'error');
                }
            }
            
            function displayFileList(files) {
                const fileList = document.getElementById('fileList');
                
                if (files.length === 0) {
                    fileList.innerHTML = '<p>暂无文件</p>';
                    return;
                }
                
                const html = files.map(file => \`
                    <div class="file-item">
                        <div class="file-info">
                            <strong>\${file.originalName}</strong><br>
                            <small>大小: \${formatBytes(file.size)} | 上传时间: \${new Date(file.uploadTime).toLocaleString()}</small>
                        </div>
                        <div class="file-actions">
                            <button class="btn-download" onclick="downloadFile('\${file.id}', '\${file.originalName}')">下载</button>
                            <button class="btn-rename" onclick="renameFile('\${file.id}', '\${file.originalName}')">重命名</button>
                            <button class="btn-delete" onclick="deleteFile('\${file.id}', '\${file.originalName}')">删除</button>
                        </div>
                    </div>
                \`).join('');
                
                fileList.innerHTML = html;
            }
            
            async function downloadFile(fileId, filename) {
                try {
                    const response = await fetch(\`/api/files/\${fileId}\`);
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    } else {
                        showStatus('下载失败', 'error');
                    }
                } catch (error) {
                    showStatus('下载错误: ' + error.message, 'error');
                }
            }
            
            async function deleteFile(fileId, filename) {
                if (!confirm(\`确定要删除文件 "\${filename}" 吗？\`)) return;
                
                try {
                    const response = await fetch(\`/api/files/\${fileId}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        showStatus('删除成功: ' + filename, 'success');
                        loadFileList();
                    } else {
                        const error = await response.text();
                        showStatus('删除失败: ' + error, 'error');
                    }
                } catch (error) {
                    showStatus('删除错误: ' + error.message, 'error');
                }
            }
            
            async function renameFile(fileId, oldName) {
                const newName = prompt('请输入新的文件名:', oldName);
                if (!newName || newName === oldName) return;
                
                try {
                    const response = await fetch(\`/api/files/\${fileId}\`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ newName })
                    });
                    
                    if (response.ok) {
                        showStatus('重命名成功', 'success');
                        loadFileList();
                    } else {
                        const error = await response.text();
                        showStatus('重命名失败: ' + error, 'error');
                    }
                } catch (error) {
                    showStatus('重命名错误: ' + error.message, 'error');
                }
            }
            
            function showStatus(message, type) {
                const status = document.getElementById('status');
                status.innerHTML = \`<div class="status \${type}">\${message}</div>\`;
                setTimeout(() => {
                    status.innerHTML = '';
                }, 3000);
            }
            
            function formatBytes(bytes) {
                if (bytes === 0) return '0 B';
                const k = 1024;
                const sizes = ['B', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
        </script>
    </body>
    </html>
  `;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

/**
 * 列出所有文件
 */
async function handleListFiles(req, res) {
  try {
    const db = await readFilesDB();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      files: db.files,
      total: db.files.length
    }));
  } catch (error) {
    throw error;
  }
}

/**
 * 上传文件处理
 */
async function handleUploadFile(req, res) {
  try {
    let body = '';

    // text -> 直接传递
    // file -> 分段上传；
    // 接收数据
    req.on('data', chunk => {
      body += chunk.toString('binary');
    });

    req.on('end', async () => {
      try {
        const contentType = req.headers['content-type'];

        if (contentType && contentType.includes('multipart/form-data')) {
          // 解析 multipart 数据
          const boundary = contentType.split('boundary=')[1];
          const files = parseMultipart(body, boundary);

          if (files.length === 0) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('没有找到文件');
            return;
          }

          const uploadedFiles = [];

          for (const file of files) {
            const fileId = generateFileId();
            const fileName = `${fileId}_${file.filename}`;
            const filePath = path.join(UPLOAD_DIR, fileName);

            // 保存文件
            await fs.writeFile(filePath, file.content, 'binary');

            // 获取文件信息
            const stats = await fs.stat(filePath);

            const fileInfo = {
              id: fileId,
              originalName: file.filename,
              fileName: fileName,
              size: stats.size,
              mimeType: getMimeType(file.filename),
              uploadTime: new Date().toISOString(),
              path: filePath
            };

            uploadedFiles.push(fileInfo);
          }

          // 更新数据库
          const db = await readFilesDB();
          db.files.push(...uploadedFiles);
          await writeFilesDB(db);

          console.log(`✅ 上传成功: ${uploadedFiles.map(f => f.originalName).join(', ')}`);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: '文件上传成功',
            files: uploadedFiles
          }));

        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('不支持的内容类型');
        }

      } catch (error) {
        console.error('文件上传处理错误:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('文件上传失败: ' + error.message);
      }
    });

  } catch (error) {
    throw error;
  }
}

/**
 * 下载文件处理
 */
async function handleDownloadFile(req, res, pathname) {
  try {
    const fileId = pathname.split('/').pop();
    const db = await readFilesDB();
    const fileInfo = db.files.find(f => f.id === fileId);

    if (!fileInfo) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('文件不存在');
      return;
    }

    // 检查文件是否存在
    try {
      await fs.access(fileInfo.path);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('文件已被删除');
      return;
    }

    // 设置下载头
    res.setHeader('Content-Type', fileInfo.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileInfo.originalName)}"`);

    // 创建读取流
    const readStream = require('fs').createReadStream(fileInfo.path);

    readStream.on('error', (error) => {
      console.error('文件读取错误:', error.message);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('文件读取失败');
      }
    });

    // 管道传输
    readStream.pipe(res);

    console.log(`📥 下载文件: ${fileInfo.originalName}`);

  } catch (error) {
    throw error;
  }
}

/**
 * 删除文件处理
 */
async function handleDeleteFile(req, res, pathname) {
  try {
    const fileId = pathname.split('/').pop();
    const db = await readFilesDB();
    const fileIndex = db.files.findIndex(f => f.id === fileId);

    if (fileIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('文件不存在');
      return;
    }

    const fileInfo = db.files[fileIndex];

    // 删除物理文件
    try {
      await fs.unlink(fileInfo.path);
    } catch (error) {
      console.warn('物理文件删除失败:', error.message);
    }

    // 从数据库中删除
    db.files.splice(fileIndex, 1);
    await writeFilesDB(db);

    console.log(`🗑️ 删除文件: ${fileInfo.originalName}`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: '文件删除成功'
    }));

  } catch (error) {
    throw error;
  }
}

/**
 * 重命名文件处理
 */
async function handleRenameFile(req, res, pathname) {
  try {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { newName } = JSON.parse(body);

        if (!newName || typeof newName !== 'string') {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('新文件名无效');
          return;
        }

        const fileId = pathname.split('/').pop();
        const db = await readFilesDB();
        const fileInfo = db.files.find(f => f.id === fileId);

        if (!fileInfo) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('文件不存在');
          return;
        }

        // 更新文件信息
        const oldName = fileInfo.originalName;
        fileInfo.originalName = newName;
        fileInfo.mimeType = getMimeType(newName);

        await writeFilesDB(db);

        console.log(`✏️ 重命名文件: ${oldName} -> ${newName}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: '文件重命名成功',
          file: fileInfo
        }));

      } catch (error) {
        console.error('重命名处理错误:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('重命名失败: ' + error.message);
      }
    });

  } catch (error) {
    throw error;
  }
}

/**
 * 404 处理
 */
async function handle404(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - 页面未找到</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
            .error { color: #e74c3c; }
        </style>
    </head>
    <body>
        <h1 class="error">404 - 页面未找到</h1>
        <p>请求的路径 <code>${req.url}</code> 不存在</p>
        <a href="/">返回首页</a>
    </body>
    </html>
  `);
}

/**
 * 错误处理
 */
async function handleError(res, error) {
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error.message
    }));
  }
}

// 启动服务器
async function startServer() {
  await initServer();

  server.listen(PORT, HOST, () => {
    console.log('\n🚀 文件服务器启动成功！');
    console.log(`📍 地址: http://${HOST}:${PORT}`);
    console.log(`📁 上传目录: ${UPLOAD_DIR}`);
    console.log(`📄 数据文件: ${FILES_DB}`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
    console.log('\n💡 功能说明：');
    console.log('- 📤 文件上传：拖拽或选择文件');
    console.log('- 📥 文件下载：点击下载按钮');
    console.log('- 🗑️ 文件删除：点击删除按钮');
    console.log('- ✏️ 文件重命名：点击重命名按钮');
    console.log('\n按 Ctrl+C 停止服务器\n');
  });
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 收到停止信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

// 错误处理
server.on('error', (err) => {
  console.error('❌ 服务器错误:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请尝试其他端口`);
  }
});

// 启动服务器
startServer().catch(error => {
  console.error('❌ 服务器启动失败:', error.message);
  process.exit(1);
});
