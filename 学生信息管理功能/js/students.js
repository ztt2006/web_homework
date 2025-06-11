/**
 * 学生管理页面主要逻辑
 * 实现学生的增删改查、搜索筛选、分页等功能
 */

import { NavigationComponent, ModalComponent, PaginationComponent } from './components.js';
import { studentDataManager } from './storage.js';
import { 
    showToast, 
    validateEmail, 
    validatePhone, 
    validateStudentId,
    debounce,
    showLoading,
    hideLoading
} from './utils.js';

// 学生管理页面类 - 使用ES6 Class
class StudentsPageManager {
    constructor() {
        // 数据相关属性
        this.allStudents = [];
        this.filteredStudents = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalPages = 1;
        this.selectedStudents = new Set();
        
        // 搜索和筛选相关
        this.searchKeyword = '';
        this.filters = {
            grade: '',
            major: '',
            gender: ''
        };
        
        // 表单相关
        this.isEditing = false;
        this.editingStudentId = null;
        
        this.init();
    }

    async init() {
        console.log('学生管理页面初始化开始');
        
        // 初始化组件
        this.initComponents();
        
        // 处理URL参数
        this.handleURLParams();
        
        // 加载数据
        await this.loadStudents();
        
        // 渲染界面
        this.renderStudents();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('学生管理页面初始化完成');
    }

    initComponents() {
        // 导航栏组件
        new NavigationComponent();
        
        // 学生信息模态框
        this.studentModal = new ModalComponent('#studentModal');
        
        // 确认删除模态框
        this.confirmModal = new ModalComponent('#confirmModal');
        
        // 分页组件
        this.pagination = new PaginationComponent('#pagination', {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            onPageChange: (page) => this.handlePageChange(page)
        });
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 处理搜索聚焦
        if (urlParams.get('focus') === 'search') {
            setTimeout(() => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }, 500);
        }
        
