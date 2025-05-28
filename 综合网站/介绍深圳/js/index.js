// 滚动时导航栏收缩效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 板块延迟动画（修改原有滚动事件）
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !section.classList.contains('visible')) {
            section.style.transitionDelay = `${index * 0.1}s`; // 0.1s间隔延迟
            section.classList.add('visible');
        }
    });
});

// 新增数字统计动效（在概况板块添加）
const statNumbers = document.querySelectorAll('.stat-card p');
statNumbers.forEach((numEl) => {
    const target = parseInt(numEl.textContent.replace('+', ''));
    let current = 0;
    const animate = () => {
        if (current < target) {
            current += Math.ceil(target / 50);
            numEl.textContent = current + '+';
            requestAnimationFrame(animate);
        }
    };
    // 滚动到视野内时触发
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(numEl);
            }
        });
    });
    observer.observe(numEl.closest('.stat-card'));
});

// 移动端汉堡菜单交互（新增）
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '☰';
document.querySelector('.nav-container').appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// 导航链接平滑滚动（可选增强）
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// 新增地标卡片视差效果
const landmarkCards = document.querySelectorAll('.landmark-card');
landmarkCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width - 0.5;
        const yPos = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${yPos * 10}deg) rotateY(${xPos * 10}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-8px)';
    });
});

// 图片懒加载（需在img标签添加loading="lazy"属性）
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
});