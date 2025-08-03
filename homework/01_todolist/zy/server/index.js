import http from 'http';
import url from 'url';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 首先定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用 todos.json 作为数据文件（而不是 todoInfo.json）
const dataPath = path.join(__dirname, 'todos.json');

// 初始化数据文件 - 如果不存在则创建
if (!fs.existsSync(dataPath)) {
  // 如果文件不存在，使用默认数据创建
  const defaultTodos = [
    { id: 1, text: '默认任务', completed: false }
  ];
  fs.writeFileSync(dataPath, JSON.stringify(defaultTodos, null, 2));
  console.log('已创建新的 todos.json 文件');
} else {
  // 检查文件是否有有效内容
  const content = fs.readFileSync(dataPath, 'utf8');
  if (!content.trim()) {
    const defaultTodos = [
      { id: 1, text: '默认任务', completed: false }
    ];
    fs.writeFileSync(dataPath, JSON.stringify(defaultTodos, null, 2));
    console.log('已初始化空的 todos.json 文件');
  }
}

// 读取待办事项
function readTodos() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    console.log('当前待办事项数据:', data);
    return JSON.parse(data);
  } catch (err) {
    console.error('读取文件失败:', err);
    return [];
  }
}

// 写入待办事项
function writeTodos(todos) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2));
    console.log('已成功写入待办事项');
  } catch (err) {
    console.error('写入文件失败:', err);
    throw err; // 抛出错误以便上层处理
  }
}

// 路由处理函数
function handleGetTodos(req, res, todos) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(todos));
}

function handlePostTodo(req, res, body, todos) {
  const { text } = JSON.parse(body);
  const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  const newTodo = {
    id: newId,
    text,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(newTodo));
}

function handlePutTodo(req, res, pathname, body, todos) {
  const id = parseInt(pathname.split('/')[3]);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Todo not found' }));
    return;
  }
  
  const updatedData = JSON.parse(body);
  todos[todoIndex] = { ...todos[todoIndex], ...updatedData };
  writeTodos(todos);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(todos[todoIndex]));
}

function handleDeleteTodo(req, res, pathname, todos) {
  const id = parseInt(pathname.split('/')[3]);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Todo not found' }));
    return;
  }
  
  const deletedTodo = todos[todoIndex];
  todos.splice(todoIndex, 1);
  writeTodos(todos);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(deletedTodo));
}

const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      let todos = readTodos();
      
      // 路由分发
      if (pathname === '/api/todos') {
        if (method === 'GET') return handleGetTodos(req, res, todos);
        if (method === 'POST') return handlePostTodo(req, res, body, todos);
      } else if (pathname.startsWith('/api/todos/')) {
        if (method === 'PUT') return handlePutTodo(req, res, pathname, body, todos);
        if (method === 'DELETE') return handleDeleteTodo(req, res, pathname, todos);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    } catch (error) {
      console.error('处理请求出错:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message
      }));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`使用数据文件: ${dataPath}`);
});