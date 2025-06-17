const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { initDB } = require('./config/db');

// 导入路由
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

// 初始化应用
const app = express();

// 初始化数据库
initDB();

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 会话配置
app.use(session({
  secret: 'ecommerce_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1小时
}));

// 设置路由
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

// 提供前端页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// 异常处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log('访问 http://localhost:3000 查看应用');
  
}); 