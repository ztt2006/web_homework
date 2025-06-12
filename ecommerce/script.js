// DOM 元素获取
const searchInput = document.getElementById('searchInput');
const searchHistory = document.getElementById('searchHistory');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const cartIcon = document.getElementById('cartIcon');
const cartDropdown = document.getElementById('cartDropdown');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const categoryBtn = document.getElementById('categoryBtn');
const categoryList = document.getElementById('categoryList');
const mainImage = document.getElementById('mainImage');
const currentImage = document.getElementById('currentImage');
const zoomLens = document.getElementById('zoomLens');
const zoomResult = document.getElementById('zoomResult');
const zoomedImage = document.getElementById('zoomedImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const colorBtns = document.querySelectorAll('.color-btn');
const storageBtns = document.querySelectorAll('.storage-btn');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyInput = document.getElementById('qtyInput');
const addToCartBtn = document.getElementById('addToCartBtn');
const comboBtns = document.querySelectorAll('.add-combo-btn');
const comboTotal = document.getElementById('comboTotal');
const addComboCartBtn = document.getElementById('addComboCartBtn');

// 全局变量
let searchHistoryData = JSON.parse(localStorage.getItem('searchHistory')) || [];
let cartData = JSON.parse(localStorage.getItem('cartData')) || [];
let selectedCombos = new Set();
let currentProduct = {
    id: 'iphone15pro',
    name: 'Apple iPhone 15 Pro Max',
    price: 10999,
    originalPrice: 12999,
    color: 'black',
    storage: '512',
    image: currentImage.src
};

// 图片数据
const productImages = {
    1: {
        main: "images/phone-black-main.jpg",
        zoom: "images/phone-black-zoom.jpg"
    },
    2: {
        main: "images/phone-blue-main.jpg",
        zoom: "images/phone-blue-zoom.jpg"
    },
    3: {
        main: "images/phone-gold-main.jpg",
        zoom: "images/phone-gold-zoom.jpg"
    },
    4: {
        main: "images/phone-white-main.jpg",
        zoom: "images/phone-white-zoom.jpg"
    }
};

// 搭配商品数据
const comboProducts = [
    { id: 'case', name: '苹果官方手机壳', price: 399 },
    { id: 'charger', name: '20W USB-C 充电器', price: 149 },
    { id: 'airpods', name: 'AirPods Pro 第二代', price: 1899 }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initDefaultImage();
    handleImageError();
    initSearchHistory();
    initCart();
    initProductOptions();
    initZoomEffect();
    updateComboTotal();
    
    // 延迟调试，确保图片加载完成
    setTimeout(() => {
        debugImages();
    }, 1000);
});

// 搜索历史功能
function initSearchHistory() {
    renderSearchHistory();
    
    // 搜索输入框事件
    searchInput.addEventListener('focus', showSearchHistory);
    searchInput.addEventListener('blur', function(e) {
        // 延迟隐藏，以便点击历史记录
        setTimeout(() => {
            if (!searchHistory.matches(':hover')) {
                hideSearchHistory();
            }
        }, 200);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 搜索按钮事件
    document.querySelector('.search-btn').addEventListener('click', performSearch);
    
    // 清空历史记录
    clearHistoryBtn.addEventListener('click', clearSearchHistory);
}

function showSearchHistory() {
    if (searchHistoryData.length > 0) {
        searchHistory.classList.add('show');
    }
}

function hideSearchHistory() {
    searchHistory.classList.remove('show');
}

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        addToSearchHistory(query);
        // 这里可以添加实际的搜索逻辑
    }
}

function addToSearchHistory(query) {
    // 移除重复项
    searchHistoryData = searchHistoryData.filter(item => item !== query);
    // 添加到开头
    searchHistoryData.unshift(query);
    // 限制历史记录数量
    if (searchHistoryData.length > 10) {
        searchHistoryData = searchHistoryData.slice(0, 10);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
    renderSearchHistory();
}

function removeFromSearchHistory(query) {
    searchHistoryData = searchHistoryData.filter(item => item !== query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
    renderSearchHistory();
}

function clearSearchHistory() {
    searchHistoryData = [];
    localStorage.removeItem('searchHistory');
    renderSearchHistory();
    hideSearchHistory();
}

function renderSearchHistory() {
    if (searchHistoryData.length === 0) {
        historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">暂无搜索历史</div>';
        return;
    }
    
    historyList.innerHTML = searchHistoryData.map(item => `
        <div class="history-item" onclick="selectSearchHistory('${item}')">
            <span>${item}</span>
            <button class="delete-btn" onclick="event.stopPropagation(); removeFromSearchHistory('${item}')">×</button>
        </div>
    `).join('');
}

function selectSearchHistory(query) {
    searchInput.value = query;
    hideSearchHistory();
    performSearch();
}

// 购物车功能
function initCart() {
    updateCartDisplay();
    
    // 购物车图标点击事件
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('show');
    });
    
    // 点击其他地方隐藏购物车
    document.addEventListener('click', function(e) {
        if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });
}

