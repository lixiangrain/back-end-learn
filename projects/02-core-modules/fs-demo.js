/**
 * 文件系统模块 (fs) 演示
 * 
 * 展示 Node.js 文件操作的各种方式：同步、异步、Promise
 * 运行方式：node fs-demo.js
 */

const fs = require('fs');
const path = require('path');

// 创建演示用的目录和文件
const demoDir = path.join(__dirname, 'demo-files');
const demoFile = path.join(demoDir, 'test.txt');
const copyFile = path.join(demoDir, 'test-copy.txt');

console.log('=== 文件系统模块演示 ===\n');

// 确保演示目录存在
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir);
  console.log('✅ 创建演示目录:', demoDir);
}

// 1. 同步文件操作（会阻塞）
console.log('1. 同步文件操作：');
try {
  // 写入文件
  const content = `Hello Node.js!
这是一个演示文件。
创建时间: ${new Date().toLocaleString()}
文件路径: ${demoFile}`;
  
  fs.writeFileSync(demoFile, content, 'utf8');
  console.log('   ✅ 同步写入文件成功');
  
  // 读取文件
  const data = fs.readFileSync(demoFile, 'utf8');
  console.log('   ✅ 同步读取文件成功，内容长度:', data.length);
  
  // 获取文件信息
  const stats = fs.statSync(demoFile);
  console.log('   📊 文件大小:', stats.size, '字节');
  console.log('   📅 修改时间:', stats.mtime.toLocaleString());
  console.log('   📁 是否为文件:', stats.isFile());
  
} catch (error) {
  console.error('   ❌ 同步操作失败:', error.message);
}

// 2. 异步文件操作（回调方式）
console.log('\n2. 异步文件操作（回调）：');

// 异步读取文件
fs.readFile(demoFile, 'utf8', (err, data) => {
  if (err) {
    console.error('   ❌ 异步读取失败:', err.message);
    return;
  }
  console.log('   ✅ 异步读取成功，前50个字符:', data.substring(0, 50) + '...');
});

// 异步复制文件
fs.copyFile(demoFile, copyFile, (err) => {
  if (err) {
    console.error('   ❌ 文件复制失败:', err.message);
    return;
  }
  console.log('   ✅ 文件复制成功');
  
  // 复制完成后，读取目录内容
  fs.readdir(demoDir, (err, files) => {
    if (err) {
      console.error('   ❌ 读取目录失败:', err.message);
      return;
    }
    console.log('   📁 目录内容:', files);
  });
});

// 3. Promise 方式（推荐）
console.log('\n3. Promise 方式文件操作：');

const fsPromises = fs.promises;

async function promiseDemo() {
  try {
    // 创建新文件
    const promiseFile = path.join(demoDir, 'promise-demo.txt');
    const promiseContent = `这是使用 Promise 方式创建的文件
创建时间: ${new Date().toISOString()}
推荐使用这种方式，代码更清晰！`;
    
    await fsPromises.writeFile(promiseFile, promiseContent, 'utf8');
    console.log('   ✅ Promise 写入文件成功');
    
    // 读取文件
    const data = await fsPromises.readFile(promiseFile, 'utf8');
    console.log('   ✅ Promise 读取文件成功');
    
    // 获取文件状态
    const stats = await fsPromises.stat(promiseFile);
    console.log('   📊 文件信息:');
    console.log('      - 大小:', stats.size, '字节');
    console.log('      - 创建时间:', stats.birthtime.toLocaleString());
    console.log('      - 是否为目录:', stats.isDirectory());
    
    // 追加内容
    await fsPromises.appendFile(promiseFile, '\n\n追加的内容！', 'utf8');
    console.log('   ✅ 追加内容成功');
    
  } catch (error) {
    console.error('   ❌ Promise 操作失败:', error.message);
  }
}

// 执行 Promise 演示
promiseDemo();

// 4. 文件监听
console.log('\n4. 文件监听演示：');

// 监听文件变化
const watcher = fs.watch(demoDir, (eventType, filename) => {
  console.log(`   🔍 文件变化: ${eventType} - ${filename}`);
});

// 5 秒后停止监听
setTimeout(() => {
  watcher.close();
  console.log('   ⏹️  停止文件监听');
}, 5000);

// 5. 流式操作（适合大文件）
console.log('\n5. 流式操作演示：');

// 创建可读流
const readStream = fs.createReadStream(demoFile, { encoding: 'utf8' });
const writeStream = fs.createWriteStream(path.join(demoDir, 'stream-copy.txt'));

readStream.on('data', (chunk) => {
  console.log('   📖 读取数据块，大小:', chunk.length);
});

readStream.on('end', () => {
  console.log('   ✅ 流式读取完成');
});

readStream.on('error', (err) => {
  console.error('   ❌ 流式读取错误:', err.message);
});

// 管道操作（推荐）
readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('   ✅ 流式写入完成');
});

// 6. 实用工具函数
console.log('\n6. 实用工具函数：');

/**
 * 检查文件是否存在
 * @param {string} filePath 文件路径
 * @returns {boolean} 是否存在
 */
function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取文件大小（字节）
 * @param {string} filePath 文件路径
 * @returns {number} 文件大小
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return -1;
  }
}

/**
 * 递归创建目录
 * @param {string} dirPath 目录路径
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 测试工具函数
console.log('   📁 文件是否存在:', fileExists(demoFile));
console.log('   📏 文件大小:', getFileSize(demoFile), '字节');

const newDir = path.join(demoDir, 'nested', 'deep', 'directory');
ensureDir(newDir);
console.log('   ✅ 递归创建目录:', newDir);

// 清理演示（5秒后）
setTimeout(() => {
  console.log('\n🧹 清理演示文件...');
  try {
    // 删除创建的文件（实际项目中要小心使用）
    if (fs.existsSync(copyFile)) fs.unlinkSync(copyFile);
    if (fs.existsSync(path.join(demoDir, 'promise-demo.txt'))) {
      fs.unlinkSync(path.join(demoDir, 'promise-demo.txt'));
    }
    if (fs.existsSync(path.join(demoDir, 'stream-copy.txt'))) {
      fs.unlinkSync(path.join(demoDir, 'stream-copy.txt'));
    }
    console.log('✅ 清理完成');
  } catch (error) {
    console.error('❌ 清理失败:', error.message);
  }
}, 6000);

console.log('\n💡 提示：');
console.log('- 生产环境推荐使用 Promise 方式');
console.log('- 大文件操作使用流式处理');
console.log('- 始终进行错误处理');
console.log('- 注意文件路径的跨平台兼容性');
