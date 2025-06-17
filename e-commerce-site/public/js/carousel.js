document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const inner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    function updateCarousel() {
        const translateValue = -currentIndex * 100;
        inner.style.transform = `translateX(${translateValue}%)`;
        
        // 更新指示器
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // 绑定事件
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // 自动播放
    let autoPlayInterval = setInterval(nextSlide, 4000);
    
    // 鼠标悬停时暂停自动播放
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 4000);
    });
    
    // 初始化显示
    updateCarousel();
});