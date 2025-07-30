/**
 * Path 和 OS 模块演示
 * 
 * 展示路径处理和操作系统信息获取
 * 运行方式：node path-os-demo.js
 */

const path = require('path');
const os = require('os');

console.log('=== Path 和 OS 模块演示 ===\n');

// ==================== Path 模块演示 ====================
console.log('📁 Path 模块演示：');

// 基础路径信息
console.log('\n1. 基础路径信息：');
console.log('   当前文件路径:', __filename);
console.log('   当前目录路径:', __dirname);
console.log('   工作目录:', process.cwd());

// 路径解析
console.log('\n2. 路径解析：');
const samplePath = '/users/john/documents/project/app.js';
console.log('   示例路径:', samplePath);
console.log('   目录名:', path.dirname(samplePath));
console.log('   文件名:', path.basename(samplePath));
console.log('   文件名(无扩展名):', path.basename(samplePath, '.js'));
console.log('   扩展名:', path.extname(samplePath));

// 路径解析对象
const parsed = path.parse(samplePath);
console.log('\n3. 路径解析对象：');
console.log('   解析结果:', parsed);
console.log('   根目录:', parsed.root);
console.log('   目录:', parsed.dir);
console.log('   文件名:', parsed.name);
console.log('   扩展名:', parsed.ext);

// 路径拼接
console.log('\n4. 路径拼接：');
const joinedPath = path.join('/users', 'john', 'documents', 'file.txt');
console.log('   拼接路径:', joinedPath);

const resolvedPath = path.resolve('documents', 'file.txt');
console.log('   解析路径:', resolvedPath);

// 相对路径
console.log('\n5. 相对路径：');
const from = '/users/john/documents';
const to = '/users/john/pictures/photo.jpg';
const relativePath = path.relative(from, to);
console.log('   从:', from);
console.log('   到:', to);
console.log('   相对路径:', relativePath);

// 路径规范化
console.log('\n6. 路径规范化：');
const messyPath = '/users/john/../john/./documents//file.txt';
console.log('   原始路径:', messyPath);
console.log('   规范化后:', path.normalize(messyPath));

// 跨平台路径
console.log('\n7. 跨平台路径：');
console.log('   路径分隔符:', path.sep);
console.log('   路径定界符:', path.delimiter);
console.log('   POSIX 路径:', path.posix.join('users', 'john', 'file.txt'));
console.log('   Windows 路径:', path.win32.join('users', 'john', 'file.txt'));

// 实用函数
console.log('\n8. 实用路径函数：');

/**
 * 检查是否为绝对路径
 */
function isAbsolutePath(filePath) {
  return path.isAbsolute(filePath);
}

/**
 * 获取文件类型
 */
function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.json': 'JSON',
    '.html': 'HTML',
    '.css': 'CSS',
    '.png': '图片',
    '.jpg': '图片',
    '.jpeg': '图片',
    '.pdf': 'PDF文档',
    '.txt': '文本文件'
  };
  return types[ext] || '未知类型';
}

/**
 * 构建安全的文件路径
 */
function buildSafePath(base, ...segments) {
  // 过滤危险字符
  const safeSegments = segments.map(segment => 
    segment.replace(/[<>:"|?*]/g, '_')
  );
  return path.join(base, ...safeSegments);
}

// 测试实用函数
console.log('   是否绝对路径:', isAbsolutePath('/users/john'));
console.log('   是否绝对路径:', isAbsolutePath('documents/file.txt'));
console.log('   文件类型:', getFileType('app.js'));
console.log('   文件类型:', getFileType('photo.png'));
console.log('   安全路径:', buildSafePath('/uploads', 'user:123', 'file<name>.txt'));

// ==================== OS 模块演示 ====================
console.log('\n\n💻 OS 模块演示：');

// 基本系统信息
console.log('\n1. 基本系统信息：');
console.log('   操作系统:', os.type());
console.log('   平台:', os.platform());
console.log('   架构:', os.arch());
console.log('   版本:', os.release());
console.log('   主机名:', os.hostname());

// 用户信息
console.log('\n2. 用户信息：');
const userInfo = os.userInfo();
console.log('   用户名:', userInfo.username);
console.log('   用户ID:', userInfo.uid);
console.log('   组ID:', userInfo.gid);
console.log('   主目录:', userInfo.homedir);
console.log('   Shell:', userInfo.shell);

// 内存信息
console.log('\n3. 内存信息：');
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;

console.log('   总内存:', formatBytes(totalMem));
console.log('   空闲内存:', formatBytes(freeMem));
console.log('   已用内存:', formatBytes(usedMem));
console.log('   内存使用率:', ((usedMem / totalMem) * 100).toFixed(2) + '%');

// CPU 信息
console.log('\n4. CPU 信息：');
const cpus = os.cpus();
console.log('   CPU 核心数:', cpus.length);
console.log('   CPU 型号:', cpus[0].model);
console.log('   CPU 速度:', cpus[0].speed, 'MHz');

// 计算 CPU 使用率
const cpuUsage = cpus.map((cpu, index) => {
  const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
  const idle = cpu.times.idle;
  const usage = ((total - idle) / total * 100).toFixed(2);
  return { core: index, usage: usage + '%' };
});
console.log('   CPU 使用率:', cpuUsage.slice(0, 4)); // 只显示前4个核心

// 网络接口
console.log('\n5. 网络接口：');
const networkInterfaces = os.networkInterfaces();
Object.keys(networkInterfaces).forEach(name => {
  const interfaces = networkInterfaces[name];
  const ipv4 = interfaces.find(iface => iface.family === 'IPv4' && !iface.internal);
  if (ipv4) {
    console.log(`   ${name}: ${ipv4.address}`);
  }
});

// 系统运行时间
console.log('\n6. 系统运行时间：');
const uptime = os.uptime();
console.log('   系统运行时间:', formatUptime(uptime));
console.log('   Node.js 运行时间:', formatUptime(process.uptime()));

// 临时目录
console.log('\n7. 系统目录：');
console.log('   临时目录:', os.tmpdir());
console.log('   用户主目录:', os.homedir());

// 系统常量
console.log('\n8. 系统常量：');
console.log('   行结束符长度:', os.EOL.length);
console.log('   行结束符编码:', JSON.stringify(os.EOL));

// 负载平均值（仅 Unix 系统）
if (os.platform() !== 'win32') {
  console.log('\n9. 负载平均值：');
  const loadavg = os.loadavg();
  console.log('   1分钟:', loadavg[0].toFixed(2));
  console.log('   5分钟:', loadavg[1].toFixed(2));
  console.log('   15分钟:', loadavg[2].toFixed(2));
}

// 实用工具函数
/**
 * 格式化字节数
 */
function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化运行时间
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let result = '';
  if (days > 0) result += `${days}天 `;
  if (hours > 0) result += `${hours}小时 `;
  if (minutes > 0) result += `${minutes}分钟 `;
  result += `${secs}秒`;
  
  return result;
}

/**
 * 获取系统信息摘要
 */
function getSystemSummary() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem()),
    cpuCores: os.cpus().length,
    uptime: formatUptime(os.uptime()),
    hostname: os.hostname()
  };
}

console.log('\n📊 系统信息摘要：');
console.log(getSystemSummary());

console.log('\n💡 实际应用场景：');
console.log('- 路径处理：文件上传、静态资源服务');
console.log('- 系统监控：性能监控、健康检查');
console.log('- 环境适配：跨平台兼容性处理');
console.log('- 资源管理：内存、CPU 使用率监控');
