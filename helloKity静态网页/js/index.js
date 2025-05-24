
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.banner-slide');
    const controls = document.querySelectorAll('.banner-controls span');
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // 初始化轮播
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        controls.forEach(control => control.classList.remove('active'));
        
        slides[index].classList.add('active');
        controls[index].classList.add('active');
        currentSlide = index;
    }
    
    // 自动轮播
    function autoSlide() {
        let nextSlide = (currentSlide + 1) % slideCount;
        showSlide(nextSlide);
    }
    
    // 点击控制点切换
    controls.forEach((control, index) => {
        control.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });
    
    // 重置定时器
    let slideTimer = setInterval(autoSlide, 3000);
    
    function resetTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(autoSlide, 3000);
    }
    
    // 鼠标悬停暂停轮播
    const banner = document.querySelector('.banner');
    banner.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });
    
    banner.addEventListener('mouseleave', () => {
        resetTimer();
    });
    
    // 订阅表单提交
    const subscribeForm = document.querySelector('.subscribe-form form');
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        if (name && email) {
            alert(`感谢 ${name} 的订阅！我们将发送确认邮件至 ${email}`);
            this.reset();
        } else {
            alert('请填写完整信息！');
        }
    });
    
    // 为所有链接添加点击动画
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // 实际项目中这里应该跳转到对应页面
                console.log('导航到:', this.getAttribute('href'));
            }, 200);
        });
    });
});