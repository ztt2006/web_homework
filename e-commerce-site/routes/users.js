const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// 注册路由
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // 检查用户是否已存在
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名或邮箱已被使用' 
      });
    }
    
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 保存用户
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    
    res.json({ 
      success: true, 
      message: '注册成功，请登录',
      userId: result.insertId 
    });
    
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后再试' 
    });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }
    
    const user = users[0];
    
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }
    
    // 设置会话
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    res.json({ 
      success: true, 
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后再试' 
    });
  }
});

// 获取当前用户信息
router.get('/current', (req, res) => {
  if (req.session.user) {
    res.json({ 
      success: true, 
      user: req.session.user 
    });
  } else {
    res.json({ 
      success: false, 
      message: '未登录' 
    });
  }
});

// 退出登录
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ 
    success: true, 
    message: '已退出登录' 
  });
});

module.exports = router; 