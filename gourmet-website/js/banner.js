// 轮播图功能模块
(function() {
    'use strict';

    class BannerSlider {
        constructor(container) {
            this.container = container;
            this.slides = container.querySelectorAll('.slide');
            this.indicators = container.querySelectorAll('.indicator');
            this.prevBtn = container.querySelector('.banner-nav-btn.prev');
            this.nextBtn = container.querySelector('.banner-nav-btn.next');
            
            this.currentSlide = 0;
            this.isPlaying = true;
            this.autoPlayInterval = null;
            this.autoPlayDelay = 5000;
            this.isTransitioning = false;
            
            this.init();
        }

        init() {
            if (this.slides.length === 0) return;
            
            this.setupEventListeners();
            this.showSlide(0);
            this.startAutoPlay();
            this.preloadImages();
            this.setupTouchEvents();
            this.setupKeyboardEvents();
        }

        setupEventListeners() {
            // 上一张按钮
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                });
            }

            // 下一张按钮
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                });
            }

            // 指示器点击
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });

            // 鼠标悬停暂停自动播放
            this.container.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });

            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });

            // 页面可见性变化
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoPlay();
                } else {
                    this.startAutoPlay();
                }
            });
        }

        setupTouchEvents() {
            let startX = 0;
            let startY = 0;
            let isDragging = false;

            this.container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isDragging = true;
                this.pauseAutoPlay();
            });

            this.container.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });

            this.container.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;

                // 检查是否为水平滑动
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }

                isDragging = false;
                this.startAutoPlay();
            });
        }

        setupKeyboardEvents() {
            document.addEventListener('keydown', (e) => {
                if (!this.isInViewport()) return;

                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prevSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAutoPlay();
                        break;
                }
            });
        }

        isInViewport() {
            const rect = this.container.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }

        showSlide(index, direction = 'next') {
            if (this.isTransitioning || index === this.currentSlide) return;
            
            this.isTransitioning = true;
            
            const currentSlideEl = this.slides[this.currentSlide];
            const nextSlideEl = this.slides[index];
            
            // 更新指示器
            this.updateIndicators(index);
            
            // 添加过渡类
            if (direction === 'next') {
                nextSlideEl.classList.add('slide-from-right');
                currentSlideEl.classList.add('slide-to-left');
            } else {
                nextSlideEl.classList.add('slide-from-left');
                currentSlideEl.classList.add('slide-to-right');
            }
            
            // 显示新幻灯片
            nextSlideEl.classList.add('active');
            
            // 动画完成后清理
            setTimeout(() => {
                currentSlideEl.classList.remove('active', 'slide-to-left', 'slide-to-right');
                nextSlideEl.classList.remove('slide-from-left', 'slide-from-right');
                this.isTransitioning = false;
            }, 1000);
            
            this.currentSlide = index;
            this.animateSlideContent(nextSlideEl);
        }

        animateSlideContent(slide) {
            const title = slide.querySelector('.slide-title');
            const subtitle = slide.querySelector('.slide-subtitle');
            const button = slide.querySelector('.cta-button');
            
            // 重置动画
            [title, subtitle, button].forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight; // 强制重排
                    el.style.animation = null;
                }
            });
            
            // 分别为每个元素添加动画
            setTimeout(() => {
                if (title) title.classList.add('animate-in');
            }, 300);
            
            setTimeout(() => {
                if (subtitle) subtitle.classList.add('animate-in');
            }, 600);
            
            setTimeout(() => {
                if (button) button.classList.add('animate-in');
            }, 900);
        }

        updateIndicators(activeIndex) {
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(nextIndex, 'next');
        }

        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prevIndex, 'prev');
        }

        goToSlide(index) {
            if (index === this.currentSlide) return;
            
            const direction = index > this.currentSlide ? 'next' : 'prev';
            this.showSlide(index, direction);
        }

        startAutoPlay() {
            if (!this.isPlaying) return;
            
            this.pauseAutoPlay();
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }

        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        toggleAutoPlay() {
            this.isPlaying = !this.isPlaying;
            
            if (this.isPlaying) {
                this.startAutoPlay();
            } else {
                this.pauseAutoPlay();
            }
        }

        preloadImages() {
            this.slides.forEach(slide => {
                const bg = slide.querySelector('.slide-bg');
                if (bg) {
                    const bgImage = window.getComputedStyle(bg).backgroundImage;
                    const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
                    
                    if (imageUrl && imageUrl !== 'none') {
                        const img = new Image();
                        img.src = imageUrl;
                    }
                }
            });
        }

        // 公共方法
        play() {
            this.isPlaying = true;
            this.startAutoPlay();
        }

        pause() {
            this.isPlaying = false;
            this.pauseAutoPlay();
        }

        destroy() {
            this.pauseAutoPlay();
            // 移除事件监听器
            // 这里可以添加清理代码
        }
    }

    // 进度条功能
    class ProgressBar {
        constructor(container, slider) {
            this.container = container;
            this.slider = slider;
            this.progressBar = null;
            this.isActive = false;
            
            this.init();
        }

        init() {
            this.createProgressBar();
            this.setupEventListeners();
        }

        createProgressBar() {
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'progress-bar';
            this.container.appendChild(this.progressBar);
        }

        setupEventListeners() {
            // 监听幻灯片变化
            document.addEventListener('slideChange', () => {
                this.restart();
            });
        }

        start() {
            if (this.isActive) return;
            
            this.isActive = true;
            this.progressBar.classList.add('active');
        }

        pause() {
            this.isActive = false;
            this.progressBar.classList.remove('active');
        }

        restart() {
            this.pause();
            setTimeout(() => {
                this.start();
            }, 100);
        }
    }

    // 粒子效果
    class ParticleEffect {
        constructor(container) {
            this.container = container;
            this.particles = [];
            this.maxParticles = 8;
            
            this.init();
        }

        init() {
            this.createParticleContainer();
            this.createParticles();
            this.startAnimation();
        }

        createParticleContainer() {
            const particleContainer = document.createElement('div');
            particleContainer.className = 'particles-bg';
            this.container.appendChild(particleContainer);
            this.particleContainer = particleContainer;
        }

        createParticles() {
            for (let i = 0; i < this.maxParticles; i++) {
                this.createParticle(i);
            }
        }

        createParticle(index) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机属性
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 15;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = left + '%';
            particle.style.animationDelay = delay + 's';
            particle.style.animationDuration = duration + 's';
            
            this.particleContainer.appendChild(particle);
            this.particles.push(particle);
        }

        startAnimation() {
            // 粒子动画已通过CSS实现
        }
    }

    // 视差效果
    class ParallaxEffect {
        constructor() {
            this.elements = document.querySelectorAll('.parallax-layer');
            this.isEnabled = true;
            
            this.init();
        }

        init() {
            if (!this.elements.length) return;
            
            this.setupEventListeners();
        }

        setupEventListeners() {
            window.addEventListener('scroll', () => {
                if (!this.isEnabled) return;
                
                requestAnimationFrame(() => {
                    this.updateParallax();
                });
            });

            // 在移动设备上禁用视差效果
            if (window.innerWidth <= 768) {
                this.isEnabled = false;
            }

            window.addEventListener('resize', () => {
                this.isEnabled = window.innerWidth > 768;
            });
        }

        updateParallax() {
            const scrollTop = window.pageYOffset;
            
            this.elements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // 初始化所有轮播图
    function initializeBanners() {
        const bannerContainers = document.querySelectorAll('.banner-container');
        const sliders = [];
        
        bannerContainers.forEach(container => {
            const slider = new BannerSlider(container);
            sliders.push(slider);
            
            // 添加进度条
            new ProgressBar(container, slider);
            
            // 添加粒子效果
            new ParticleEffect(container);
        });
        
        // 初始化视差效果
        new ParallaxEffect();
        
        return sliders;
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        const sliders = initializeBanners();
        
        // 暴露到全局作用域
        window.BannerSliders = sliders;
    });

    // 暴露类供外部使用
    window.BannerSlider = BannerSlider;
    window.ParticleEffect = ParticleEffect;
    window.ParallaxEffect = ParallaxEffect;

})(); 