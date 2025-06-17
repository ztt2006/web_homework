const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', // 请修改为您自己的数据库密码
  database: 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 初始化数据库
async function initDB() {
  try {
    // 创建用户表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建产品表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        category VARCHAR(50),
        stock INT DEFAULT 0
      )
    `);
    
    // 插入一些示例产品
    const [rows] = await pool.query('SELECT * FROM products LIMIT 1');
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO products (name, description, price, image_url, category, stock)
        VALUES 
          ('智能手机', '最新款智能手机，性能强劲', 2999.00, 'images/phone.jpg', '电子产品', 100),
          ('笔记本电脑', '轻薄笔记本电脑，适合办公和学习', 4999.00, 'images/laptop.jpg', '电子产品', 50),
          ('无线耳机', '高音质蓝牙耳机，续航持久', 499.00, 'images/headphones.jpg', '配件', 200),
          ('智能手表', '多功能智能手表，健康监测', 1299.00, 'images/smartwatch.jpg', '穿戴设备', 80),
          ('平板电脑', '大屏幕平板，娱乐办公两相宜', 3599.00, 'images/tablet.jpg', '电子产品', 60),
          ('移动电源', '大容量移动电源，快速充电', 199.00, 'images/powerbank.jpg', '配件', 150),
          ('蓝牙音箱', '便携式蓝牙音箱，音质清晰', 299.00, 'images/speaker.jpg', '音响设备', 120),
          ('游戏鼠标', '高精度游戏鼠标，RGB灯效', 159.00, 'images/mouse.jpg', '配件', 180),
          ('机械键盘', '青轴机械键盘，手感舒适', 399.00, 'images/keyboard.jpg', '配件', 90),
          ('显示器', '27寸4K显示器，色彩还原准确', 1899.00, 'images/monitor.jpg', '电子产品', 45),
          ('路由器', '千兆双频路由器，信号稳定', 268.00, 'images/router.jpg', '网络设备', 75)
      `);
      console.log('示例产品数据已添加');
    }
    
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}
initDB()

module.exports = {
  pool,
  initDB
};