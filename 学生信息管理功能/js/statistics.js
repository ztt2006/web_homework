/**
 * 统计分析页面逻辑
 * 实现数据统计、图表展示、趋势分析等功能
 */

import { NavigationComponent, ModalComponent } from './components.js';
import { studentDataManager } from './storage.js';
import { showToast, StatisticsHelper, formatDate } from './utils.js';

// 统计页面管理类 - 使用ES6 Class
class StatisticsPageManager {
    constructor() {
        this.statistics = {};
        this.charts = new Map(); // 使用Map存储图表实例
        this.currentTrendPeriod = 'month';
        
        this.init();
    }

    async init() {
        console.log('统计分析页面初始化开始');
        
        // 初始化组件
        this.initComponents();
        
        // 加载统计数据
        await this.loadStatistics();
        
        // 渲染统计卡片
        this.renderStatsCards();
        
        // 渲染图表
        this.renderCharts();
        
        // 渲染详细统计表格
        this.renderDetailedStats();
        
        // 渲染趋势图
        this.renderTrendChart();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('统计分析页面初始化完成');
    }

    initComponents() {
        // 导航栏组件
        new NavigationComponent();
        
        // 详情模态框
        this.detailModal = new ModalComponent('#detailModal');
    }

    async loadStatistics() {
        try {
            // 使用async/await获取统计数据
            this.statistics = await studentDataManager.getStatistics();
            console.log('统计数据加载完成:', this.statistics);
        } catch (error) {
            console.error('统计数据加载失败:', error);
            showToast('统计数据加载失败', 'error');
        }
    }

    renderStatsCards() {
        const statsCards = document.getElementById('statsCards');
        if (!statsCards) return;

        // 使用解构赋值获取统计数据
        const { total, byGrade, byMajor, byGender } = this.statistics;

        // 统计卡片数据 - 使用const声明
        const cardsData = [
            {
                icon: '👥',
                number: total || 0,
                label: '学生总数',
                change: this.calculateChange('total'),
                color: '#3498db'
            },
            {
                icon: '🎓',
                number: Object.keys(byGrade || {}).length,
                label: '年级数量',
                change: this.calculateChange('grades'),
                color: '#e74c3c'
            },
            {
                icon: '📚',
                number: Object.keys(byMajor || {}).length,
                label: '专业数量',
                change: this.calculateChange('majors'),
                color: '#27ae60'
            },
            {
                icon: '⚥',
                number: Object.keys(byGender || {}).length,
                label: '性别分类',
                change: this.calculateChange('genders'),
                color: '#f39c12'
            }
        ];

        // 使用模板字符串和数组方法渲染卡片
        const cardsHTML = cardsData.map(card => `
            <div class="stats-card" style="--card-color: ${card.color}">
                <div class="stats-card-icon">${card.icon}</div>
                <div class="stats-card-number">${card.number}</div>
                <div class="stats-card-label">${card.label}</div>
                <div class="stats-card-change ${card.change.type}">
                    ${card.change.text}
                </div>
            </div>
        `).join('');

        statsCards.innerHTML = cardsHTML;

        // 添加数字动画
        this.animateNumbers();
    }

    calculateChange(type) {
        // 模拟变化数据（实际项目中应该从历史数据计算）
        const changes = {
            total: { value: 5, type: 'positive' },
            grades: { value: 0, type: 'neutral' },
            majors: { value: 1, type: 'positive' },
            genders: { value: 0, type: 'neutral' }
        };

        const change = changes[type] || { value: 0, type: 'neutral' };
        let text = '';
        
        if (change.value > 0) {
            text = `+${change.value} 较上月`;
            change.type = 'positive';
        } else if (change.value < 0) {
            text = `${change.value} 较上月`;
            change.type = 'negative';
        } else {
            text = '与上月持平';
            change.type = 'neutral';
        }

        return { ...change, text };
    }

    renderCharts() {
        this.renderGradeChart();
        this.renderMajorChart();
        this.renderGenderChart();
    }

