document.addEventListener('DOMContentLoaded', function() {
    console.log('🍽️ 美食世界网站已加载完成！');
    
    // 安全地获取元素并添加事件监听器
    function safeAddEventListener(selector, event, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(event, handler);
            return element;
        }
        return null;
    }
    
    // 安全地获取多个元素并添加事件监听器
    function safeAddEventListeners(selector, event, handler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener(event, handler);
        });
        return elements;
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 创建并管理返回顶部按钮
    function createBackToTopButton() {
        // 检查是否已存在返回顶部按钮
        let backToTopButton = document.querySelector('.back-to-top');
        
        if (!backToTopButton) {
            // 创建返回顶部按钮
            backToTopButton = document.createElement('button');
            backToTopButton.className = 'back-to-top';
            backToTopButton.innerHTML = '↑';
            backToTopButton.title = '返回顶部';
            backToTopButton.setAttribute('aria-label', '返回页面顶部');
            
            // 添加样式
            backToTopButton.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                border: none;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            document.body.appendChild(backToTopButton);
        }

        // 滚动显示/隐藏逻辑
        function toggleBackToTopButton() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.visibility = 'visible';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.visibility = 'hidden';
            }
        }

        // 绑定滚动事件
        window.addEventListener('scroll', toggleBackToTopButton);

        // 绑定点击事件
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });

        // 悬停效果
        backToTopButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
            this.style.boxShadow = '0 8px 30px rgba(255, 107, 107, 0.5)';
        });

        backToTopButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(255, 107, 107, 0.3)';
        });

        return backToTopButton;
    }

    // 导航栏滚动效果
    function handleNavbarScroll() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 添加/移除滚动后的样式
            if (scrollTop > 100) {
                header.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.95), rgba(238, 90, 36, 0.95))';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // 页面元素动画
    function addScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.food-item, .feature-item, .recipe-card, .learning-item, .contact-item, .team-member, .value-item'
        );
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // 表单增强功能
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // 添加焦点效果
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('focused');
                    if (this.value.trim()) {
                        this.parentElement.classList.add('filled');
                    } else {
                        this.parentElement.classList.remove('filled');
                    }
                });
                
                // 检查是否已有值
                if (input.value.trim()) {
                    input.parentElement.classList.add('filled');
                }
                
                // 实时验证
                if (input.type === 'email') {
                    input.addEventListener('input', function() {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (this.value && !emailRegex.test(this.value)) {
                            this.style.borderColor = '#e74c3c';
                        } else {
                            this.style.borderColor = '#e0e0e0';
                        }
                    });
                }
            });
        });
    }

    // 图片懒加载
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // 添加页面切换动画
    function addPageTransitions() {
        const internalLinks = document.querySelectorAll('a[href$=".html"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== window.location.pathname) {
                    e.preventDefault();
                    
                    // 添加离开动画
                    document.body.style.opacity = '0.8';
                    document.body.style.transform = 'translateY(-10px)';
                    document.body.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
    }

    // 添加键盘导航支持
    function addKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // ESC键关闭可能的模态框或菜单
            if (e.key === 'Escape') {
                const activeMenu = document.querySelector('.nav-menu.active');
                if (activeMenu) {
                    activeMenu.classList.remove('active');
                }
            }
            
            // Ctrl+F 跳转到搜索框
            if (e.ctrlKey && e.key === 'f') {
                const searchInput = document.querySelector('.search-input, input[type="search"]');
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });
    }

    // 性能优化：节流函数
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 优化滚动事件性能
    function optimizeScrollEvents() {
        const throttledScroll = throttle(() => {
            // 所有滚动相关的逻辑都在这里
            const scrollTop = window.pageYOffset;
            
            // 更新导航栏样式
            const header = document.querySelector('header');
            if (header) {
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }, 16); // 约60fps
        
        window.addEventListener('scroll', throttledScroll);
    }

    // 添加页面进入动画
    function addPageEnterAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        document.body.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);
    }

    // 错误处理
    function setupErrorHandling() {
        // 图片加载错误处理
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                e.target.style.opacity = '0.5';
                e.target.alt = '图片加载失败';
            }
        }, true);
        
        // 全局错误处理
        window.addEventListener('error', function(e) {
            console.warn('页面出现错误:', e.message);
        });
    }

    // 初始化所有功能
    function initializeWebsite() {
        try {
            createBackToTopButton();
            handleNavbarScroll();
            addScrollAnimations();
            enhanceForms();
            lazyLoadImages();
            addPageTransitions();
            addKeyboardNavigation();
            optimizeScrollEvents();
            addPageEnterAnimation();
            setupErrorHandling();
            
            console.log('✨ 所有功能已成功初始化');
        } catch (error) {
            console.error('初始化过程中出现错误:', error);
        }
    }

    // 启动网站
    initializeWebsite();

    // 添加一些有用的全局方法
    window.FoodWorld = {
        scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        scrollToElement: (selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        showMessage: (message, type = 'info') => {
            console.log(`${type.toUpperCase()}: ${message}`);
            // 这里可以添加更复杂的消息显示逻辑
        }
    };
});

// 页面卸载时的清理工作
window.addEventListener('beforeunload', function() {
    console.log('👋 感谢访问美食世界！');
});