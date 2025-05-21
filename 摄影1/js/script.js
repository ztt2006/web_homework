document.addEventListener('DOMContentLoaded', () => {
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});