// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 包裹在DOMContentLoaded事件中，确保DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 个人简介页内容渐入动画
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) { // 增加空值校验
        console.error('未找到.about-section元素');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.style.transform = 'translateY(0)';
                aboutSection.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });

    aboutSection.style.transform = 'translateY(30px)';
    aboutSection.style.opacity = '0';
    aboutSection.style.transition = 'all 0.8s var(--transition)';
    observer.observe(aboutSection);
});