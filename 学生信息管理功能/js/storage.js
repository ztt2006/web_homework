/**
 * 数据存储模块
 * 使用localStorage进行数据持久化存储
 */

import { generateId, formatDateTime } from './utils.js';

// 存储管理类 - 使用ES6 Class
export class StorageManager {
    constructor() {
        this.storageKey = 'student_management_system';
        this.init();
    }

    // 初始化存储
    init() {
        if (!this.getData()) {
            this.setData({
                students: [],
                statistics: {},
                settings: {},
                lastUpdated: Date.now()
            });
        }
    }

    // 获取所有数据
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('获取数据失败:', error);
            return null;
        }
    }

    // 设置数据
    setData(data) {
        try {
            data.lastUpdated = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    // 获取学生列表
    getStudents() {
        const data = this.getData();
        return data ? data.students : [];
    }

    // 保存学生列表
    setStudents(students) {
        const data = this.getData() || {};
        data.students = students;
        return this.setData(data);
    }
}

// 学生数据管理类 - 使用ES6 Class
export class StudentDataManager {
    constructor() {
        this.storage = new StorageManager();
        this.initSampleData();
    }

    // 初始化示例数据
    initSampleData() {
        const students = this.storage.getStudents();
        if (students.length === 0) {
            const sampleStudents = [
                {
                    id: generateId(),
                    studentId: '20210001',
                    studentName: '张三',
                    gender: '男',
                    grade: '大三',
                    major: '计算机科学',
                    phone: '13800138001',
                    email: 'zhangsan@example.com',
                    createdAt: Date.now() - 86400000 * 30,
                    updatedAt: Date.now() - 86400000 * 30
                },
                {
                    id: generateId(),
                    studentId: '20210002',
                    studentName: '李四',
                    gender: '女',
                    grade: '大二',
                    major: '软件工程',
                    phone: '13800138002',
                    email: 'lisi@example.com',
                    createdAt: Date.now() - 86400000 * 25,
                    updatedAt: Date.now() - 86400000 * 25
                },
                {
                    id: generateId(),
                    studentId: '20210003',
                    studentName: '王五',
                    gender: '男',
                    grade: '大一',
                    major: '网络工程',
                    phone: '13800138003',
                    email: 'wangwu@example.com',
                    createdAt: Date.now() - 86400000 * 20,
                    updatedAt: Date.now() - 86400000 * 20
                },
                {
                    id: generateId(),
                    studentId: '20210004',
                    studentName: '赵六',
                    gender: '女',
                    grade: '大四',
                    major: '信息安全',
                    phone: '13800138004',
                    email: 'zhaoliu@example.com',
                    createdAt: Date.now() - 86400000 * 15,
                    updatedAt: Date.now() - 86400000 * 15
                },
                {
                    id: generateId(),
                    studentId: '20210005',
                    studentName: '孙七',
                    gender: '男',
                    grade: '大二',
                    major: '计算机科学',
                    phone: '13800138005',
                    email: 'sunqi@example.com',
                    createdAt: Date.now() - 86400000 * 10,
                    updatedAt: Date.now() - 86400000 * 10
                }
            ];
            this.storage.setStudents(sampleStudents);
        }
    }

    // 获取所有学生 - 返回Promise，模拟异步操作
    async getAllStudents() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const students = this.storage.getStudents();
                resolve(students);
            }, 300);
        });
    }

    // 根据ID获取学生
    async getStudentById(id) {
        const students = await this.getAllStudents();
        return students.find(student => student.id === id);
    }

    // 添加学生
    async addStudent(studentData) {
        return new Promise((resolve, reject) => {
            try {
                const students = this.storage.getStudents();
                
                // 检查学号是否已存在
                const existingStudent = students.find(s => s.studentId === studentData.studentId);
                if (existingStudent) {
                    reject(new Error('学号已存在'));
                    return;
                }

                // 创建新学生对象 - 使用解构赋值
                const newStudent = {
                    id: generateId(),
                    ...studentData,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };

                students.push(newStudent);
                
                if (this.storage.setStudents(students)) {
                    resolve(newStudent);
                } else {
                    reject(new Error('保存失败'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // 更新学生信息
    async updateStudent(id, updateData) {
        return new Promise((resolve, reject) => {
            try {
                const students = this.storage.getStudents();
                const studentIndex = students.findIndex(s => s.id === id);
                
                if (studentIndex === -1) {
                    reject(new Error('学生不存在'));
                    return;
                }

                // 检查学号是否被其他学生使用
                if (updateData.studentId) {
                    const existingStudent = students.find(s => 
                        s.studentId === updateData.studentId && s.id !== id
                    );
                    if (existingStudent) {
                        reject(new Error('学号已被其他学生使用'));
                        return;
                    }
                }

                // 更新学生信息 - 使用对象展开运算符
                students[studentIndex] = {
                    ...students[studentIndex],
                    ...updateData,
                    updatedAt: Date.now()
                };

                if (this.storage.setStudents(students)) {
                    resolve(students[studentIndex]);
                } else {
                    reject(new Error('更新失败'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // 删除学生
    async deleteStudent(id) {
        return new Promise((resolve, reject) => {
            try {
                const students = this.storage.getStudents();
                const studentIndex = students.findIndex(s => s.id === id);
                
                if (studentIndex === -1) {
                    reject(new Error('学生不存在'));
                    return;
                }

                const deletedStudent = students[studentIndex];
                students.splice(studentIndex, 1);

                if (this.storage.setStudents(students)) {
                    resolve(deletedStudent);
                } else {
                    reject(new Error('删除失败'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // 批量删除学生
    async deleteStudents(ids) {
        return new Promise((resolve, reject) => {
            try {
                const students = this.storage.getStudents();
                const deletedStudents = [];
                
                // 过滤出要删除的学生
                const remainingStudents = students.filter(student => {
                    if (ids.includes(student.id)) {
                        deletedStudents.push(student);
                        return false;
                    }
                    return true;
                });

                if (this.storage.setStudents(remainingStudents)) {
                    resolve(deletedStudents);
                } else {
                    reject(new Error('批量删除失败'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // 搜索学生 - 使用模板字符串和数组方法
    async searchStudents(keyword, filters = {}) {
        const students = await this.getAllStudents();
        
        return students.filter(student => {
            // 关键词搜索
            const keywordMatch = !keyword || 
                student.studentName.toLowerCase().includes(keyword.toLowerCase()) ||
                student.studentId.includes(keyword) ||
                (student.phone && student.phone.includes(keyword)) ||
                (student.email && student.email.toLowerCase().includes(keyword.toLowerCase()));

            // 筛选条件 - 使用解构赋值
            const { grade, major, gender } = filters;
            const gradeMatch = !grade || student.grade === grade;
            const majorMatch = !major || student.major === major;
            const genderMatch = !gender || student.gender === gender;

            return keywordMatch && gradeMatch && majorMatch && genderMatch;
        });
    }

    // 获取统计数据
    async getStatistics() {
        const students = await this.getAllStudents();
        
        // 使用数组方法计算统计数据
        const stats = {
            total: students.length,
            byGrade: this.groupBy(students, 'grade'),
            byMajor: this.groupBy(students, 'major'),
            byGender: this.groupBy(students, 'gender'),
            recent: students
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5)
        };

        return stats;
    }

    // 分组统计助手方法
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key] || '未知';
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    // 导出数据
    exportData() {
        const data = this.storage.getData();
        const exportData = {
            ...data,
            exportTime: formatDateTime(new Date()),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `学生数据_${formatDateTime(new Date()).replace(/[:\s-]/g, '')}.json`;
        link.click();
        
        return true;
    }

    // 导入数据
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (importData.students && Array.isArray(importData.students)) {
                        this.storage.setStudents(importData.students);
                        resolve(importData.students.length);
                    } else {
                        reject(new Error('数据格式不正确'));
                    }
                } catch (error) {
                    reject(new Error('文件解析失败'));
                }
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }
}

// 创建全局实例
export const studentDataManager = new StudentDataManager();