function addToCart(product, quantity = 1) {
    const existingItem = cartData.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.storage === product.storage
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartData.push({
            ...product,
            quantity: quantity,
            addTime: Date.now()
        });
    }
    
    localStorage.setItem('cartData', JSON.stringify(cartData));
    updateCartDisplay();
    showCartAnimation();
}

function removeFromCart(index) {
    cartData.splice(index, 1);
    localStorage.setItem('cartData', JSON.stringify(cartData));
    updateCartDisplay();
}

function updateCartDisplay() {
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cartData.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">购物车为空</div>';
    } else {
        cartItems.innerHTML = cartData.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} ${item.color} ${item.storage}GB</div>
                    <div class="cart-item-price">¥${item.price}</div>
                    <div class="cart-item-qty">数量: ${item.quantity}</div>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #999; cursor: pointer; font-size: 18px;">×</button>
            </div>
        `).join('');
    }
}

function showCartAnimation() {
    // 添加购物车动画效果
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// 分类下拉菜单
categoryBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    categoryBtn.classList.toggle('active');
    categoryList.classList.toggle('show');
});

document.addEventListener('click', function(e) {
    if (!categoryBtn.contains(e.target) && !categoryList.contains(e.target)) {
        categoryBtn.classList.remove('active');
        categoryList.classList.remove('show');
    }
});

// 选项卡功能
function initProductOptions() {
    // 店铺信息选项卡
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 更新按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新面板显示
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
    
    // 颜色选择
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentProduct.color = this.dataset.color;
            updateProductTitle();
        });
    });
    
    // 存储容量选择
    storageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            storageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentProduct.storage = this.dataset.storage;
            updateProductTitle();
            updateProductPrice();
        });
    });
    
    // 数量选择
    qtyMinus.addEventListener('click', function() {
        let currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    });
    
    qtyPlus.addEventListener('click', function() {
        let currentQty = parseInt(qtyInput.value);
        qtyInput.value = currentQty + 1;
    });
    
    qtyInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        }
    });
    
    // 加入购物车
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(qtyInput.value);
        const productToAdd = {
            ...currentProduct,
            name: document.querySelector('.product-title').textContent
        };
        addToCart(productToAdd, quantity);
    });
}

function updateProductTitle() {
    const colorText = document.querySelector(`.color-btn[data-color="${currentProduct.color}"]`).textContent;
    const storageText = document.querySelector(`.storage-btn[data-storage="${currentProduct.storage}"]`).textContent;
    document.querySelector('.product-title').textContent = `Apple iPhone 15 Pro Max ${storageText} ${colorText}`;
}

function updateProductPrice() {
    const storage = currentProduct.storage;
    let price = 8999; // 基础价格256GB
    let originalPrice = 10999;
    
    if (storage === '512') {
        price = 10999;
        originalPrice = 12999;
    } else if (storage === '1024') {
        price = 12999;
        originalPrice = 14999;
    }
    
    currentProduct.price = price;
    currentProduct.originalPrice = originalPrice;
    
    document.querySelector('.current-price').textContent = `¥${price.toLocaleString()}`;
    document.querySelector('.original-price').textContent = `¥${originalPrice.toLocaleString()}`;
}

// 修改初始化函数以正确设置图片
function initDefaultImage() {
    const currentImage = document.getElementById('currentImage');
    const zoomedImage = document.getElementById('zoomedImage');
    const zoomResult = document.getElementById('zoomResult');
    const mainImage = document.getElementById('mainImage');
    
    if (currentImage && productImages[1]) {
        currentImage.src = productImages[1].main;
        currentProduct.image = productImages[1].main;
        
        // 确保图片可见
        currentImage.style.display = 'block';
        currentImage.style.visibility = 'visible';
        currentImage.style.opacity = '1';
    }
    
    if (zoomedImage && productImages[1]) {
        zoomedImage.src = productImages[1].zoom;
        
        // 确保放大图片可见并设置正确的样式
        zoomedImage.style.display = 'block';
        zoomedImage.style.visibility = 'visible';
        zoomedImage.style.opacity = '1';
        zoomedImage.style.position = 'absolute';
        zoomedImage.style.top = '0';
        zoomedImage.style.left = '0';
    }
    
    // 确保主图容器的定位
    if (mainImage) {
        mainImage.style.position = 'relative';
    }
    
    // 放大容器初始化（将在initZoomEffect中设置固定位置）
    if (zoomResult) {
        zoomResult.style.display = 'none'; // 初始隐藏
    }
}

// 修改放大镜效果初始化
function initZoomEffect() {
    const currentImage = document.getElementById('currentImage');
    const zoomedImage = document.getElementById('zoomedImage');
    const mainImage = document.getElementById('mainImage');
    const zoomLens = document.getElementById('zoomLens');
    const zoomResult = document.getElementById('zoomResult');
    
    // 缩略图点击
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const imageId = this.dataset.image;
            
            // 更新缩略图状态
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新主图和放大图
            if (productImages[imageId] && currentImage && zoomedImage) {
                currentImage.src = productImages[imageId].main;
                zoomedImage.src = productImages[imageId].zoom;
                currentProduct.image = productImages[imageId].main;
                
                // 强制显示图片
                currentImage.style.display = 'block';
                currentImage.style.visibility = 'visible';
                currentImage.style.opacity = '1';
                
                // 重新设置放大图片样式
                zoomedImage.style.display = 'block';
                zoomedImage.style.visibility = 'visible';
                zoomedImage.style.opacity = '1';
                zoomedImage.style.position = 'absolute';
                zoomedImage.style.top = '0';
                zoomedImage.style.left = '0';
                zoomedImage.style.width = 'auto';
                zoomedImage.style.height = 'auto';
            }
        });
    });
    
    // 放大镜效果
    if (mainImage && zoomLens && zoomResult && zoomedImage) {
        // 确保放大镜框的样式
        zoomLens.style.position = 'absolute';
        zoomLens.style.border = '2px solid #000';
        zoomLens.style.cursor = 'none';
        zoomLens.style.width = '100px';
        zoomLens.style.height = '100px';
        zoomLens.style.backgroundColor = 'rgba(255,255,255,0.3)';
        zoomLens.style.pointerEvents = 'none';
        zoomLens.style.display = 'none';
        
        // 设置放大结果框固定在右上角
        const mainImageRect = mainImage.getBoundingClientRect();
        zoomResult.style.position = 'absolute';
        zoomResult.style.top = '0px';
        zoomResult.style.right = '-420px'; // 距离主图右边20px
        zoomResult.style.width = '400px';
        zoomResult.style.height = '400px';
        zoomResult.style.border = '2px solid #ccc';
        zoomResult.style.borderRadius = '8px';
        zoomResult.style.overflow = 'hidden';
        zoomResult.style.backgroundColor = '#fff';
        zoomResult.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        zoomResult.style.zIndex = '1000';
        
        mainImage.addEventListener('mouseenter', function() {
            zoomLens.style.display = 'block';
            zoomResult.style.display = 'block';
            zoomResult.style.visibility = 'visible';
            
            // 确保放大图片在容器内可见
            if (zoomedImage) {
                zoomedImage.style.display = 'block';
                zoomedImage.style.visibility = 'visible';
                zoomedImage.style.opacity = '1';
                zoomedImage.style.position = 'absolute';
                zoomedImage.style.top = '0';
                zoomedImage.style.left = '0';
            }
        });
        
        mainImage.addEventListener('mouseleave', function() {
            zoomLens.style.display = 'none';
            zoomResult.style.display = 'none';
        });
        
        mainImage.addEventListener('mousemove', function(e) {
            // 获取主图容器的位置信息
            const mainImageRect = this.getBoundingClientRect();
            const currentImageRect = currentImage.getBoundingClientRect();
            
            // 计算鼠标在当前图片上的相对位置
            const x = e.clientX - currentImageRect.left;
            const y = e.clientY - currentImageRect.top;
            
            // 获取镜头大小
            const lensWidth = parseInt(zoomLens.style.width) || 100;
            const lensHeight = parseInt(zoomLens.style.height) || 100;
            
            // 计算镜头位置（相对于mainImage容器）
            const lensX = x - lensWidth / 2;
            const lensY = y - lensHeight / 2;
            
            // 获取图片的实际显示尺寸
            const imgWidth = currentImage.offsetWidth;
            const imgHeight = currentImage.offsetHeight;
            
            // 限制镜头在图片范围内
            const maxX = imgWidth - lensWidth;
            const maxY = imgHeight - lensHeight;
            
            const finalX = Math.max(0, Math.min(lensX, maxX));
            const finalY = Math.max(0, Math.min(lensY, maxY));
            
            // 设置镜头位置（相对于mainImage容器）
            zoomLens.style.left = (currentImageRect.left - mainImageRect.left + finalX) + 'px';
            zoomLens.style.top = (currentImageRect.top - mainImageRect.top + finalY) + 'px';
            
            // 计算放大图片的位置（放大框固定在右上角，只需要计算图片移动）
            if (maxX > 0 && maxY > 0 && zoomedImage.naturalWidth > 0 && zoomResult.offsetWidth > 0) {
                // 计算放大比例（通常是2-3倍放大）
                const zoomFactor = 2.5;
                const scaleX = zoomFactor;
                const scaleY = zoomFactor;
                
                // 计算放大图片应该移动的距离
                const moveX = (finalX / imgWidth) * (zoomedImage.naturalWidth * scaleX - zoomResult.offsetWidth);
                const moveY = (finalY / imgHeight) * (zoomedImage.naturalHeight * scaleY - zoomResult.offsetHeight);
                
                zoomedImage.style.left = -moveX + 'px';
                zoomedImage.style.top = -moveY + 'px';
                
                // 设置放大图片的尺寸
                zoomedImage.style.width = (zoomedImage.naturalWidth * scaleX) + 'px';
                zoomedImage.style.height = (zoomedImage.naturalHeight * scaleY) + 'px';
            }
        });
    }
}

// 产品搭配功能
comboBtns.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const comboId = comboProducts[index].id;
        
        if (selectedCombos.has(comboId)) {
            selectedCombos.delete(comboId);
            this.classList.remove('added');
            this.textContent = '+';
        } else {
            selectedCombos.add(comboId);
            this.classList.add('added');
            this.textContent = '✓';
        }
        
        updateComboTotal();
    });
});

function updateComboTotal() {
    let total = currentProduct.price;
    
    selectedCombos.forEach(comboId => {
        const combo = comboProducts.find(p => p.id === comboId);
        if (combo) {
            total += combo.price;
        }
    });
    
    comboTotal.textContent = total.toLocaleString();
}

// 搭配商品加入购物车
addComboCartBtn.addEventListener('click', function() {
    const quantity = parseInt(qtyInput.value);
    
    // 添加主商品
    const mainProduct = {
        ...currentProduct,
        name: document.querySelector('.product-title').textContent
    };
    addToCart(mainProduct, quantity);
    
    // 添加选中的搭配商品
    selectedCombos.forEach(comboId => {
        const combo = comboProducts.find(p => p.id === comboId);
        if (combo) {
            const comboProduct = {
                id: combo.id,
                name: combo.name,
                price: combo.price,
                color: '',
                storage: '',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEwIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg=='
            };
            addToCart(comboProduct, quantity);
        }
    });
    
    // 显示成功提示
    showSuccessMessage('商品已加入购物车！');
});

// 成功提示
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 响应式处理
function handleResize() {
    if (window.innerWidth <= 768) {
        // 移动端处理
        zoomResult.style.display = 'none';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 快速搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // ESC 关闭下拉菜单
    if (e.key === 'Escape') {
        categoryList.classList.remove('show');
        categoryBtn.classList.remove('active');
        cartDropdown.classList.remove('show');
        hideSearchHistory();
    }
});

// 页面可见性变化时保存数据
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        localStorage.setItem('cartData', JSON.stringify(cartData));
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
    }
});

// 添加图片加载错误处理
function handleImageError() {
    // 默认占位图片
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEwIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==';
    
    // 为所有图片添加错误处理
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = defaultImage;
            this.style.display = 'block';
            this.style.visibility = 'visible';
        });
        
        // 添加加载成功的处理
        img.addEventListener('load', function() {
            // 确保图片可见
            this.style.display = 'block';
            this.style.visibility = 'visible';
            this.style.opacity = '1';
            
            // 如果是主图或放大图，强制重新计算样式
            if (this.id === 'currentImage') {
                this.style.maxWidth = '100%';
                this.style.height = 'auto';
            } else if (this.id === 'zoomedImage') {
                this.style.position = 'absolute';
                this.style.top = '0';
                this.style.left = '0';
                this.style.width = 'auto';
                this.style.height = 'auto';
                this.style.minWidth = '100%';
                this.style.minHeight = '100%';
            }
        });
    });
}

// 修改图片调试函数，获取更详细的CSS信息
function debugImages() {
    const currentImage = document.getElementById('currentImage');
    const zoomedImage = document.getElementById('zoomedImage');
    const zoomResult = document.getElementById('zoomResult');
    
    if (currentImage) {
        const currentImageStyles = window.getComputedStyle(currentImage);
    }
    
    if (zoomedImage) {
        const zoomedImageStyles = window.getComputedStyle(zoomedImage);
    }
    
    if (zoomResult) {
        const zoomResultStyles = window.getComputedStyle(zoomResult);
    }
}

// 添加图片调试函数
function debugImages() {
    const currentImage = document.getElementById('currentImage');
    const zoomedImage = document.getElementById('zoomedImage');
    
    if (currentImage) {
        const currentImageStyles = window.getComputedStyle(currentImage);
    }
    
    if (zoomedImage) {
        const zoomedImageStyles = window.getComputedStyle(zoomedImage);
    }
}