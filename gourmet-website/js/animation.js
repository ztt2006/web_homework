// 动画效果模块
(function() {
    'use strict';

    class AnimationManager {
        constructor() {
            this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            this.animatedElements = new Set();
            this.parallaxElements = [];
            this.countingAnimations = new Map();
            
            this.init();
        }

        init() {
            if (this.isReducedMotion) {
                this.setupReducedMotionMode();
                return;
            }
            
            this.setupIntersectionObserver();
            this.setupParallaxEffects();
            this.setupScrollAnimations();
            this.setupHoverAnimations();
            this.setupLoadingAnimations();
            this.setupTextAnimations();
            this.setupButtonAnimations();
            this.setupFormAnimations();
        }

        setupReducedMotionMode() {
            // 为偏好减少动画的用户提供静态体验
            document.documentElement.classList.add('reduced-motion');
            
            // 移除所有动画类
            document.querySelectorAll('[class*="animate"]').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        }

        setupIntersectionObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, this.observerOptions);

            // 观察需要动画的元素
            this.observeElements();
        }

        observeElements() {
            const selectors = [
                '.featured-card',
                '.category-card',
                '.section-header',
                '.stat-item',
                '.footer-section',
                '.grid-item',
                '.content-block'
            ];

            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    this.observer.observe(el);
                });
            });
        }

        animateElement(element) {
            const animationType = element.getAttribute('data-animation') || 'fadeInUp';
            const delay = parseInt(element.getAttribute('data-delay')) || 0;
            
            setTimeout(() => {
                element.classList.add('animate-in', animationType);
                
                // 特殊处理某些元素类型
                if (element.classList.contains('stat-item')) {
                    this.animateCounter(element);
                } else if (element.classList.contains('grid-item')) {
                    this.animateGridItem(element);
                } else if (element.querySelector('.progress-bar')) {
                    this.animateProgressBar(element);
                }
            }, delay);
        }

        animateCounter(element) {
            const numberElement = element.querySelector('.stat-number');
            if (!numberElement) return;

            const target = parseInt(numberElement.getAttribute('data-target')) || 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    numberElement.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    numberElement.textContent = target;
                }
            };

            // 添加数字变化动画
            numberElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                numberElement.style.transform = '';
            }, 200);

            updateCounter();
        }

        animateGridItem(element) {
            const gridContainer = element.parentElement;
            const gridItems = gridContainer.querySelectorAll('.grid-item');
            const itemIndex = Array.from(gridItems).indexOf(element);
            
            // 为网格项添加波浪式动画
            setTimeout(() => {
                element.classList.add('grid-wave-animation');
            }, itemIndex * 100);
        }

        animateProgressBar(element) {
            const progressBar = element.querySelector('.progress-bar');
            const percentage = progressBar.getAttribute('data-percentage') || 100;
            
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, 500);
        }

        setupParallaxEffects() {
            this.parallaxElements = document.querySelectorAll('[data-parallax]');
            
            if (this.parallaxElements.length > 0) {
                window.addEventListener('scroll', () => {
                    requestAnimationFrame(() => {
                        this.updateParallax();
                    });
                });
            }
        }

        updateParallax() {
            const scrollTop = window.pageYOffset;
            
            this.parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        setupScrollAnimations() {
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.handleScrollAnimations();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        handleScrollAnimations() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // 导航栏动画
            this.animateHeader(scrollTop);
            
            // 背景动画
            this.animateBackgrounds(scrollTop);
            
            // 滚动进度指示器
            this.updateScrollProgress(scrollTop);
            
            // 视差背景
            this.animateParallaxBackgrounds(scrollTop);
        }

        animateHeader(scrollTop) {
            const header = document.querySelector('.header');
            if (!header) return;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled', 'animate-header-scroll');
            } else {
                header.classList.remove('scrolled', 'animate-header-scroll');
            }
        }

        animateBackgrounds(scrollTop) {
            const backgrounds = document.querySelectorAll('.animated-bg');
            
            backgrounds.forEach(bg => {
                const speed = parseFloat(bg.getAttribute('data-speed')) || 1;
                const yPos = scrollTop * speed;
                bg.style.transform = `translateY(${yPos}px)`;
            });
        }

        updateScrollProgress(scrollTop) {
            const progressBar = document.querySelector('.scroll-progress');
            if (!progressBar) return;
            
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / documentHeight) * 100;
            progressBar.style.width = progress + '%';
        }

        animateParallaxBackgrounds(scrollTop) {
            const parallaxBgs = document.querySelectorAll('.parallax-bg');
            
            parallaxBgs.forEach(bg => {
                const speed = parseFloat(bg.getAttribute('data-speed')) || 0.5;
                const yPos = scrollTop * speed;
                bg.style.backgroundPosition = `center ${yPos}px`;
            });
        }

        setupHoverAnimations() {
            this.setupCardHoverEffects();
            this.setupButtonHoverEffects();
            this.setupImageHoverEffects();
            this.setupIconHoverEffects();
        }

        setupCardHoverEffects() {
            const cards = document.querySelectorAll('.featured-card, .category-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    this.animateCardHover(card, true);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.animateCardHover(card, false);
                });
            });
        }

        animateCardHover(card, isHover) {
            const image = card.querySelector('.card-image img');
            const content = card.querySelector('.card-content');
            const overlay = card.querySelector('.card-overlay');
            
            if (isHover) {
                card.classList.add('hover-animate');
                if (image) image.style.transform = 'scale(1.1)';
                if (overlay) overlay.style.opacity = '1';
                this.animateCardContent(content, true);
            } else {
                card.classList.remove('hover-animate');
                if (image) image.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
                this.animateCardContent(content, false);
            }
        }

        animateCardContent(content, isHover) {
            if (!content) return;
            
            const title = content.querySelector('.card-title');
            const description = content.querySelector('.card-description');
            const meta = content.querySelector('.card-meta');
            
            const elements = [title, description, meta].filter(Boolean);
            
            elements.forEach((el, index) => {
                setTimeout(() => {
                    if (isHover) {
                        el.style.transform = 'translateY(-5px)';
                        el.style.color = 'var(--primary-color)';
                    } else {
                        el.style.transform = 'translateY(0)';
                        el.style.color = '';
                    }
                }, index * 50);
            });
        }

        setupButtonHoverEffects() {
            const buttons = document.querySelectorAll('button, .btn');
            
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    this.animateButtonHover(button, true);
                });
                
                button.addEventListener('mouseleave', () => {
                    this.animateButtonHover(button, false);
                });
                
                button.addEventListener('click', () => {
                    this.animateButtonClick(button);
                });
            });
        }

        animateButtonHover(button, isHover) {
            if (isHover) {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.3)';
            } else {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '';
            }
        }

        animateButtonClick(button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // 添加波纹效果
            this.createRippleEffect(button);
        }

        createRippleEffect(element) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.transform = 'translate(-50%, -50%) scale(1)';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        setupImageHoverEffects() {
            const images = document.querySelectorAll('.card-image img, .gallery-image');
            
            images.forEach(img => {
                img.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.05)';
                    img.style.filter = 'brightness(1.1)';
                });
                
                img.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                    img.style.filter = 'brightness(1)';
                });
            });
        }

        setupIconHoverEffects() {
            const icons = document.querySelectorAll('.category-icon, .social-link, .nav-link i');
            
            icons.forEach(icon => {
                icon.addEventListener('mouseenter', () => {
                    icon.style.transform = 'rotateY(360deg)';
                    icon.style.color = 'var(--primary-color)';
                });
                
                icon.addEventListener('mouseleave', () => {
                    icon.style.transform = 'rotateY(0deg)';
                    icon.style.color = '';
                });
            });
        }

        setupLoadingAnimations() {
            this.createPageLoadAnimation();
            this.setupSkeletonLoading();
            this.setupProgressIndicators();
        }

        createPageLoadAnimation() {
            const loader = document.querySelector('.loading-overlay');
            if (!loader) return;
            
            // 页面加载完成后隐藏加载动画
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 1000);
            });
        }

        setupSkeletonLoading() {
            const skeletons = document.querySelectorAll('.skeleton');
            
            skeletons.forEach(skeleton => {
                this.animateSkeleton(skeleton);
            });
        }

        animateSkeleton(skeleton) {
            const shimmer = document.createElement('div');
            shimmer.className = 'skeleton-shimmer';
            skeleton.appendChild(shimmer);
            
            // 模拟内容加载完成
            setTimeout(() => {
                skeleton.classList.add('loaded');
                setTimeout(() => {
                    skeleton.remove();
                }, 300);
            }, Math.random() * 2000 + 1000);
        }

        setupProgressIndicators() {
            const progressBars = document.querySelectorAll('.progress-bar[data-percentage]');
            
            progressBars.forEach(bar => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateProgressBar(entry.target.parentElement);
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(bar);
            });
        }

        setupTextAnimations() {
            this.setupTypewriterEffect();
            this.setupTextRevealAnimation();
            this.setupWordAnimations();
        }

        setupTypewriterEffect() {
            const typewriterElements = document.querySelectorAll('.typewriter');
            
            typewriterElements.forEach(element => {
                this.observer.observe(element);
                element.addEventListener('animate-in', () => {
                    this.startTypewriter(element);
                });
            });
        }

        startTypewriter(element) {
            const text = element.textContent;
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    // 闪烁光标效果
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' ? 
                            '2px solid var(--primary-color)' : 'none';
                    }, 500);
                }
            };
            
            type();
        }

        setupTextRevealAnimation() {
            const revealElements = document.querySelectorAll('.text-reveal');
            
            revealElements.forEach(element => {
                const words = element.textContent.split(' ');
                element.innerHTML = words.map(word => 
                    `<span class="word-reveal">${word}</span>`
                ).join(' ');
                
                this.observer.observe(element);
                element.addEventListener('animate-in', () => {
                    this.animateTextReveal(element);
                });
            });
        }

        animateTextReveal(element) {
            const words = element.querySelectorAll('.word-reveal');
            
            words.forEach((word, index) => {
                setTimeout(() => {
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        setupWordAnimations() {
            const wordElements = document.querySelectorAll('.word-animation');
            
            wordElements.forEach(element => {
                const text = element.textContent;
                const letters = text.split('');
                element.innerHTML = letters.map(letter => 
                    `<span class="letter">${letter === ' ' ? '&nbsp;' : letter}</span>`
                ).join('');
                
                this.observer.observe(element);
            });
        }

        setupButtonAnimations() {
            this.setupFloatingButtons();
            this.setupPulseAnimations();
            this.setupMorphingButtons();
        }

        setupFloatingButtons() {
            const floatingButtons = document.querySelectorAll('.btn-floating');
            
            floatingButtons.forEach(button => {
                button.style.animation = 'float 3s ease-in-out infinite';
            });
        }

        setupPulseAnimations() {
            const pulseElements = document.querySelectorAll('.pulse-animation');
            
            pulseElements.forEach(element => {
                element.style.animation = 'pulse 2s infinite';
            });
        }

        setupMorphingButtons() {
            const morphButtons = document.querySelectorAll('.btn-morph');
            
            morphButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.morphButton(button);
                });
            });
        }

        morphButton(button) {
            const originalText = button.textContent;
            const loadingText = button.getAttribute('data-loading') || '加载中...';
            const successText = button.getAttribute('data-success') || '完成';
            
            // 第一阶段：变形为加载状态
            button.style.transform = 'scale(0.9)';
            button.style.borderRadius = '50%';
            button.style.width = '40px';
            button.style.height = '40px';
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // 第二阶段：模拟加载完成
            setTimeout(() => {
                button.style.transform = 'scale(1)';
                button.style.borderRadius = '25px';
                button.style.width = 'auto';
                button.style.height = 'auto';
                button.style.backgroundColor = 'var(--success-color)';
                button.innerHTML = `<i class="fas fa-check"></i> ${successText}`;
                
                // 第三阶段：恢复原状
                setTimeout(() => {
                    button.style.backgroundColor = '';
                    button.textContent = originalText;
                }, 2000);
            }, 1500);
        }

        setupFormAnimations() {
            this.animateFormInputs();
            this.setupFormValidationAnimations();
        }

        animateFormInputs() {
            const inputs = document.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('input-focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('input-focused');
                    }
                });
                
                input.addEventListener('input', () => {
                    if (input.value) {
                        input.parentElement.classList.add('input-has-value');
                    } else {
                        input.parentElement.classList.remove('input-has-value');
                    }
                });
            });
        }

        setupFormValidationAnimations() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    this.animateFormSubmission(form);
                });
            });
        }

        animateFormSubmission(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    submitButton.style.transform = 'scale(1)';
                }, 200);
            }
        }

        // 通用动画方法
        animateElement(element, animation = 'fadeInUp') {
            element.classList.add('animate-in', animation);
        }

        removeAnimation(element) {
            element.classList.remove('animate-in');
            element.className = element.className.replace(/animate-\w+/g, '');
        }

        createCustomAnimation(element, keyframes, options = {}) {
            const defaultOptions = {
                duration: 500,
                easing: 'ease-in-out',
                fill: 'forwards'
            };
            
            const animationOptions = { ...defaultOptions, ...options };
            
            return element.animate(keyframes, animationOptions);
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
            this.animatedElements.clear();
            this.parallaxElements = [];
            this.countingAnimations.clear();
        }
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        window.animationManager = new AnimationManager();
    });

    // 暴露给全局作用域
    window.AnimationManager = AnimationManager;

})();