/**
 * 可复用组件模块
 * 包含导航栏、模态框、分页等通用组件
 */

import { AnimationHelper } from './utils.js';

// 导航栏组件 - 使用ES6 Class
export class NavigationComponent {
    constructor() {
        this.animationHelper = new AnimationHelper();
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveLink();
    }

    bindEvents() {
        // 汉堡菜单点击事件
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // 点击导航链接时关闭移动端菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // 滚动时隐藏移动端菜单 - 使用箭头函数
        window.addEventListener('scroll', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// 模态框组件
export class ModalComponent {
    constructor(selector) {
        this.modal = document.querySelector(selector);
        this.modalContent = this.modal?.querySelector('.modal-content');
        this.closeBtn = this.modal?.querySelector('.close-btn');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.modal) return;
        this.bindEvents();
    }

    bindEvents() {
        // 关闭按钮事件
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // 点击背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // ESC键关闭 - 使用键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    // 打开模态框 - 返回Promise
    open() {
        return new Promise((resolve) => {
            this.modal.classList.add('show');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
            
            // 添加动画效果
            if (this.modalContent) {
                this.modalContent.style.animation = 'slideInDown 0.3s ease-out';
            }
            
            resolve();
        });
    }

    // 关闭模态框
    close() {
        return new Promise((resolve) => {
            this.modal.classList.remove('show');
            this.isOpen = false;
            document.body.style.overflow = 'auto';
            
            resolve();
        });
    }

    // 设置内容
    setContent(content) {
        const modalBody = this.modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = content;
        }
    }

    // 设置标题
    setTitle(title) {
        const modalTitle = this.modal.querySelector('.modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = title;
        }
    }
}

// 分页组件
export class PaginationComponent {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.currentPage = options.currentPage || 1;
        this.totalPages = options.totalPages || 1;
        this.pageSize = options.pageSize || 10;
        this.totalItems = options.totalItems || 0;
        this.onPageChange = options.onPageChange || (() => {});
        
        this.init();
    }

    init() {
        if (!this.container) return;
        this.render();
        this.bindEvents();
    }

    render() {
        const { currentPage, totalPages } = this;
        let paginationHTML = '';

        // 上一页按钮
        paginationHTML += `
            <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
                    data-page="${currentPage - 1}" 
                    ${currentPage === 1 ? 'disabled' : ''}>
                上一页
            </button>
        `;

        // 页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                        data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // 下一页按钮
        paginationHTML += `
            <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                    data-page="${currentPage + 1}" 
                    ${currentPage === totalPages ? 'disabled' : ''}>
                下一页
            </button>
        `;

        this.container.innerHTML = paginationHTML;
    }

    bindEvents() {
        // 使用事件委托处理点击事件
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn') && !e.target.disabled) {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            }
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }

        this.currentPage = page;
        this.render();
        this.onPageChange(page);
    }

    // 更新分页信息
    update({ totalItems, pageSize, currentPage }) {
        this.totalItems = totalItems || this.totalItems;
        this.pageSize = pageSize || this.pageSize;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = currentPage || this.currentPage;
        
        // 确保当前页不超出范围
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
        
        this.render();
    }
}

// 表格组件
export class TableComponent {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.columns = options.columns || [];
        this.data = options.data || [];
        this.sortable = options.sortable || false;
        this.selectable = options.selectable || false;
        this.onRowClick = options.onRowClick || (() => {});
        this.onSelectionChange = options.onSelectionChange || (() => {});
        
