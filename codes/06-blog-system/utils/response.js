/**
 * 统一响应处理工具
 * 
 * 提供统一的API响应格式，包括成功响应和失败响应
 * 格式：{ code: number, message: string, data: any }
 */

/**
 * 成功响应
 * @param {any} data - 返回的数据
 * @param {string} message - 响应消息
 * @param {number} code - 状态码
 * @returns {Object} 统一响应格式
 */
const success = (data = null, message = 'success', code = 200) => {
  return {
    code,
    message,
    data
  };
};

/**
 * 失败响应
 * @param {string} message - 错误消息
 * @param {any} data - 返回的数据（可选）
 * @param {number} code - 状态码
 * @returns {Object} 统一响应格式
 */
const error = (message = 'error', data = null, code = 500) => {
  return {
    code,
    message,
    data
  };
};

export {
  success,
  error
};