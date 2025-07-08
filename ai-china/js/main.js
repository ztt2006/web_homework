/**
 * 智能中国 - 人工智能发展之路 主脚本文件
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initParallaxEffect();
});

// 导航栏功能初始化
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-item a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // 添加点击动画效果
        link.addEventListener('click', function(e) {
            // 移除其他链接的active类
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加当前链接的active类
            this.classList.add('active');
            
            // 添加点击波纹效果
            createRippleEffect(this, e);
        });
    });
}

// 创建波纹效果
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 添加波纹动画CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// 滚动动画初始化
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // 添加淡入动画
                if (element.classList.contains('fade-in-on-scroll')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                // 添加卡片动画
                if (element.classList.contains('card')) {
                    element.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
                
                // 添加统计数字动画
                if (element.classList.contains('stat-item')) {
                    animateCounter(element.querySelector('.stat-number'));
                }
                
                // 添加时间线动画
                if (element.classList.contains('timeline-item')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.card, .stat-item, .timeline-item, .fade-in-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
        
        // 初始状态
        if (el.classList.contains('fade-in-on-scroll')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
    });
}

// 数字计数器初始化
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        counter.style.opacity = '0';
    });
}

// 数字计数动画
function animateCounter(element) {
    if (!element || element.dataset.animated) return;
    
    const targetNumber = parseInt(element.textContent);
    const duration = 2000; // 2秒
    const steps = 60; // 60帧
    const increment = targetNumber / steps;
    let current = 0;
    let step = 0;
    
    element.style.opacity = '1';
    element.dataset.animated = 'true';
    
    const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps) {
            element.textContent = targetNumber.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, duration / steps);
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 视差效果
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// 卡片悬停效果增强
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card, .company-card, .application-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 页面加载动画
window.addEventListener('load', function() {
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    container.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});

// 鼠标移动视差效果
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        card.style.transform += ` rotateX(${y}deg) rotateY(${x}deg)`;
    });
});

// 滚动进度条
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 初始化滚动进度条
createScrollProgress();

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 工具函数：防抖
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

// 性能优化：使用节流处理滚动事件
const throttledScrollHandler = throttle(function() {
    // 滚动处理逻辑
}, 16); // 约60fps

window.addEventListener('scroll', throttledScrollHandler);

// 响应式导航菜单（移动端适配预留）
function initMobileMenu() {
    // 移动端菜单逻辑（如果需要的话）
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

// 导出主要函数（如果需要模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initScrollAnimations,
        initCounters,
        animateCounter,
        createRippleEffect
    };
} 