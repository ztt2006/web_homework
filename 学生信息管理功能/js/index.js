/**
 * 首页主要逻辑
 * 实现轮播图、数据展示、交互功能等
 */

import { NavigationComponent, SliderComponent } from './components.js';
import { studentDataManager } from './storage.js';
import { showToast, AnimationHelper, StatisticsHelper } from './utils.js';

// 首页管理类 - 使用ES6 Class
class IndexPageManager {
    constructor() {
        this.animationHelper = new AnimationHelper();
        this.statistics = {};
        this.recentStudents = [];
        
        this.init();
    }

    async init() {
        console.log('首页初始化开始');
        
        // 初始化组件
        this.initComponents();
        
        // 加载数据
        await this.loadData();
        
        // 渲染界面
        this.renderFeatures();
        this.renderStatistics();
        this.renderRecentStudents();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('首页初始化完成');
    }

    initComponents() {
        // 导航栏组件
        new NavigationComponent();
        
        // 轮播图组件
        const slider = new SliderComponent('.hero-slider', {
            autoPlay: true,
            delay: 5000
        });

        // 监听轮播图切换事件 - 自定义事件
        document.querySelector('.hero-slider').addEventListener('slideChange', (e) => {
            console.log(`轮播图切换到第 ${e.detail.currentSlide + 1} 张`);
        });
    }

    async loadData() {
        try {
            // 获取统计数据 - 使用async/await
            this.statistics = await studentDataManager.getStatistics();
            console.log('统计数据加载完成:', this.statistics);
            
            // 获取最近学生数据 - 使用解构赋值
            const { recent } = this.statistics;
            this.recentStudents = recent || [];
            
        } catch (error) {
            console.error('数据加载失败:', error);
            showToast('数据加载失败', 'error');
        }
    }