    renderGradeChart() {
        const canvas = document.getElementById('gradeChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { byGrade } = this.statistics;

        if (!byGrade || Object.keys(byGrade).length === 0) {
            this.renderEmptyChart(ctx, '暂无年级数据');
            return;
        }

        // 准备图表数据 - 使用Object.entries
        const labels = Object.keys(byGrade);
        const data = Object.values(byGrade).map(students => students.length);
        const colors = ['#3498db', '#e74c3c', '#27ae60', '#f39c12'];

        // 创建柱状图
        this.createBarChart(ctx, {
            labels,
            data,
            colors,
            title: '年级分布'
        });
    }

    renderMajorChart() {
        const canvas = document.getElementById('majorChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { byMajor } = this.statistics;

        if (!byMajor || Object.keys(byMajor).length === 0) {
            this.renderEmptyChart(ctx, '暂无专业数据');
            return;
        }

        // 准备图表数据
        const labels = Object.keys(byMajor);
        const data = Object.values(byMajor).map(students => students.length);
        const colors = ['#9b59b6', '#1abc9c', '#f39c12', '#e67e22'];

        // 创建饼图
        this.createPieChart(ctx, {
            labels,
            data,
            colors,
            title: '专业分布'
        });
    }

    renderGenderChart() {
        const canvas = document.getElementById('genderChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { byGender } = this.statistics;

        if (!byGender || Object.keys(byGender).length === 0) {
            this.renderEmptyChart(ctx, '暂无性别数据');
            return;
        }

        // 准备图表数据
        const labels = Object.keys(byGender);
        const data = Object.values(byGender).map(students => students.length);
        const colors = ['#3498db', '#e74c3c'];

        // 创建水平柱状图
        this.createHorizontalBarChart(ctx, {
            labels,
            data,
            colors,
            title: '性别比例'
        });
    }

    // 简化的图表绘制方法（实际项目中建议使用Chart.js等图表库）
    createBarChart(ctx, { labels, data, colors, title }) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;
        const barWidth = (width - padding * 2) / labels.length * 0.8;
        const maxValue = Math.max(...data);

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // 绘制柱子
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (height - padding * 2);
            const x = padding + index * (width - padding * 2) / labels.length + barWidth * 0.1;
            const y = height - padding - barHeight;

            // 绘制柱子
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);

            // 绘制数值
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);

            // 绘制标签
            ctx.fillText(labels[index], x + barWidth / 2, height - padding + 20);
        });

        // 绘制标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 30);
    }

    createPieChart(ctx, { labels, data, colors, title }) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        const total = data.reduce((sum, value) => sum + value, 0);

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        let startAngle = 0;

        // 绘制扇形
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // 绘制扇形
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            // 绘制标签
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${labels[index]}: ${value}`, labelX, labelY);

            startAngle += sliceAngle;
        });

        // 绘制标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 30);
    }

    createHorizontalBarChart(ctx, { labels, data, colors, title }) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;
        const barHeight = (height - padding * 2) / labels.length * 0.8;
        const maxValue = Math.max(...data);

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // 绘制柱子
        data.forEach((value, index) => {
            const barWidth = (value / maxValue) * (width - padding * 2);
            const x = padding;
            const y = padding + index * (height - padding * 2) / labels.length + barHeight * 0.1;

            // 绘制柱子
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);

            // 绘制数值
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(value, x + barWidth + 10, y + barHeight / 2 + 4);

            // 绘制标签
            ctx.textAlign = 'right';
            ctx.fillText(labels[index], x - 10, y + barHeight / 2 + 4);
        });

        // 绘制标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 30);
    }

    renderEmptyChart(ctx, message) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#adb5bd';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, width / 2, height / 2);
    }

    renderDetailedStats() {
        const detailedStatsBody = document.getElementById('detailedStatsBody');
        if (!detailedStatsBody) return;

        const { total, byGrade, byMajor, byGender } = this.statistics;
        let statsData = [];

        // 年级统计 - 使用Object.entries遍历
        if (byGrade) {
            Object.entries(byGrade).forEach(([grade, students]) => {
                const count = students.length;
                const percentage = StatisticsHelper.calculatePercentage(count, total);
                
                statsData.push({
                    category: '年级',
                    item: grade,
                    count,
                    percentage,
                    type: 'grade'
                });
            });
        }

        // 专业统计
        if (byMajor) {
            Object.entries(byMajor).forEach(([major, students]) => {
                const count = students.length;
                const percentage = StatisticsHelper.calculatePercentage(count, total);
                
                statsData.push({
                    category: '专业',
                    item: major,
                    count,
                    percentage,
                    type: 'major'
                });
            });
        }

        // 性别统计
        if (byGender) {
            Object.entries(byGender).forEach(([gender, students]) => {
                const count = students.length;
                const percentage = StatisticsHelper.calculatePercentage(count, total);
                
                statsData.push({
                    category: '性别',
                    item: gender,
                    count,
                    percentage,
                    type: 'gender'
                });
            });
        }

        // 使用模板字符串渲染表格行
        const rowsHTML = statsData.map(stat => `
            <tr>
                <td>
                    <span class="category-badge ${stat.type}">${stat.category}</span>
                </td>
                <td>${stat.item}</td>
                <td>${stat.count}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <div class="percentage-bar">
                            <div class="percentage-fill" style="--percentage: ${stat.percentage}%; width: ${stat.percentage}%"></div>
                        </div>
                        <span class="percentage-text">${stat.percentage}%</span>
                    </div>
                </td>
                <td>
                    <button class="stats-action-btn" data-category="${stat.category}" data-item="${stat.item}">
                        查看详情
                    </button>
                </td>
            </tr>
        `).join('');

        detailedStatsBody.innerHTML = rowsHTML;
    }

    renderTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // 生成模拟趋势数据
        const trendData = this.generateTrendData(this.currentTrendPeriod);
        
        // 绘制趋势图
        this.createLineChart(ctx, trendData);
    }

    generateTrendData(period) {
        const now = new Date();
        let labels = [];
        let values = [];

        switch (period) {
            case 'week':
                // 最近7天
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    labels.push(formatDate(date).slice(5)); // 只显示月-日
                    values.push(Math.floor(Math.random() * 10) + (this.statistics.total || 0) - 5);
                }
                break;
                
            case 'month':
                // 最近30天，每5天一个点
                for (let i = 25; i >= 0; i -= 5) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    labels.push(formatDate(date).slice(5));
                    values.push(Math.floor(Math.random() * 15) + (this.statistics.total || 0) - 10);
                }
                break;
                
            case 'year':
                // 最近12个月
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now);
                    date.setMonth(date.getMonth() - i);
                    labels.push(`${date.getMonth() + 1}月`);
                    values.push(Math.floor(Math.random() * 30) + (this.statistics.total || 0) - 20);
                }
                break;
        }

        return { labels, values };
    }

    createLineChart(ctx, { labels, values }) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const valueRange = maxValue - minValue || 1;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // 绘制网格线
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        
        // 水平网格线
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // 垂直网格线
        for (let i = 0; i < labels.length; i++) {
            const x = padding + (chartWidth / (labels.length - 1)) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }

        // 绘制数据线
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.beginPath();

        values.forEach((value, index) => {
            const x = padding + (chartWidth / (labels.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // 绘制数据点
        ctx.fillStyle = '#3498db';
        values.forEach((value, index) => {
            const x = padding + (chartWidth / (labels.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // 绘制数值
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x, y - 10);
        });

        // 绘制标签
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        labels.forEach((label, index) => {
            const x = padding + (chartWidth / (labels.length - 1)) * index;
            ctx.fillText(label, x, height - padding + 20);
        });

        // 绘制标题
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('学生数量趋势', width / 2, 30);
    }

    bindEvents() {
        // 刷新数据按钮 - 使用点击事件
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await this.refreshData();
            });
        }

        // 导出报告按钮 - 使用点击事件
        const exportBtn = document.getElementById('exportReportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        // 趋势时间段切换按钮 - 使用事件委托
        const trendSection = document.querySelector('.trend-section');
        if (trendSection) {
            trendSection.addEventListener('click', (e) => {
                if (e.target.classList.contains('trend-btn')) {
                    this.handleTrendPeriodChange(e.target);
                }
            });
        }

        // 统计详情按钮 - 使用事件委托
        const detailedStatsTable = document.getElementById('detailedStatsTable');
        if (detailedStatsTable) {
            detailedStatsTable.addEventListener('click', (e) => {
                if (e.target.classList.contains('stats-action-btn')) {
                    const category = e.target.dataset.category;
                    const item = e.target.dataset.item;
                    this.showStatDetail(category, item);
                }
            });
        }

        // 键盘快捷键 - 使用键盘事件
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + R 刷新数据
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshData();
            }
            // Ctrl/Cmd + E 导出报告
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.exportReport();
            }
        });

        // 图表点击事件 - 自定义事件
        document.addEventListener('chartClick', (e) => {
            const { chartType, data } = e.detail;
            console.log(`图表点击: ${chartType}`, data);
        });
    }

    handleTrendPeriodChange(button) {
        // 移除其他按钮的激活状态
        document.querySelectorAll('.trend-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 激活当前按钮
        button.classList.add('active');

        // 更新趋势周期
        this.currentTrendPeriod = button.dataset.period;

        // 重新渲染趋势图
        this.renderTrendChart();
    }

    async showStatDetail(category, item) {
        try {
            // 获取详细数据
            const students = await this.getStudentsByCategory(category, item);
            
            // 设置模态框标题和内容
            this.detailModal.setTitle(`${category} - ${item} 详细信息`);
            
            const content = this.generateDetailContent(students, category, item);
            this.detailModal.setContent(content);
            
            // 显示模态框
            await this.detailModal.open();
            
        } catch (error) {
            console.error('获取详细数据失败:', error);
            showToast('获取详细数据失败', 'error');
        }
    }

    async getStudentsByCategory(category, item) {
        const { byGrade, byMajor, byGender } = this.statistics;
        
        switch (category) {
            case '年级':
                return byGrade[item] || [];
            case '专业':
                return byMajor[item] || [];
            case '性别':
                return byGender[item] || [];
            default:
                return [];
        }
    }

    generateDetailContent(students, category, item) {
        if (students.length === 0) {
            return `<p>暂无${category}为"${item}"的学生数据</p>`;
        }

        // 使用模板字符串生成详细内容
        const studentsHTML = students.map(student => `
            <div class="detail-student-card">
                <div class="student-avatar">${student.studentName.charAt(0)}</div>
                <div class="student-info">
                    <h4>${student.studentName}</h4>
                    <p>学号: ${student.studentId}</p>
                    <p>年级: ${student.grade}</p>
                    <p>专业: ${student.major}</p>
                    ${student.phone ? `<p>电话: ${student.phone}</p>` : ''}
                    ${student.email ? `<p>邮箱: ${student.email}</p>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <div class="detail-content">
                <div class="detail-summary">
                    <h3>${category} - ${item}</h3>
                    <p>共 ${students.length} 名学生</p>
                </div>
                <div class="detail-students-list">
                    ${studentsHTML}
                </div>
            </div>
        `;
    }

    async refreshData() {
        try {
            showToast('正在刷新数据...', 'info');
            
            // 重新加载统计数据
            await this.loadStatistics();
            
            // 重新渲染所有组件
            this.renderStatsCards();
            this.renderCharts();
            this.renderDetailedStats();
            this.renderTrendChart();
            
            showToast('数据刷新成功', 'success');
            
        } catch (error) {
            console.error('数据刷新失败:', error);
            showToast('数据刷新失败', 'error');
        }
    }

    exportReport() {
        try {
            // 生成报告数据
            const reportData = this.generateReportData();
            
            // 创建并下载报告文件
            const dataStr = JSON.stringify(reportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `学生统计报告_${formatDate(new Date()).replace(/[:\s-]/g, '')}.json`;
            link.click();
            
            showToast('报告导出成功', 'success');
            
        } catch (error) {
            console.error('导出报告失败:', error);
            showToast('导出报告失败', 'error');
        }
    }

    generateReportData() {
        const { total, byGrade, byMajor, byGender } = this.statistics;
        
        return {
            title: '学生信息统计报告',
            generateTime: new Date().toISOString(),
            summary: {
                totalStudents: total,
                totalGrades: Object.keys(byGrade || {}).length,
                totalMajors: Object.keys(byMajor || {}).length,
                genderTypes: Object.keys(byGender || {}).length
            },
            gradeDistribution: Object.entries(byGrade || {}).map(([grade, students]) => ({
                grade,
                count: students.length,
                percentage: StatisticsHelper.calculatePercentage(students.length, total)
            })),
            majorDistribution: Object.entries(byMajor || {}).map(([major, students]) => ({
                major,
                count: students.length,
                percentage: StatisticsHelper.calculatePercentage(students.length, total)
            })),
            genderDistribution: Object.entries(byGender || {}).map(([gender, students]) => ({
                gender,
                count: students.length,
                percentage: StatisticsHelper.calculatePercentage(students.length, total)
            }))
        };
    }

    animateNumbers() {
        const statNumbers = document.querySelectorAll('.stats-card-number');
        
        statNumbers.forEach(element => {
            const targetNumber = parseInt(element.textContent);
            let currentNumber = 0;
            const increment = targetNumber / 30; // 30步完成动画
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= targetNumber) {
                    element.textContent = targetNumber;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(currentNumber);
                }
            }, 50); // 每50ms更新一次
        });
    }
}

// 页面加载完成后初始化 - 使用DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', () => {
    new StatisticsPageManager();
});

// 导出类供其他模块使用
export { StatisticsPageManager };