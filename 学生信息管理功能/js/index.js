

import { NavigationComponent } from './components.js';
import { studentDataManager } from './storage.js';

class IndexPageManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.init();
    }

    init() {
        new NavigationComponent();
        this.initSlider();
        this.renderRecentStudents();
        this.bindEvents();
    }

    initSlider() {
        // 自动轮播
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    updateSlider() {
        // 更新幻灯片
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // 更新指示点
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    renderRecentStudents() {
        const students = studentDataManager.getAllStudents().slice(0, 6);
        
        if (students.length === 0) {
            document.getElementById('recentStudentsList').innerHTML = `
                <div class="empty-state">
                    <h3>暂无学生数据</h3>
                    <p>开始添加学生信息吧！</p>
                    <button class="btn btn-primary" onclick="location.href='students.html'">
                        添加学生
                    </button>
                </div>
            `;
            return;
        }

        const studentsHTML = students.map(student => `
            <div class="student-card" onclick="location.href='students.html'">
                <div class="student-avatar">${student.studentName.charAt(0)}</div>
                <div class="student-info">
                    <h4>${student.studentName}</h4>
                    <p class="student-id">${student.studentId}</p>
                    <p class="student-details">${student.grade} · ${student.major}</p>
                </div>
            </div>
        `).join('');

        document.getElementById('recentStudentsList').innerHTML = studentsHTML;
    }

    bindEvents() {
        // 轮播图按钮
        document.querySelector('.prev-btn')?.addEventListener('click', () => {
            this.prevSlide();
        });

        document.querySelector('.next-btn')?.addEventListener('click', () => {
            this.nextSlide();
        });

        // 指示点
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // CTA按钮
        document.getElementById('startBtn')?.addEventListener('click', () => {
            location.href = 'students.html';
        });

        document.getElementById('analysisBtn')?.addEventListener('click', () => {
            location.href = 'statistics.html';
        });

        document.getElementById('manageBtn')?.addEventListener('click', () => {
            location.href = 'students.html';
        });

        // 查看全部学生按钮
        document.getElementById('viewAllBtn')?.addEventListener('click', () => {
            location.href = 'students.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new IndexPageManager();
});