    renderFeatures() {
        const featuresGrid = document.getElementById('featuresGrid');
        if (!featuresGrid) return;

        // 功能模块数据 - 使用const声明
        const features = [
            {
                icon: '👥',
                title: '学生管理',
                description: '添加、编辑、删除学生信息，支持批量操作和数据导入导出',
                action: () => window.location.href = 'students.html'
            },
            {
                icon: '📊',
                title: '数据统计',
                description: '多维度统计分析，图表展示学生分布情况和趋势变化',
                action: () => window.location.href = 'statistics.html'
            },
            {
                icon: '🔍',
                title: '快速搜索',
                description: '支持按姓名、学号、专业等多条件搜索，快速定位学生信息',
                action: () => this.focusSearchBox()
            }
        ];

        // 使用模板字符串和数组方法渲染
        const featuresHTML = features.map((feature, index) => `
            <div class="feature-card" data-index="${index}">
                <div class="feature-icon">${feature.icon}</div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
                <button class="feature-btn" data-action="${index}">了解更多</button>
            </div>
        `).join('');

        featuresGrid.innerHTML = featuresHTML;

        // 绑定功能卡片事件 - 使用事件委托
        featuresGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('feature-btn')) {
                const actionIndex = parseInt(e.target.dataset.action);
                features[actionIndex].action();
            }
        });
    }

    renderStatistics() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        // 使用解构赋值获取统计数据
        const { total, byGrade, byMajor, byGender } = this.statistics;

        const statsData = [
            {
                number: total || 0,
                label: '学生总数',
                color: '#3498db'
            },
            {
                number: Object.keys(byGrade || {}).length,
                label: '年级数量',
                color: '#e74c3c'
            },
            {
                number: Object.keys(byMajor || {}).length,
                label: '专业数量',
                color: '#27ae60'
            },
            {
                number: Object.keys(byGender || {}).length,
                label: '性别分类',
                color: '#f39c12'
            }
        ];

        // 使用模板字符串渲染统计卡片
        const statsHTML = statsData.map(stat => `
            <div class="stat-card">
                <div class="stat-number">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');

        statsGrid.innerHTML = statsHTML;

        // 添加数字动画效果
        this.animateNumbers();
    }

    renderRecentStudents() {
        const recentStudentsList = document.getElementById('recentStudentsList');
        if (!recentStudentsList) return;

        if (this.recentStudents.length === 0) {
            recentStudentsList.innerHTML = `
                <div class="empty-state">
                    <h3>暂无学生数据</h3>
                    <p>开始添加学生信息吧！</p>
                    <button class="btn btn-primary" onclick="window.location.href='students.html'">
                        添加学生
                    </button>
                </div>
            `;
            return;
        }

        // 使用数组方法和模板字符串渲染学生卡片
        const studentsHTML = this.recentStudents.map(student => {
            // 使用解构赋值获取学生信息
            const { studentName, studentId, grade, major, gender } = student;
            const initial = studentName.charAt(0);
            
            return `
                <div class="student-card" data-id="${student.id}">
                    <div class="student-avatar">${initial}</div>
                    <div class="student-name">${studentName}</div>
                    <div class="student-info">年级: ${grade}</div>
                    <div class="student-info">专业: ${major}</div>
                    <div class="student-info">性别: ${gender}</div>
                    <div class="student-id">${studentId}</div>
                </div>
            `;
        }).join('');

        recentStudentsList.innerHTML = studentsHTML;

        // 添加卡片点击事件
        this.bindStudentCardEvents();
    }

    bindStudentCardEvents() {
        const studentCards = document.querySelectorAll('.student-card');
        
        // 使用forEach和箭头函数绑定事件
        studentCards.forEach(card => {
            // 鼠标悬停效果 - 使用鼠标事件
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            // 点击跳转到学生管理页面 - 使用点击事件
            card.addEventListener('click', () => {
                const studentId = card.dataset.id;
                window.location.href = `students.html?highlight=${studentId}`;
            });
        });
    }

    bindEvents() {
        // CTA按钮点击事件 - 使用点击事件
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonId = e.target.id;
                this.handleCTAClick(buttonId);
            });
        });

        // 查看全部学生按钮 - 使用点击事件
        const viewAllBtn = document.getElementById('viewAllBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                window.location.href = 'students.html';
            });
        }

        // 页面滚动事件 - 使用滚动事件和节流
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // 键盘快捷键 - 使用键盘事件
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 快速搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearchBox();
            }
        });

        // 窗口大小改变事件 - 处理响应式
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleCTAClick(buttonId) {
        const actions = {
            startBtn: () => window.location.href = 'students.html',
            analysisBtn: () => window.location.href = 'statistics.html',
            manageBtn: () => window.location.href = 'students.html'
        };

        const action = actions[buttonId];
        if (action) {
            action();
        }
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const cards = document.querySelectorAll('.feature-card, .stat-card, .student-card');
        
        // 检查元素是否进入视口
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                card.classList.add('in-view');
            }
        });

        // 视差效果
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }

    handleResize() {
        // 响应式处理逻辑
        const width = window.innerWidth;
        
        if (width < 768) {
            // 移动端处理
            console.log('切换到移动端视图');
        } else {
            // 桌面端处理
            console.log('切换到桌面端视图');
        }
    }

    focusSearchBox() {
        // 跳转到学生管理页面并聚焦搜索框
        window.location.href = 'students.html?focus=search';
    }

    animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(element => {
            const targetNumber = parseInt(element.textContent);
            let currentNumber = 0;
            const increment = targetNumber / 50; // 50步完成动画
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= targetNumber) {
                    element.textContent = targetNumber;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(currentNumber);
                }
            }, 40); // 每40ms更新一次
        });
    }

    // 刷新数据方法
    async refreshData() {
        try {
            await this.loadData();
            this.renderStatistics();
            this.renderRecentStudents();
            showToast('数据刷新成功', 'success');
        } catch (error) {
            console.error('数据刷新失败:', error);
            showToast('数据刷新失败', 'error');
        }
    }
}

// 页面加载完成后初始化 - 使用DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', () => {
    new IndexPageManager();
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('页面变为可见，可以刷新数据');
        // 可以在这里添加数据刷新逻辑
    }
});

// 监听自定义事件示例
document.addEventListener('dataUpdated', (e) => {
    const { type, data } = e.detail;
    console.log(`数据更新事件: ${type}`, data);
    
    // 根据数据更新类型进行相应处理
    if (type === 'student_added' || type === 'student_deleted') {
        // 重新加载统计数据
        window.location.reload();
    }
});