

// 生成唯一ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 简化的存储管理类
class StorageManager {
    constructor() {
        this.storageKey = 'studentSystem';
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || { students: [] };
        } catch {
            return { students: [] };
        }
    }

    setData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        return true;
    }

    getStudents() {
        return this.getData().students;
    }

    setStudents(students) {
        const data = this.getData();
        data.students = students;
        this.setData(data);
    }
}

// 简化的学生数据管理类
class StudentDataManager {
    constructor() {
        this.storage = new StorageManager();
        this.initSampleData();
    }

    // 初始化示例数据
    initSampleData() {
        if (this.storage.getStudents().length === 0) {
            const sampleStudents = [
                {
                    id: generateId(),
                    studentId: '20210001',
                    studentName: '张三',
                    gender: '男',
                    grade: '大三',
                    major: '计算机科学',
                    phone: '13800138001',
                    email: 'zhangsan@example.com'
                },
                {
                    id: generateId(),
                    studentId: '20210002',
                    studentName: '李四',
                    gender: '女',
                    grade: '大二',
                    major: '软件工程',
                    phone: '13800138002',
                    email: 'lisi@example.com'
                }
            ];
            this.storage.setStudents(sampleStudents);
        }
    }

    // 获取所有学生
    getAllStudents() {
        return this.storage.getStudents();
    }

    // 添加学生
    addStudent(studentData) {
        const students = this.storage.getStudents();
        
        // 检查学号是否已存在
        if (students.some(s => s.studentId === studentData.studentId)) {
            throw new Error('学号已存在');
        }

        const newStudent = {
            id: generateId(),
            ...studentData
        };
        
        students.push(newStudent);
        this.storage.setStudents(students);
        return newStudent;
    }

    // 更新学生
    updateStudent(id, updateData) {
        const students = this.storage.getStudents();
        const index = students.findIndex(s => s.id === id);
        
        if (index === -1) {
            throw new Error('学生不存在');
        }

        students[index] = { ...students[index], ...updateData };
        this.storage.setStudents(students);
        return students[index];
    }

    // 删除学生
    deleteStudent(id) {
        const students = this.storage.getStudents();
        const filtered = students.filter(s => s.id !== id);
        
        if (filtered.length === students.length) {
            throw new Error('学生不存在');
        }

        this.storage.setStudents(filtered);
        return true;
    }

    // 获取统计数据
    getStatistics() {
        const students = this.storage.getStudents();
        const stats = {
            total: students.length,
            byGrade: {},
            byMajor: {},
            byGender: {}
        };

        students.forEach(student => {
            // 按年级统计
            stats.byGrade[student.grade] = (stats.byGrade[student.grade] || 0) + 1;
            // 按专业统计
            stats.byMajor[student.major] = (stats.byMajor[student.major] || 0) + 1;
            // 按性别统计
            stats.byGender[student.gender] = (stats.byGender[student.gender] || 0) + 1;
        });

        return stats;
    }

    // 导出数据
    exportData() {
        const students = this.storage.getStudents();
        const dataStr = JSON.stringify(students, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `学生数据导出_${new Date().toLocaleDateString()}.json`;
        link.click();
    }
}

// 创建全局实例
const studentDataManager = new StudentDataManager();

export { studentDataManager };