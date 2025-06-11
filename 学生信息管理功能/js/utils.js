/**
 * 工具函数模块
 * 提供通用的工具方法和ES6+特性实现
 */

// 防抖函数 - 使用箭头函数和默认参数
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// 节流函数 - 使用箭头函数
export const throttle = (func, limit = 100) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// 验证邮箱格式
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 验证手机号格式
export const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
};

// 验证学号格式（示例：8位数字）
export const validateStudentId = (studentId) => {
    const studentIdRegex = /^\d{8}$/;
    return studentIdRegex.test(studentId);
};

// 显示提示消息
export const showToast = (message, type = 'info') => {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// 显示加载状态
export const showLoading = () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
};

// 隐藏加载状态
export const hideLoading = () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
};

// 生成随机ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// 格式化日期 - 使用模板字符串
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 格式化时间
export const formatDateTime = (date) => {
    const d = new Date(date);
    const dateStr = formatDate(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}`;
};

// 深拷贝对象
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

// 动画工具类 - 使用ES6 Class
export class AnimationHelper {
    constructor() {
        this.animations = new Map();
    }

    // 淡入动画
    fadeIn(element, duration = 500) {
        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = Math.min(progress / duration, 1);
                
                element.style.opacity = opacity;
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    // 滑入动画
    slideIn(element, direction = 'left', duration = 500) {
        return new Promise((resolve) => {
            const startPos = direction === 'left' ? -100 : 100;
            element.style.transform = `translateX(${startPos}%)`;
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const position = startPos * (1 - Math.min(progress / duration, 1));
                
                element.style.transform = `translateX(${position}%)`;
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = 'translateX(0)';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
}

// 数据统计工具
export class StatisticsHelper {
    // 计算数组中各项出现次数
    static countOccurrences(arr, key = null) {
        const counts = {};
        arr.forEach(item => {
            const value = key ? item[key] : item;
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    }

    // 计算百分比
    static calculatePercentage(part, total) {
        if (total === 0) return 0;
        return ((part / total) * 100).toFixed(1);
    }

    // 计算平均值
    static calculateAverage(numbers) {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        return (sum / numbers.length).toFixed(2);
    }
}