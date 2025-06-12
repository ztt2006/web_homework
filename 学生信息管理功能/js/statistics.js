

import { NavigationComponent } from './components.js';
import { studentDataManager } from './storage.js';

class StatisticsPageManager {
    constructor() {
        this.statistics = {};
        this.init();
    }

    init() {
        new NavigationComponent();
        this.loadStatistics();
        this.renderStatistics();
    }

    loadStatistics() {
        this.statistics = studentDataManager.getStatistics();
    }

    renderStatistics() {
        this.renderStatsCards();
        this.renderDetailedStats();
    }

    renderStatsCards() {
        const { total, byGrade, byMajor, byGender } = this.statistics;
        
        const statsData = [
            { label: '学生总数', value: total, color: '#3498db' },
            { label: '年级数量', value: Object.keys(byGrade).length, color: '#e74c3c' },
            { label: '专业数量', value: Object.keys(byMajor).length, color: '#27ae60' },
            { label: '性别分类', value: Object.keys(byGender).length, color: '#f39c12' }
        ];

        const cardsHTML = statsData.map(stat => `
            <div class="stats-card" style="border-left: 4px solid ${stat.color}">
                <div class="stats-number">${stat.value}</div>
                <div class="stats-label">${stat.label}</div>
            </div>
        `).join('');

        document.getElementById('statsCards').innerHTML = cardsHTML;
    }

    renderDetailedStats() {
        const { total, byGrade, byMajor, byGender } = this.statistics;
        let tableHTML = '';

        // 年级统计
        Object.entries(byGrade).forEach(([grade, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            tableHTML += `
                <tr>
                    <td><span class="badge grade">年级</span></td>
                    <td>${grade}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });

        // 专业统计
        Object.entries(byMajor).forEach(([major, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            tableHTML += `
                <tr>
                    <td><span class="badge major">专业</span></td>
                    <td>${major}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });

        // 性别统计
        Object.entries(byGender).forEach(([gender, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            tableHTML += `
                <tr>
                    <td><span class="badge gender">性别</span></td>
                    <td>${gender}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });

        document.getElementById('detailedStatsBody').innerHTML = tableHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StatisticsPageManager();
});