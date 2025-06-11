new Vue({
    el: '#app',
    data: {
        // 数据状态
        banners: [],
        mainNews: [],
        sideNews: [],
        hotTopics: [],
        
        // 加载状态
        loading: {
            banners: true,
            mainNews: true,
            sideNews: true,
            hotTopics: true
        },
        
        // 轮播图状态
        currentSlide: 0,
        slideInterval: null,
        
        // 搜索和时间
        searchKeyword: '',
        currentTime: '',
        
        // API配置
        apiBaseUrl: 'http://localhost:3001/api'
    },
    
    async mounted() {
        // 初始化应用
        await this.initializeApp();
        this.startSlideShow();
        this.updateTime();
        setInterval(this.updateTime, 60000); // 每分钟更新时间
        
        // 添加键盘事件监听
        document.addEventListener('keydown', this.handleKeyboard);
    },
    
    beforeDestroy() {
        // 清理定时器和事件监听
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        document.removeEventListener('keydown', this.handleKeyboard);
    },
    
    methods: {
        // 初始化应用数据
        async initializeApp() {
            try {
                await this.fetchAllData();
            } catch (error) {
                console.error('初始化失败:', error);
            }
        },
        
        // 获取所有数据
        async fetchAllData() {
            try {
                const response = await axios.get(`${this.apiBaseUrl}/news`);
                
                if (response.data.success) {
                    const data = response.data.data;
                    this.banners = data.banners || [];
                    console.log('获取轮播图数据:', this.banners);
                    
                    this.mainNews = data.mainNews || [];
                    console.log('获取主要新闻数据:', this.mainNews);
                    
                    this.sideNews = data.sideNews || [];
                    console.log('获取侧边新闻数据:', this.sideNews);
                    
                    this.hotTopics = data.hotTopics || [];
                } else {
                    throw new Error(response.data.message || '数据获取失败');
                }
            } catch (error) {
                console.error('获取数据失败:', error);
                throw error;
            } finally {
                // 更新加载状态
                this.loading = {
                    banners: false,
                    mainNews: false,
                    sideNews: false,
                    hotTopics: false
                };
            }
        },
        

        
        // 刷新新闻数据
        async refreshNews() {
            this.loading.mainNews = true;
            try {
                const response = await axios.get(`${this.apiBaseUrl}/news/main`);
                if (response.data.success) {
                    this.mainNews = response.data.data;
                }
            } catch (error) {
                console.error('刷新新闻失败:', error);
            } finally {
                this.loading.mainNews = false;
            }
        },
        
        // 轮播图控制方法
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.banners.length;
        },
        
        prevSlide() {
            this.currentSlide = this.currentSlide === 0 ? 
                this.banners.length - 1 : this.currentSlide - 1;
        },
        
        goToSlide(index) {
            this.currentSlide = index;
            this.restartSlideShow();
        },
        
        startSlideShow() {
            if (this.banners.length > 1) {
                this.slideInterval = setInterval(() => {
                    this.nextSlide();
                }, 5000); // 5秒切换
            }
        },
        
        restartSlideShow() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
            }
            this.startSlideShow();
        },
        
        // 搜索功能
        async performSearch() {
            if (!this.searchKeyword.trim()) {
                alert('请输入搜索关键词');
                return;
            }
            
            try {
                const response = await axios.get(`${this.apiBaseUrl}/search`, {
                    params: { q: this.searchKeyword }
                });
                
                if (response.data.success) {
                    // 打开人民网官方搜索页面
                    window.open(
                        `https://search.people.com.cn/?keyword=${encodeURIComponent(this.searchKeyword)}`, 
                        '_blank'
                    );
                }
            } catch (error) {
                console.error('搜索失败:', error);
                // 降级到官方搜索
                window.open(
                    `https://search.people.com.cn/?keyword=${encodeURIComponent(this.searchKeyword)}`, 
                    '_blank'
                );
            }
        },
        
        // 工具方法
        updateTime() {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };
            this.currentTime = now.toLocaleDateString('zh-CN', options).replace(/\//g, '-');
        },
        
        formatTime(timeString) {
            if (!timeString) return '';
            const date = new Date(timeString);
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) {
                return `${days}天前`;
            } else if (hours > 0) {
                return `${hours}小时前`;
            } else if (minutes > 0) {
                return `${minutes}分钟前`;
            } else {
                return '刚刚';
            }
        },
        
        formatViews(views) {
            if (!views) return '0';
            if (views >= 10000) {
                return `${(views / 10000).toFixed(1)}万`;
            }
            return views.toString();
        },
        
        openLink(url) {
            if (url) {
                window.open(url, '_blank');
            }
        },
        
        handleImageError(event) {
            // 图片加载失败时的处理
            event.target.src = 'https://via.placeholder.com/120x80/ddd/999?text=暂无图片';
        },
        
        handleKeyboard(event) {
            // 键盘快捷键
            if (event.target.tagName === 'INPUT') return;
            
            switch(event.key) {
                case 'ArrowLeft':
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case '/':
                    event.preventDefault();
                    document.querySelector('.search-input').focus();
                    break;
            }
        }
    }
});