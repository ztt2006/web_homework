// 主JavaScript文件 - 美食网站
(function() {
    'use strict';

    // 全局变量
    let isScrolling = false;
    let lastScrollTop = 0;
    let ticking = false;

    // DOM元素缓存
    const elements = {
        header: null,
        navToggle: null,
        navMenu: null,
        navLinks: null,
        scrollToTop: null,
        loadingOverlay: null
    };

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        initializeElements();
        initializeApp();
        setupEventListeners();
        handleInitialLoad();
    });

    // 初始化DOM元素
    function initializeElements() {
        elements.header = document.getElementById('header');
        elements.navToggle = document.getElementById('navToggle');
        elements.navMenu = document.getElementById('navMenu');
        elements.navLinks = document.querySelectorAll('.nav-link');
        elements.scrollToTop = document.getElementById('scrollToTop');
        elements.loadingOverlay = document.getElementById('loadingOverlay');
    }

    // 初始化应用
    function initializeApp() {
        // 设置导航栏滚动效果
        setupHeaderScrollEffect();
        
        // 设置平滑滚动
        setupSmoothScrolling();
        
        // 初始化统计数字动画
        initializeCounterAnimation();
        
        // 初始化元素可见性检测
        initializeIntersectionObserver();
        
        // 设置返回顶部按钮
        setupScrollToTop();
        
        // 设置移动端菜单
        setupMobileMenu();
        
        // 初始化工具提示
        initializeTooltips();
        
        // 设置键盘导航
        setupKeyboardNavigation();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 滚动事件
        window.addEventListener('scroll', throttle(handleScroll, 16));
        
        // 窗口调整大小事件
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // 导航栏切换
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // 导航链接点击
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });
        
        // 返回顶部按钮
        if (elements.scrollToTop) {
            elements.scrollToTop.addEventListener('click', scrollToTop);
        }
        
        // 键盘事件
        document.addEventListener('keydown', handleKeydown);
        
        // 点击外部关闭菜单
        document.addEventListener('click', handleOutsideClick);
        
        // 表单提交事件
        document.addEventListener('submit', handleFormSubmit);
    }

    // 处理初始加载
    function handleInitialLoad() {
        // 隐藏加载动画
        setTimeout(() => {
            if (elements.loadingOverlay) {
                elements.loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    elements.loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        // 检查URL锚点
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    scrollToElement(target);
                }
            }, 1500);
        }
        
        // 初始化当前页面状态
        updateActiveNavLink();
        
        // 预加载重要资源
        preloadResources();
    }

    // 设置导航栏滚动效果
    function setupHeaderScrollEffect() {
        if (!elements.header) return;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    if (scrollTop > 100) {
                        elements.header.classList.add('scrolled');
                    } else {
                        elements.header.classList.remove('scrolled');
                    }
                    
                    // 显示/隐藏返回顶部按钮
                    if (elements.scrollToTop) {
                        if (scrollTop > 500) {
                            elements.scrollToTop.classList.add('visible');
                        } else {
                            elements.scrollToTop.classList.remove('visible');
                        }
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 设置平滑滚动
    function setupSmoothScrolling() {
        // 为锚点链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    scrollToElement(target);
                }
            });
        });
    }

    // 滚动到指定元素
    function scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // 返回顶部
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 移动端菜单切换
    function toggleMobileMenu() {
        if (!elements.navMenu || !elements.navToggle) return;
        
        elements.navMenu.classList.toggle('active');
        elements.navToggle.classList.toggle('active');
        
        // 防止背景滚动
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // 设置移动端菜单
    function setupMobileMenu() {
        // 点击导航链接后关闭菜单
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    elements.navMenu.classList.remove('active');
                    elements.navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // 处理导航链接点击
    function handleNavLinkClick(e) {
        // 移除所有活动状态
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加当前活动状态
        e.target.classList.add('active');
        
        // 更新页面状态
        updatePageState(e.target.getAttribute('href'));
    }

    // 更新活动导航链接
    function updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === currentPath || href === currentHash) {
                link.classList.add('active');
            }
        });
    }

    // 初始化统计数字动画
    function initializeCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 200;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        // 使用Intersection Observer触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // 初始化Intersection Observer
    function initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 为网格项添加延迟动画
                    if (entry.target.classList.contains('grid-item')) {
                        const gridItems = entry.target.parentElement.querySelectorAll('.grid-item');
                        gridItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('animate-in');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        document.querySelectorAll('.featured-card, .category-card, .section-header').forEach(el => {
            observer.observe(el);
        });
    }

    // 设置返回顶部按钮
    function setupScrollToTop() {
        if (!elements.scrollToTop) return;
        
        // 添加点击动画效果
        elements.scrollToTop.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }

    // 设置键盘导航
    function setupKeyboardNavigation() {
        // ESC键关闭移动端菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (elements.navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    }

    // 处理键盘事件
    function handleKeydown(e) {
        // ESC键处理
        if (e.key === 'Escape') {
            // 关闭移动端菜单
            if (elements.navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
        
        // Ctrl+K 组合键（快捷搜索 - 已移除）
    }

    // 处理点击外部区域
    function handleOutsideClick(e) {
        // 关闭移动端菜单
        if (!e.target.closest('.nav-container') && elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }

    // 处理表单提交
    function handleFormSubmit(e) {
        // 可以在这里添加表单验证和处理逻辑
        if (e.target.classList.contains('newsletter-form')) {
            e.preventDefault();
            // 处理订阅表单
            handleNewsletterSubmit(e.target);
        }
    }

    // 处理订阅表单
    function handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        if (email) {
            // 模拟API调用
            showNotification('感谢您的订阅！', 'success');
            form.reset();
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 更新页面状态
    function updatePageState(href) {
        // 可以在这里添加页面状态管理逻辑
        if (href.startsWith('#')) {
            history.replaceState(null, null, href);
        }
    }

    // 预加载资源
    function preloadResources() {
        // 预加载重要图片
        const importantImages = [
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        ];
        
        importantImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // 处理滚动事件
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 视差效果
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrollTop * speed}px)`;
        });
        
        // 更新导航状态
        updateNavigationState();
        
        lastScrollTop = scrollTop;
    }

    // 更新导航状态
    function updateNavigationState() {
        const sections = document.querySelectorAll('section[id]');
        const scrollTop = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 处理窗口大小调整
    function handleResize() {
        // 关闭移动端菜单
        if (window.innerWidth > 768) {
            elements.navMenu.classList.remove('active');
            elements.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // 重新计算元素位置
        recalculateElementPositions();
    }

    // 重新计算元素位置
    function recalculateElementPositions() {
        // 这里可以添加需要重新计算的元素
        const elements = document.querySelectorAll('.parallax-layer');
        elements.forEach(el => {
            // 重置视差效果
            el.style.transform = '';
        });
    }

    // 初始化工具提示
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
        });
    }

    // 显示工具提示
    function showTooltip(e) {
        const text = e.target.getAttribute('data-tooltip');
        if (!text) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        e.target.tooltipElement = tooltip;
    }

    // 隐藏工具提示
    function hideTooltip(e) {
        if (e.target.tooltipElement) {
            e.target.tooltipElement.remove();
            e.target.tooltipElement = null;
        }
    }

    // 暴露公共方法
    window.GourmetWebsite = {
        scrollToElement,
        showNotification,
        updateActiveNavLink
    };

})();