// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', () => {
    // 检查用户是否登录
    checkUserLogin();
    
    // 加载产品数据
    fetchProducts();
    
    // 初始化动画效果
    initAnimations();
    
    // 添加滚动特效
    initScrollEffects();
});

// 检查用户是否登录
function checkUserLogin() {
    // 从localStorage获取用户信息
    const user = JSON.parse(localStorage.getItem('user'));
    
    // 获取导航栏用户容器
    const navUserContainer = document.getElementById('nav-user-container');
    
    if (user) {
        // 如果用户已登录，显示用户信息和退出按钮
        navUserContainer.innerHTML = `
            <div class="user-info">
                <span>欢迎，${user.username}</span>
                <button id="logout-btn" class="btn btn-danger">退出</button>
            </div>
        `;
        
        // 添加退出按钮点击事件
        document.getElementById('logout-btn').addEventListener('click', () => {
            // 清除localStorage中的用户信息
            localStorage.removeItem('user');
            // 清除sessionStorage中的用户信息
            sessionStorage.removeItem('user');
            // 刷新页面
            window.location.reload();
        });
    } else {
        // 如果用户未登录，显示登录/注册按钮
        navUserContainer.innerHTML = `
            <a href="/login" class="btn">登录/注册</a>
        `;
    }
}

// 获取产品数据
async function fetchProducts() {
    try {
        // 从API获取产品数据
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
            // 渲染产品列表
            renderProducts(data.products);
        } else {
            console.error('获取产品失败:', data.message);
        }
    } catch (error) {
        console.error('获取产品错误:', error);
        
        // 如果API调用失败，使用本地模拟数据
        const mockProducts = [
            {
                id: 1,
                name: '智能手机',
                description: '最新款智能手机，性能强劲',
                price: 2999.00,
                image_url: 'images/phone.jpg',
                category: '电子产品',
                stock: 100
            },
            {
                id: 2,
                name: '笔记本电脑',
                description: '轻薄笔记本电脑，适合办公和学习',
                price: 4999.00,
                image_url: 'images/laptop.jpg',
                category: '电子产品',
                stock: 50
            },
            {
                id: 3,
                name: '无线耳机',
                description: '高音质蓝牙耳机，续航持久',
                price: 499.00,
                image_url: 'images/headphones.jpg',
                category: '配件',
                stock: 200
            },
            {
                id: 4,
                name: '智能手表',
                description: '多功能智能手表，健康监测',
                price: 1299.00,
                image_url: 'images/smartwatch.jpg',
                category: '穿戴设备',
                stock: 80
            },
            {
                id: 5,
                name: '平板电脑',
                description: '大屏幕平板，娱乐办公两相宜',
                price: 3599.00,
                image_url: 'images/tablet.jpg',
                category: '电子产品',
                stock: 60
            },
            {
                id: 6,
                name: '移动电源',
                description: '大容量移动电源，快速充电',
                price: 199.00,
                image_url: 'images/powerbank.jpg',
                category: '配件',
                stock: 150
            }
        ];
        
        renderProducts(mockProducts);
    }
}

// 渲染产品列表
function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    // 遍历产品数组，创建产品卡片
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image_url}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+5pWw5o2u5Zub54mH</text></svg>'">
            <div class="product-info">
                <span class="category">${product.category || '未分类'}</span>
                <h3>${product.name || '未知商品'}</h3>
                <p>${product.description || '暂无描述'}</p>
                <div class="price">¥ ${parseFloat(product.price || 0).toFixed(2)}</div>
                <button class="btn add-to-cart-btn">加入购物车</button>
            </div>
        </div>
    `).join('');
    
    // 添加产品卡片点击事件
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            // 跳转到产品详情页面
            // window.location.href = `/product/${productId}`;
            alert(`查看产品详情: ${productId}`);
        });
    });
    
    // 添加"加入购物车"按钮点击事件
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            
            // 获取产品ID
            const productId = button.closest('.product-card').getAttribute('data-id');
            const productName = button.closest('.product-card').querySelector('h3').textContent;
            
            // 添加到购物车的逻辑
            addToCart(productId, productName);
        });
    });
}

// 添加到购物车功能
function addToCart(productId, productName) {
    // 检查用户是否登录
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert('请先登录再添加商品到购物车');
        window.location.href = '/login';
        return;
    }
    
    // 从localStorage获取购物车数据
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查商品是否已在购物车中
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        // 如果商品已存在，增加数量
        existingItem.quantity += 1;
    } else {
        // 如果商品不存在，添加新商品
        cart.push({
            productId: productId,
            productName: productName,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // 保存到localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 显示成功消息
    showNotification(`${productName} 已添加到购物车`);
    
    // 更新购物车数量显示
    updateCartCount();
}

// 显示通知消息
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 更新购物车数量显示
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 更新购物车图标上的数量
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// 初始化动画效果
function initAnimations() {
    // 滚动时显示动画
    const animatedElements = document.querySelectorAll('.animated');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 添加滚动特效
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
}