        // 处理高亮学生
        const highlightId = urlParams.get('highlight');
        if (highlightId) {
            this.highlightStudentId = highlightId;
        }
    }

    async loadStudents() {
        try {
            showLoading();
            
            // 使用async/await加载学生数据
            this.allStudents = await studentDataManager.getAllStudents();
            console.log('学生数据加载完成:', this.allStudents.length, '名学生');
            
            // 应用筛选
            this.applyFilters();
            
        } catch (error) {
            console.error('加载学生数据失败:', error);
            showToast('加载学生数据失败', 'error');
        } finally {
            hideLoading();
        }
    }

    applyFilters() {
        // 使用数组方法进行筛选 - 结合搜索和筛选条件
        this.filteredStudents = this.allStudents.filter(student => {
            // 搜索关键词匹配 - 使用解构赋值
            const { studentName, studentId, phone = '', email = '' } = student;
            const keyword = this.searchKeyword.toLowerCase();
            const keywordMatch = !keyword || 
                studentName.toLowerCase().includes(keyword) ||
                studentId.includes(keyword) ||
                phone.includes(keyword) ||
                email.toLowerCase().includes(keyword);

            // 筛选条件匹配
            const gradeMatch = !this.filters.grade || student.grade === this.filters.grade;
            const majorMatch = !this.filters.major || student.major === this.filters.major;
            const genderMatch = !this.filters.gender || student.gender === this.filters.gender;

            return keywordMatch && gradeMatch && majorMatch && genderMatch;
        });

        // 更新分页信息
        this.updatePagination();
    }

    updatePagination() {
        const totalItems = this.filteredStudents.length;
        this.totalPages = Math.ceil(totalItems / this.pageSize);
        
        // 确保当前页不超出范围
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }

        // 更新分页组件
        if (this.pagination) {
            this.pagination.update({
                totalItems,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            });
        }

        // 更新页面信息显示
        this.updatePageInfo();
    }

    updatePageInfo() {
        const totalCountEl = document.getElementById('totalCount');
        const currentPageNumEl = document.getElementById('currentPageNum');
        const totalPagesEl = document.getElementById('totalPages');

        if (totalCountEl) totalCountEl.textContent = this.filteredStudents.length;
        if (currentPageNumEl) currentPageNumEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = this.totalPages;
    }

    renderStudents() {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        // 计算当前页显示的学生
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const currentStudents = this.filteredStudents.slice(startIndex, endIndex);

        if (currentStudents.length === 0) {
            this.renderEmptyState();
            return;
        }

        // 使用模板字符串和数组方法渲染表格行
        const rowsHTML = currentStudents.map(student => {
            const isSelected = this.selectedStudents.has(student.id);
            const isHighlighted = student.id === this.highlightStudentId;
            
            return `
                <tr class="student-row ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}" 
                    data-id="${student.id}">
                    <td>
                        <input type="checkbox" class="student-checkbox" 
                               value="${student.id}" ${isSelected ? 'checked' : ''}>
                    </td>
                    <td>${student.studentId}</td>
                    <td>${student.studentName}</td>
                    <td>${student.gender}</td>
                    <td>${student.grade}</td>
                    <td>${student.major}</td>
                    <td>${student.phone || '-'}</td>
                    <td>${student.email || '-'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" data-id="${student.id}">编辑</button>
                            <button class="action-btn delete-btn" data-id="${student.id}">删除</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        tableBody.innerHTML = rowsHTML;

        // 高亮显示后清除标记
        if (this.highlightStudentId) {
            setTimeout(() => {
                this.highlightStudentId = null;
                this.renderStudents();
            }, 3000);
        }

        // 更新全选复选框状态
        this.updateSelectAllCheckbox();
        
        // 更新批量操作显示
        this.updateBulkActions();
    }

    renderEmptyState() {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        const hasFilters = this.searchKeyword || Object.values(this.filters).some(f => f);
        
        const emptyHTML = `
            <tr>
                <td colspan="9" class="empty-state">
                    <h3>暂无学生数据</h3>
                    <p>没有找到符合条件的学生信息</p>
                    ${hasFilters ? 
                        '<button class="btn btn-secondary" id="clearFiltersBtn">清空筛选条件</button>' : 
                        '<button class="btn btn-primary" id="addFirstStudentBtn">添加第一个学生</button>'
                    }
                </td>
            </tr>
        `;

        tableBody.innerHTML = emptyHTML;

        // 绑定空状态按钮事件
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }

        const addFirstStudentBtn = document.getElementById('addFirstStudentBtn');
        if (addFirstStudentBtn) {
            addFirstStudentBtn.addEventListener('click', () => this.showAddStudentModal());
        }
    }

    bindEvents() {
        // 添加学生按钮 - 使用点击事件
        const addStudentBtn = document.getElementById('addStudentBtn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => {
                this.showAddStudentModal();
            });
        }

        // 搜索输入框 - 使用输入事件和防抖
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const debouncedSearch = debounce((value) => {
                this.searchKeyword = value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderStudents();
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }

        // 搜索按钮 - 使用点击事件
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    this.searchKeyword = searchInput.value;
                    this.currentPage = 1;
                    this.applyFilters();
                    this.renderStudents();
                }
            });
        }

        // 筛选器变化 - 使用change事件
        const filters = ['gradeFilter', 'majorFilter'];
        filters.forEach(filterId => {
            const filterEl = document.getElementById(filterId);
            if (filterEl) {
                filterEl.addEventListener('change', (e) => {
                    const filterKey = filterId.replace('Filter', '');
                    this.filters[filterKey] = e.target.value;
                    this.currentPage = 1;
                    this.applyFilters();
                    this.renderStudents();
                });
            }
        });

        // 清空筛选按钮
        const clearFilterBtn = document.getElementById('clearFilterBtn');
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // 全选复选框 - 使用change事件
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.handleSelectAll(e.target.checked);
            });
        }

        // 表格事件委托 - 处理复选框、编辑、删除按钮
        const studentsTable = document.getElementById('studentsTable');
        if (studentsTable) {
            studentsTable.addEventListener('click', (e) => {
                this.handleTableClick(e);
            });

            studentsTable.addEventListener('change', (e) => {
                if (e.target.classList.contains('student-checkbox')) {
                    this.handleStudentSelection(e.target);
                }
            });
        }

        // 批量删除按钮
        const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', () => {
                this.showBulkDeleteConfirm();
            });
        }

        // 导出按钮
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportStudents();
            });
        }

        // 学生表单提交 - 使用submit事件
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // 表单取消按钮
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.studentModal.close();
            });
        }

        // 模态框关闭按钮
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.studentModal.close();
            });
        }

        // 确认删除模态框按钮
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                this.confirmModal.close();
            });
        }

        const closeConfirmModal = document.getElementById('closeConfirmModal');
        if (closeConfirmModal) {
            closeConfirmModal.addEventListener('click', () => {
                this.confirmModal.close();
            });
        }

        // 键盘快捷键 - 使用键盘事件
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
    }

    handleTableClick(e) {
        const target = e.target;
        
        if (target.classList.contains('edit-btn')) {
            const studentId = target.dataset.id;
            this.showEditStudentModal(studentId);
        } else if (target.classList.contains('delete-btn')) {
            const studentId = target.dataset.id;
            this.showDeleteConfirm(studentId);
        }
    }

    handleStudentSelection(checkbox) {
        const studentId = checkbox.value;
        
        if (checkbox.checked) {
            this.selectedStudents.add(studentId);
        } else {
            this.selectedStudents.delete(studentId);
        }

        // 更新全选状态
        this.updateSelectAllCheckbox();
        
        // 更新批量操作显示
        this.updateBulkActions();
        
        // 更新行样式
        const row = checkbox.closest('tr');
        if (row) {
            row.classList.toggle('selected', checkbox.checked);
        }
    }

    handleSelectAll(checked) {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const currentStudents = this.filteredStudents.slice(startIndex, endIndex);

        if (checked) {
            currentStudents.forEach(student => {
                this.selectedStudents.add(student.id);
            });
        } else {
            currentStudents.forEach(student => {
                this.selectedStudents.delete(student.id);
            });
        }

        // 更新复选框状态
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const row = checkbox.closest('tr');
            if (row) {
                row.classList.toggle('selected', checked);
            }
        });

        // 更新批量操作显示
        this.updateBulkActions();
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (!selectAllCheckbox) return;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const currentStudents = this.filteredStudents.slice(startIndex, endIndex);
        
        const selectedCount = currentStudents.filter(student => 
            this.selectedStudents.has(student.id)
        ).length;

        selectAllCheckbox.checked = selectedCount === currentStudents.length && currentStudents.length > 0;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < currentStudents.length;
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = this.selectedStudents.size;

        if (bulkActions) {
            if (selectedCount > 0) {
                bulkActions.style.display = 'flex';
                const countEl = bulkActions.querySelector('#selectedCount');
                if (countEl) {
                    countEl.textContent = selectedCount;
                }
            } else {
                bulkActions.style.display = 'none';
            }
        }
    }

    handlePageChange(page) {
        this.currentPage = page;
        this.selectedStudents.clear(); // 切换页面时清空选择
        this.renderStudents();
    }

    async showAddStudentModal() {
        this.isEditing = false;
        this.editingStudentId = null;
        
        // 重置表单
        this.resetForm();
        
        // 设置模态框标题
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = '添加学生';
        }
        
        // 显示模态框
        await this.studentModal.open();
        
        // 聚焦第一个输入框
        const firstInput = document.querySelector('#studentForm input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    async showEditStudentModal(studentId) {
        try {
            // 获取学生信息
            const student = this.allStudents.find(s => s.id === studentId);
            if (!student) {
                showToast('学生不存在', 'error');
                return;
            }

            this.isEditing = true;
            this.editingStudentId = studentId;
            
            // 填充表单
            this.fillForm(student);
            
            // 设置模态框标题
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) {
                modalTitle.textContent = '编辑学生信息';
            }
            
            // 显示模态框
            await this.studentModal.open();
            
        } catch (error) {
            console.error('获取学生信息失败:', error);
            showToast('获取学生信息失败', 'error');
        }
    }

    showDeleteConfirm(studentId) {
        const student = this.allStudents.find(s => s.id === studentId);
        if (!student) return;

        const confirmMessage = document.getElementById('confirmMessage');
        if (confirmMessage) {
            confirmMessage.innerHTML = `确定要删除学生 <strong>${student.studentName}</strong> 的信息吗？此操作不可撤销。`;
        }

        // 绑定确认删除按钮事件
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            // 先移除之前的事件监听器
            const newBtn = confirmDeleteBtn.cloneNode(true);
            confirmDeleteBtn.parentNode.replaceChild(newBtn, confirmDeleteBtn);
            
            // 添加新的事件监听器
            newBtn.addEventListener('click', () => {
                this.deleteStudent(studentId);
            });
        }

        this.confirmModal.open();
    }

    showBulkDeleteConfirm() {
        if (this.selectedStudents.size === 0) return;

        const confirmMessage = document.getElementById('confirmMessage');
        if (confirmMessage) {
            confirmMessage.innerHTML = `确定要删除选中的 <strong>${this.selectedStudents.size}</strong> 个学生吗？此操作不可撤销。`;
        }

        // 绑定确认删除按钮事件
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            // 先移除之前的事件监听器
            const newBtn = confirmDeleteBtn.cloneNode(true);
            confirmDeleteBtn.parentNode.replaceChild(newBtn, confirmDeleteBtn);
            
            // 添加新的事件监听器
            newBtn.addEventListener('click', () => {
                this.bulkDeleteStudents();
            });
        }

        this.confirmModal.open();
    }

    resetForm() {
        const form = document.getElementById('studentForm');
        if (form) {
            form.reset();
            
            // 清除错误状态
            const errorElements = form.querySelectorAll('.error');
            errorElements.forEach(el => el.classList.remove('error'));
            
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(el => el.textContent = '');
        }
    }

    fillForm(student) {
        // 使用解构赋值获取学生信息
        const { studentId, studentName, gender, grade, major, phone, email } = student;
        
        const form = document.getElementById('studentForm');
        if (!form) return;

        // 填充表单字段
        const fields = {
            studentId,
            studentName,
            gender,
            grade,
            major,
            phone: phone || '',
            email: email || ''
        };

        Object.entries(fields).forEach(([key, value]) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        });
    }

    async handleFormSubmit() {
        try {
            // 获取表单数据
            const formData = this.getFormData();
            
            // 验证表单
            if (!this.validateForm(formData)) {
                return;
            }

            showLoading();

            if (this.isEditing) {
                // 更新学生
                await studentDataManager.updateStudent(this.editingStudentId, formData);
                showToast('学生信息更新成功', 'success');
            } else {
                // 添加学生
                await studentDataManager.addStudent(formData);
                showToast('学生添加成功', 'success');
            }

            // 关闭模态框
            await this.studentModal.close();
            
            // 重新加载数据
            await this.loadStudents();
            this.renderStudents();

        } catch (error) {
            console.error('保存学生信息失败:', error);
            showToast(error.message || '保存失败', 'error');
        } finally {
            hideLoading();
        }
    }

    getFormData() {
        const form = document.getElementById('studentForm');
        if (!form) return {};

        const formData = new FormData(form);
        return Object.fromEntries(formData);
    }

    validateForm(data) {
        const form = document.getElementById('studentForm');
        if (!form) return false;

        let isValid = true;

        // 清除之前的错误
        const errorElements = form.querySelectorAll('.error');
        errorElements.forEach(el => el.classList.remove('error'));
        
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');

        // 验证必填字段
        const requiredFields = ['studentId', 'studentName', 'gender', 'grade', 'major'];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                this.showFieldError(field, '此字段为必填项');
                isValid = false;
            }
        });

        // 验证学号格式
        if (data.studentId && !validateStudentId(data.studentId)) {
            this.showFieldError('studentId', '学号格式不正确');
            isValid = false;
        }

        // 验证手机号格式
        if (data.phone && !validatePhone(data.phone)) {
            this.showFieldError('phone', '手机号格式不正确');
            isValid = false;
        }

        // 验证邮箱格式
        if (data.email && !validateEmail(data.email)) {
            this.showFieldError('email', '邮箱格式不正确');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.classList.add('error');
        
        const errorEl = document.querySelector(`#${fieldName}Error`);
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    async deleteStudent(studentId) {
        try {
            await studentDataManager.deleteStudent(studentId);
            showToast('学生删除成功', 'success');
            
            await this.confirmModal.close();
            
            // 重新加载数据
            await this.loadStudents();
            this.renderStudents();
            
        } catch (error) {
            console.error('删除学生失败:', error);
            showToast(error.message || '删除失败', 'error');
        }
    }

    async bulkDeleteStudents() {
        try {
            const selectedIds = Array.from(this.selectedStudents);
            await studentDataManager.deleteStudents(selectedIds);
            
            showToast(`成功删除 ${selectedIds.length} 个学生`, 'success');
            
            await this.confirmModal.close();
            
            // 清空选择
            this.selectedStudents.clear();
            
            // 重新加载数据
            await this.loadStudents();
            this.renderStudents();
            
        } catch (error) {
            console.error('批量删除失败:', error);
            showToast(error.message || '批量删除失败', 'error');
        }
    }

    clearAllFilters() {
        // 清空搜索关键词
        this.searchKeyword = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        // 清空筛选条件
        this.filters = {
            grade: '',
            major: '',
            gender: ''
        };

        // 重置筛选器UI
        const filterSelects = ['gradeFilter', 'majorFilter'];
        filterSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.value = '';
            }
        });

        // 重置分页
        this.currentPage = 1;
        
        // 重新应用筛选
        this.applyFilters();
        this.renderStudents();
    }

    exportStudents() {
        try {
            studentDataManager.exportData();
            showToast('数据导出成功', 'success');
        } catch (error) {
            console.error('导出失败:', error);
            showToast('导出失败', 'error');
        }
    }

    handleKeydown(e) {
        // Ctrl/Cmd + N 添加新学生
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showAddStudentModal();
        }
        
        // Delete 删除选中学生
        if (e.key === 'Delete' && this.selectedStudents.size > 0) {
            this.showBulkDeleteConfirm();
        }
        
        // Ctrl/Cmd + A 全选当前页学生
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = true;
                this.handleSelectAll(true);
            }
        }
    }
}

// 创建全局实例并暴露到window对象
let studentsPageManager;

// 页面加载完成后初始化 - 使用DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', () => {
    studentsPageManager = new StudentsPageManager();
    // 暴露到全局作用域以便HTML中的onclick可以访问
    window.studentsPageManager = studentsPageManager;
});

// 导出类供其他模块使用
export { StudentsPageManager };