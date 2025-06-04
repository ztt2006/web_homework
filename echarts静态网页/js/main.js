import { initUserAnalysisCharts, resizeUserAnalysisCharts } from './modules/userAnalysis.js';
import { initSalesAnalysisCharts, resizeSalesAnalysisCharts } from './modules/salesAnalysis.js';
import { initOrderAnalysisCharts, resizeOrderAnalysisCharts } from './modules/orderAnalysis.js';

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const moduleSections = document.querySelectorAll('.module-section');
    const currentModuleTitle = document.getElementById('current-module-title');
    const themeToggleButton = document.getElementById('theme-toggle');

    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme + '-theme');
    themeToggleButton.textContent = currentTheme === 'light' ? '切换到暗色主题' : '切换到亮色主题';


    function activateSection(sectionId) {
        moduleSections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId + "-section");
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (activeNavItem) {
            currentModuleTitle.textContent = activeNavItem.textContent.trim();
        }
        
        switch (sectionId) {
            case 'user':
                initUserAnalysisCharts(currentTheme);
                break;
            case 'sales':
                initSalesAnalysisCharts(currentTheme);
                break;
            case 'order':
                initOrderAnalysisCharts(currentTheme);
                break;
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;
            activateSection(sectionId);
        });
    });

    themeToggleButton.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(currentTheme + '-theme');
        localStorage.setItem('theme', currentTheme);
        themeToggleButton.textContent = currentTheme === 'light' ? '切换到暗色主题' : '切换到亮色主题';
        
        const activeSection = document.querySelector('.nav-item.active')?.dataset.section || 'user';
        activateSection(activeSection); 
    });

    activateSection('user'); 

    window.addEventListener('resize', () => {
        resizeUserAnalysisCharts();
        resizeSalesAnalysisCharts();
        resizeOrderAnalysisCharts();
    });
});