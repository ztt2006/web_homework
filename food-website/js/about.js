document.addEventListener('DOMContentLoaded', function() {
    // 表单提交处理
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // 简单的表单验证
            if (!name || !email || !subject || !message) {
                alert('请填写所有必填字段！');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('请输入有效的邮箱地址！');
                return;
            }
            
            // 模拟发送留言
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert(`感谢您的留言，${name}！我会尽快回复您的。`);
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // 邮箱验证函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 添加页面滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-item, .learning-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 头像点击效果
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            this.style.transform = 'scale(1.1) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 600);
        });
        
        // 添加过渡效果
        profileImage.style.transition = 'transform 0.6s ease';
    }
    
    // 技能标签点击效果
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
        
        item.style.transition = 'transform 0.2s ease';
        item.style.cursor = 'pointer';
    });
    
    // 动态更新时间
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');
        const timeElement = document.querySelector('.current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    // 每秒更新时间（如果页面有时间显示元素）
    setInterval(updateCurrentTime, 1000);
    
    // 控制台输出信息
    console.log('👋 欢迎来到美食世界！');
    console.log('📧 如有问题，请联系：student@university.edu.cn');
    console.log('🎓 这是网页设计与制作课程的期末作业');
});