        this.selectedItems = new Set();
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        this.init();
    }

    init() {
        if (!this.container) return;
        this.render();
        this.bindEvents();
    }

    render() {
        const { columns, data, sortable, selectable } = this;
        
        let tableHTML = '<table class="data-table"><thead><tr>';
        
        // 添加选择列
        if (selectable) {
            tableHTML += `
                <th class="select-column">
                    <input type="checkbox" id="selectAll" class="select-all-checkbox">
                </th>
            `;
        }

        // 添加数据列
        columns.forEach(column => {
            const sortClass = this.sortColumn === column.key ? 
                `sorted ${this.sortDirection}` : '';
            const sortable_attr = sortable && column.sortable !== false ? 
                `data-sort="${column.key}" class="sortable ${sortClass}"` : '';
                
            tableHTML += `<th ${sortable_attr}>${column.title}</th>`;
        });

        tableHTML += '</tr></thead><tbody>';

        // 添加数据行
        data.forEach((row, index) => {
            const isSelected = this.selectedItems.has(row.id);
            tableHTML += `<tr class="data-row ${isSelected ? 'selected' : ''}" data-id="${row.id}">`;
            
            if (selectable) {
                tableHTML += `
                    <td class="select-column">
                        <input type="checkbox" class="row-checkbox" value="${row.id}" ${isSelected ? 'checked' : ''}>
                    </td>
                `;
            }

            columns.forEach(column => {
                let cellContent = row[column.key] || '';
                
                // 如果有自定义渲染函数
                if (column.render && typeof column.render === 'function') {
                    cellContent = column.render(cellContent, row, index);
                }
                
                tableHTML += `<td>${cellContent}</td>`;
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        this.container.innerHTML = tableHTML;
    }

    bindEvents() {
        // 表头排序点击事件
        if (this.sortable) {
            this.container.addEventListener('click', (e) => {
                if (e.target.classList.contains('sortable')) {
                    const sortKey = e.target.dataset.sort;
                    this.handleSort(sortKey);
                }
            });
        }

        // 全选复选框事件
        const selectAllCheckbox = this.container.querySelector('.select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.handleSelectAll(e.target.checked);
            });
        }

        // 行复选框事件 - 使用事件委托
        this.container.addEventListener('change', (e) => {
            if (e.target.classList.contains('row-checkbox')) {
                const id = e.target.value;
                this.handleRowSelection(id, e.target.checked);
            }
        });

        // 行点击事件
        this.container.addEventListener('click', (e) => {
            const row = e.target.closest('.data-row');
            if (row && !e.target.closest('.select-column')) {
                const id = row.dataset.id;
                const rowData = this.data.find(item => item.id === id);
                this.onRowClick(rowData);
            }
        });
    }

    // 处理排序
    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // 排序数据
        this.data.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.render();
    }

    // 处理全选
    handleSelectAll(checked) {
        if (checked) {
            this.data.forEach(item => this.selectedItems.add(item.id));
        } else {
            this.selectedItems.clear();
        }
        
        this.render();
        this.onSelectionChange(Array.from(this.selectedItems));
    }

    // 处理单行选择
    handleRowSelection(id, checked) {
        if (checked) {
            this.selectedItems.add(id);
        } else {
            this.selectedItems.delete(id);
        }
        
        // 更新全选状态
        const selectAllCheckbox = this.container.querySelector('.select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = this.selectedItems.size === this.data.length;
            selectAllCheckbox.indeterminate = this.selectedItems.size > 0 && this.selectedItems.size < this.data.length;
        }
        
        this.onSelectionChange(Array.from(this.selectedItems));
    }

    // 更新数据
    updateData(newData) {
        this.data = newData;
        this.selectedItems.clear();
        this.render();
    }

    // 获取选中项
    getSelectedItems() {
        return Array.from(this.selectedItems);
    }

    // 清空选择
    clearSelection() {
        this.selectedItems.clear();
        this.render();
        this.onSelectionChange([]);
    }
}

// 轮播图组件
export class SliderComponent {
    constructor(selector, options = {}) {
        this.slider = document.querySelector(selector);
        this.slides = this.slider?.querySelectorAll('.slide');
        this.dots = this.slider?.querySelectorAll('.dot');
        this.prevBtn = this.slider?.querySelector('.prev-btn');
        this.nextBtn = this.slider?.querySelector('.next-btn');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides?.length || 0;
        this.autoPlay = options.autoPlay !== false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = options.delay || 5000;
        
        this.init();
    }

    init() {
        if (!this.slider || this.totalSlides === 0) return;
        
        this.bindEvents();
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    bindEvents() {
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

        // 指示器点击 - 使用事件委托
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });
        }

        // 鼠标悬停暂停自动播放 - 使用鼠标事件
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.slider.addEventListener('mouseleave', () => {
            if (this.autoPlay) this.startAutoPlay();
        });

        // 键盘控制 - 使用键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    goToSlide(index) {
        // 移除当前激活状态
        this.slides[this.currentSlide].classList.remove('active');
        if (this.dots) {
            this.dots[this.currentSlide].classList.remove('active');
        }
        
        // 设置新的激活状态
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        if (this.dots) {
            this.dots[this.currentSlide].classList.add('active');
        }

        // 触发自定义事件
        const customEvent = new CustomEvent('slideChange', {
            detail: { currentSlide: this.currentSlide }
        });
        this.slider.dispatchEvent(customEvent);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}