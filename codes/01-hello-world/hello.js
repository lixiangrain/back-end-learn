/**
 * Node.js 入门示例：Hello World
 * 
 * 这是你的第一个 Node.js 程序！
 * 运行方式：node hello.js
 */

// 基础输出
console.log('Hello, Node.js World!');
console.log('欢迎来到后端开发的世界！');

// 显示 Node.js 环境信息
console.log('\n=== Node.js 环境信息 ===');
console.log('Node.js 版本:', process.version);
console.log('当前工作目录:', process.cwd());
console.log('操作系统平台:', process.platform);
console.log('CPU 架构:', process.arch);

// 显示全局对象信息
console.log('\n=== 全局对象信息 ===');
console.log('全局对象类型:', typeof global);
console.log('当前文件路径:', __filename);
console.log('当前目录路径:', __dirname);

// 环境变量示例
console.log('\n=== 环境变量 ===');
console.log('NODE_ENV:', process.env.NODE_ENV || '未设置');
console.log('PATH 长度:', process.env.PATH ? process.env.PATH.length : 0, '字符');

// 命令行参数
console.log('\n=== 命令行参数 ===');
console.log('所有参数:', process.argv);
console.log('用户参数:', process.argv.slice(2)); // 去掉 node 和文件名

// 进程信息
console.log('\n=== 进程信息 ===');
console.log('进程 ID:', process.pid);
console.log('父进程 ID:', process.ppid);
console.log('运行时间:', process.uptime(), '秒');

// 内存使用情况
const memoryUsage = process.memoryUsage();
console.log('\n=== 内存使用情况 ===');
console.log('RSS (常驻内存):', Math.round(memoryUsage.rss / 1024 / 1024), 'MB');
console.log('堆内存总量:', Math.round(memoryUsage.heapTotal / 1024 / 1024), 'MB');
console.log('堆内存使用:', Math.round(memoryUsage.heapUsed / 1024 / 1024), 'MB');
console.log('外部内存:', Math.round(memoryUsage.external / 1024 / 1024), 'MB');

// 演示异步特性
console.log('\n=== 异步特性演示 ===');
console.log('1. 同步代码开始');

// 使用 setTimeout 演示异步
setTimeout(() => {
  console.log('3. 异步代码执行（1秒后）');
}, 1000);

console.log('2. 同步代码结束');

// 演示 setImmediate
setImmediate(() => {
  console.log('4. setImmediate 执行');
});

// 演示 process.nextTick
process.nextTick(() => {
  console.log('5. process.nextTick 执行（优先级最高）');
});

console.log('\n程序启动完成！观察输出顺序，理解事件循环机制。');
