// 轮播图的JavaScript文件，负责实现首页的轮播图效果

const carouselImages = [
    '../images/image1.jpeg', 
    '../images/image2.jpeg', 
    '../images/image3.jpeg'
];

let currentIndex = 0;
let intervalId;

function showImage(index) {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    hero.style.backgroundImage = `url(${carouselImages[index]})`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
}

function nextImage() {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    showImage(currentIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    showImage(currentIndex);

    const nextBtn = document.querySelector('.next-button');
    const prevBtn = document.querySelector('.prev-button');
    if (nextBtn) nextBtn.addEventListener('click', () => { nextImage(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevImage(); resetInterval(); });

    intervalId = setInterval(nextImage, 5000);
    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextImage, 5000);
    }
});