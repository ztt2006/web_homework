const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// 获取所有产品
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error('获取产品错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后再试' 
    });
  }
});

// 获取单个产品详情
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '产品未找到' 
      });
    }
    
    res.json({ 
      success: true, 
      product: products[0] 
    });
  } catch (error) {
    console.error('获取产品详情错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后再试' 
    });
  }
});

// 按类别获取产品
router.get('/category/:category', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ?',
      [req.params.category]
    );
    
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error('按类别获取产品错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后再试' 
    });
  }
});

// 搜索产品
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    
    const [products] = await pool.query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
      [searchQuery, searchQuery]
    );
    
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error('搜索产品错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后再试' 
    });
  }
});

module.exports = router; 