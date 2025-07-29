// 数据库配置
import mysql from 'mysql2';

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',      // 数据库地址
  user: 'root',           // 数据库用户
  password: '',           // 数据库密码
  database: 'blog_db',    // 数据库名称
  connectionLimit: 10,    // 连接池最大连接数
  charset: 'utf8mb4',     // 字符集
  supportBigNumbers: true // 支持大数字
});

// 获取数据库连接
function getConnection(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('数据库连接失败:', err);
      return callback(err, null);
    }
    callback(null, connection);
  });
}

const promisePool = pool.promise();

export { promisePool as pool, getConnection };