

import { NavigationComponent, ModalComponent } from './components.js';
import { studentDataManager } from './storage.js';
import { 
    showToast, 
    validateEmail, 
    validatePhone, 
    validateStudentId,
    debounce
} from './utils.js';

class StudentsPageManager {
    constructor() {
        this.allStudents = [];
        this.filteredStudents = [];
        this.searchKeyword = '';
        this.isEditing = false;
        this.editingStudentId = null;
        
        this.init();
    }

    async init() {
        // 初始化组件
        new NavigationComponent();
        this.studentModal = new ModalComponent('#studentModal');
        this.confirmModal = new ModalComponent('#confirmModal');
        
        // 加载数据
        this.loadStudents();
        
        // 绑定事件
        this.bindEvents();
    }

    loadStudents() {
        this.allStudents = studentDataManager.getAllStudents();
        this.applyFilters();
        this.renderStudents();
    }

    applyFilters() {
        const keyword = this.searchKeyword.toLowerCase();
        this.filteredStudents = this.allStudents.filter(student => {
            if (!keyword) return true;
            return student.studentName.toLowerCase().includes(keyword) ||
                   student.studentId.includes(keyword) ||
                   (student.phone && student.phone.includes(keyword));
        });
    }

    renderStudents() {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        if (this.filteredStudents.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <h3>暂无学生数据</h3>
                        <button class="btn btn-primary" onclick="studentsPageManager.showAddModal()">
                            添加第一个学生
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        const rowsHTML = this.filteredStudents.map(student => `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.studentName}</td>
                <td>${student.gender}</td>
                <td>${student.grade}</td>
                <td>${student.major}</td>
                <td>${student.phone || '-'}</td>
                <td>${student.email || '-'}</td>
                <td>
                    <button class="btn-small btn-primary" onclick="studentsPageManager.showEditModal('${student.id}')">
                        编辑
                    </button>
                    <button class="btn-small btn-danger" onclick="studentsPageManager.showDeleteConfirm('${student.id}')">
                        删除
                    </button>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = rowsHTML;
        
        // 更新统计信息
        document.getElementById('totalCount').textContent = this.filteredStudents.length;
    }

    bindEvents() {
        // 添加学生按钮
        document.getElementById('addStudentBtn').addEventListener('click', () => {
            this.showAddModal();
        });

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const debouncedSearch = debounce((value) => {
            this.searchKeyword = value;
            this.applyFilters();
            this.renderStudents();
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // 表单提交
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // 导出按钮
        document.getElementById('exportBtn').addEventListener('click', () => {
            studentDataManager.exportData();
            showToast('数据导出成功', 'success');
        });
    }

    showAddModal() {
        this.isEditing = false;
        this.resetForm();
        document.getElementById('modalTitle').textContent = '添加学生';
        this.studentModal.open();
    }

    showEditModal(studentId) {
        const student = this.allStudents.find(s => s.id === studentId);
        if (!student) return;

        this.isEditing = true;
        this.editingStudentId = studentId;
        this.fillForm(student);
        document.getElementById('modalTitle').textContent = '编辑学生';
        this.studentModal.open();
    }

    showDeleteConfirm(studentId) {
        const student = this.allStudents.find(s => s.id === studentId);
        if (!student) return;

        document.getElementById('confirmMessage').innerHTML = 
            `确定要删除学生 <strong>${student.studentName}</strong> 吗？`;
        
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.onclick = () => this.deleteStudent(studentId);
        
        this.confirmModal.open();
    }

    resetForm() {
        document.getElementById('studentForm').reset();
        // 清除错误提示
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    fillForm(student) {
        Object.keys(student).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) input.value = student[key];
        });
    }

    handleFormSubmit() {
        const formData = new FormData(document.getElementById('studentForm'));
        const data = Object.fromEntries(formData);

        // 简单验证
        if (!this.validateForm(data)) return;

        try {
            if (this.isEditing) {
                studentDataManager.updateStudent(this.editingStudentId, data);
                showToast('学生信息更新成功', 'success');
            } else {
                studentDataManager.addStudent(data);
                showToast('学生添加成功', 'success');
            }

            this.studentModal.close();
            this.loadStudents();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    validateForm(data) {
        const errors = {};
        
        if (!data.studentId) errors.studentId = '学号不能为空';
        else if (!validateStudentId(data.studentId)) errors.studentId = '学号格式不正确';
        
        if (!data.studentName) errors.studentName = '姓名不能为空';
        if (!data.gender) errors.gender = '请选择性别';
        if (!data.grade) errors.grade = '请选择年级';
        if (!data.major) errors.major = '请选择专业';
        
        if (data.phone && !validatePhone(data.phone)) errors.phone = '手机号格式不正确';
        if (data.email && !validateEmail(data.email)) errors.email = '邮箱格式不正确';

        // 显示错误
        Object.keys(errors).forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const errorEl = document.getElementById(`${field}Error`);
            if (input && errorEl) {
                input.classList.add('error');
                errorEl.textContent = errors[field];
            }
        });

        return Object.keys(errors).length === 0;
    }

    deleteStudent(studentId) {
        try {
            studentDataManager.deleteStudent(studentId);
            showToast('学生删除成功', 'success');
            this.confirmModal.close();
            this.loadStudents();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.studentsPageManager = new StudentsPageManager();
});