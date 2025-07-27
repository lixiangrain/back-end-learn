/**
 * 浏览器环境 vs Node.js 环境对比
 * 
 * 这个文件展示了浏览器和 Node.js 环境的主要区别
 * 运行方式：node browser-vs-node.js
 */

console.log('=== 浏览器 vs Node.js 环境对比 ===\n');

// 1. 全局对象的区别
console.log('1. 全局对象：');
console.log('   Node.js 中的全局对象:', typeof global);
console.log('   浏览器中的全局对象: window (在 Node.js 中不存在)');
console.log('   通用全局对象: globalThis');
console.log('   globalThis === global:', globalThis === global);

// 2. 模块系统
console.log('\n2. 模块系统：');
console.log('   Node.js: 支持 CommonJS (require/module.exports)');
console.log('   浏览器: 原生支持 ES Modules (import/export)');
console.log('   当前模块路径:', __filename);
console.log('   当前目录路径:', __dirname);

// 3. API 差异
console.log('\n3. 可用 API：');

// Node.js 特有的 API
console.log('   Node.js 特有：');
console.log('   - process 对象:', typeof process);
console.log('   - Buffer 类:', typeof Buffer);
console.log('   - require 函数:', typeof require);
console.log('   - __filename:', typeof __filename);
console.log('   - __dirname:', typeof __dirname);

// 浏览器特有的 API（在 Node.js 中不存在）
console.log('   浏览器特有（Node.js 中不存在）：');
console.log('   - window:', typeof window);
console.log('   - document:', typeof document);
console.log('   - localStorage:', typeof localStorage);
console.log('   - fetch:', typeof fetch); // Node.js 18+ 开始支持

// 4. 共同的 API
console.log('\n4. 共同支持的 API：');
console.log('   - console:', typeof console);
console.log('   - setTimeout:', typeof setTimeout);
console.log('   - setInterval:', typeof setInterval);
console.log('   - JSON:', typeof JSON);
console.log('   - Promise:', typeof Promise);

// 5. 文件系统访问
console.log('\n5. 文件系统：');
console.log('   Node.js: 可以直接访问文件系统 (fs 模块)');
console.log('   浏览器: 出于安全考虑，不能直接访问文件系统');

// 6. 网络请求
console.log('\n6. 网络请求：');
console.log('   Node.js: http/https 模块，fetch (18+)');
console.log('   浏览器: fetch, XMLHttpRequest');

// 7. 事件循环差异
console.log('\n7. 事件循环：');
console.log('   两者都是单线程 + 事件循环，但实现细节不同');
console.log('   Node.js: libuv 实现');
console.log('   浏览器: 各浏览器引擎实现');

// 8. 演示 Node.js 特有功能
console.log('\n8. Node.js 特有功能演示：');

// 使用 Buffer
const buffer = Buffer.from('Hello Node.js', 'utf8');
console.log('   Buffer 示例:', buffer);
console.log('   Buffer 转字符串:', buffer.toString());

// 使用 process
console.log('   进程 ID:', process.pid);
console.log('   命令行参数:', process.argv.slice(2));

// 环境变量
console.log('   环境变量示例 NODE_ENV:', process.env.NODE_ENV || '未设置');

// 9. 模块加载演示
console.log('\n9. 模块系统演示：');
const path = require('path'); // Node.js 内置模块
console.log('   加载 path 模块成功');
console.log('   当前文件扩展名:', path.extname(__filename));

// 10. 总结
console.log('\n=== 总结 ===');
console.log('Node.js 让 JavaScript 脱离了浏览器环境，');
console.log('可以用来开发服务器、命令行工具、桌面应用等。');
console.log('虽然语言是相同的，但运行环境和可用 API 有很大差异。');
console.log('作为前端开发者，你已经掌握了 JavaScript，');
console.log('现在只需要学习 Node.js 特有的 API 和概念即可！');
