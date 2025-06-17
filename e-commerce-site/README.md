# 数码科技商城

这是一个基于Express和MySQL的电商网站项目，前端使用HTML、CSS和JavaScript实现。

## 功能特点

- 用户注册和登录功能
- 产品展示和分类浏览
- 响应式页面设计
- 美观的UI界面
- 轮播图特效
- 动画和过渡效果
- 滚动特效

## 技术栈

- **前端**：HTML，CSS，JavaScript
- **后端**：Express (Node.js)
- **数据库**：MySQL

## 主要功能实现

### 前端特效

1. **轮播图**：在首页实现自动轮播效果
2. **动画效果**：页面元素加载时的淡入动画
3. **滚动特效**：滚动时导航栏样式变化，平滑滚动效果

### 后端功能

1. **用户认证**：注册、登录、会话管理
2. **产品管理**：产品展示、分类、搜索

### 表单验证

1. 注册表单使用正则表达式进行验证：
   - 用户名验证：5-20个字符，只能包含字母、数字、下划线
   - 邮箱验证：标准邮箱格式
   - 密码验证：至少8个字符，包含字母和数字

### 本地存储

使用localStorage和sessionStorage实现登录状态管理：
1. localStorage存储用户信息，持久化登录状态
2. sessionStorage用于临时会话存储

## 项目结构

```
e-commerce-site/
│
├── config/              # 配置文件
│   └── db.js            # 数据库配置
│
├── public/              # 静态资源
│   ├── css/             # 样式文件
│   │   └── style.css    # 主样式文件
│   ├── js/              # JavaScript文件
│   │   ├── main.js      # 主页面脚本
│   │   └── auth.js      # 认证相关脚本
│   └── images/          # 图片资源
│
├── routes/              # 路由处理
│   ├── users.js         # 用户相关路由
│   └── products.js      # 产品相关路由
│
├── views/               # 前端页面
│   ├── index.html       # 首页
│   ├── login.html       # 登录页
│   └── register.html    # 注册页
│
├── app.js               # 应用入口文件
└── package.json         # 项目依赖配置
```

## 安装和运行

1. 确保安装了Node.js和MySQL

2. 克隆项目
```
git clone <项目地址>
cd e-commerce-site
```

3. 安装依赖
```
npm install
```

4. 配置数据库
   修改 `config/db.js` 中的数据库连接信息

5. 运行项目
```
npm start
```

6. 访问网站
   打开浏览器访问 `http://localhost:3000`

## 注意事项

- 在使用前请确保已创建名为 `ecommerce_db` 的MySQL数据库
- 默认服务器端口为3000，可在app.js中修改
- 示例产品会在首次运行时自动添加到数据库中 