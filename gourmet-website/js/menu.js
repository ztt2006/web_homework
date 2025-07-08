// 菜单功能模块
(function() {
    'use strict';

    class MenuManager {
        constructor() {
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.menuItems = document.querySelectorAll('.featured-card, .category-card');
            this.loadMoreBtn = document.querySelector('.load-more-btn');
            this.currentFilter = 'all';
            this.itemsPerPage = 6;
            this.currentPage = 1;
            this.totalItems = 0;
            
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.initializeItems();
            this.setupCardInteractions();
            this.setupLoadMore();
            this.initializeFilters();
        }

        setupEventListeners() {
            // 筛选按钮事件
            this.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleFilterClick(e);
                });
            });

            // 加载更多按钮
            if (this.loadMoreBtn) {
                this.loadMoreBtn.addEventListener('click', () => {
                    this.loadMoreItems();
                });
            }

            // 卡片悬停效果
            this.menuItems.forEach(item => {
                this.setupCardHoverEffect(item);
            });
        }

        handleFilterClick(e) {
            e.preventDefault();
            
            const clickedBtn = e.target;
            const filterValue = clickedBtn.getAttribute('data-filter') || 'all';
            
            // 更新按钮状态
            this.updateFilterButtons(clickedBtn);
            
            // 执行筛选
            this.filterItems(filterValue);
            
            this.currentFilter = filterValue;
            this.currentPage = 1;
        }

        updateFilterButtons(activeBtn) {
            this.filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            activeBtn.classList.add('active');
        }

        filterItems(filterValue) {
            let visibleCount = 0;
            
            this.menuItems.forEach((item, index) => {
                const shouldShow = this.shouldShowItem(item, filterValue);
                
                if (shouldShow) {
                    this.showItem(item, visibleCount);
                    visibleCount++;
                } else {
                    this.hideItem(item);
                }
            });
            
            this.updateLoadMoreButton(visibleCount);
        }

        shouldShowItem(item, filterValue) {
            if (filterValue === 'all') return true;
            
            // 检查数据属性
            const itemCategory = item.getAttribute('data-category');
            const itemTags = item.getAttribute('data-tags');
            
            return itemCategory === filterValue || 
                   (itemTags && itemTags.includes(filterValue));
        }

        showItem(item, index) {
            item.style.display = 'block';
            item.classList.remove('fade-out');
            
            // 添加延迟动画
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 100);
        }

        hideItem(item) {
            item.classList.add('fade-out');
            setTimeout(() => {
                item.style.display = 'none';
                item.classList.remove('fade-in', 'fade-out');
            }, 300);
        }

        initializeItems() {
            // 为每个菜单项添加数据属性（模拟数据）
            this.menuItems.forEach((item, index) => {
                if (!item.hasAttribute('data-category')) {
                    const categories = ['sichuan', 'cantonese', 'seafood', 'vegetarian', 'dessert', 'drinks'];
                    const randomCategory = categories[index % categories.length];
                    item.setAttribute('data-category', randomCategory);
                }
                
                if (!item.hasAttribute('data-tags')) {
                    const tags = ['spicy', 'healthy', 'popular', 'new', 'recommended'];
                    const randomTags = tags.slice(0, Math.floor(Math.random() * 3) + 1).join(',');
                    item.setAttribute('data-tags', randomTags);
                }
            });
        }

        setupCardInteractions() {
            this.menuItems.forEach(item => {
                this.addCardInteractions(item);
            });
        }

        addCardInteractions(card) {
            // 收藏功能
            this.addFavoriteButton(card);
            
            // 快速查看功能
            this.addQuickViewButton(card);
            
            // 分享功能
            this.addShareButton(card);
        }

        addFavoriteButton(card) {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.setAttribute('data-tooltip', '收藏');
            
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(favoriteBtn, card);
            });
            
            const cardImage = card.querySelector('.card-image');
            if (cardImage) {
                cardImage.appendChild(favoriteBtn);
            }
        }

        toggleFavorite(btn, card) {
            const icon = btn.querySelector('i');
            const isFavorited = icon.classList.contains('fas');
            
            if (isFavorited) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.setAttribute('data-tooltip', '收藏');
                this.showNotification('已取消收藏', 'info');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.setAttribute('data-tooltip', '已收藏');
                this.showNotification('已添加到收藏', 'success');
            }
            
            // 添加动画效果
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }

        addQuickViewButton(card) {
            const quickViewBtn = document.createElement('button');
            quickViewBtn.className = 'quick-view-btn';
            quickViewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            quickViewBtn.setAttribute('data-tooltip', '快速查看');
            
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showQuickView(card);
            });
            
            const cardOverlay = card.querySelector('.card-overlay');
            if (cardOverlay) {
                cardOverlay.appendChild(quickViewBtn);
            }
        }

        showQuickView(card) {
            const modal = this.createQuickViewModal(card);
            document.body.appendChild(modal);
            
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }

        createQuickViewModal(card) {
            const modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            
            const title = card.querySelector('.card-title')?.textContent || '美食详情';
            const description = card.querySelector('.card-description')?.textContent || '暂无描述';
            const price = card.querySelector('.price')?.textContent || '￥0';
            const image = card.querySelector('img')?.src || '';
            
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="${image}" alt="${title}">
                        </div>
                        <div class="modal-info">
                            <h3>${title}</h3>
                            <p>${description}</p>
                            <div class="modal-price">${price}</div>
                            <div class="modal-actions">
                                <button class="btn btn-outline share-btn">
                                    <i class="fas fa-share"></i> 分享
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 关闭模态框事件
            const closeBtn = modal.querySelector('.modal-close');
            const backdrop = modal.querySelector('.modal-backdrop');
            
            [closeBtn, backdrop].forEach(el => {
                el.addEventListener('click', () => {
                    this.closeQuickView(modal);
                });
            });
            
            // ESC键关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeQuickView(modal);
                }
            });
            
            return modal;
        }

        closeQuickView(modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }

        addShareButton(card) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.setAttribute('data-tooltip', '分享');
            
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showShareOptions(card);
            });
            
            const cardImage = card.querySelector('.card-image');
            if (cardImage) {
                cardImage.appendChild(shareBtn);
            }
        }

        showShareOptions(card) {
            const title = card.querySelector('.card-title')?.textContent || '美食分享';
            const shareData = {
                title: title,
                text: `来看看这道美味的${title}!`,
                url: window.location.href
            };
            
            if (navigator.share) {
                navigator.share(shareData).catch(console.error);
            } else {
                this.showShareModal(shareData);
            }
        }

        showShareModal(shareData) {
            const modal = document.createElement('div');
            modal.className = 'share-modal';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <h3>分享到</h3>
                    <div class="share-options">
                        <button class="share-option" data-platform="wechat">
                            <i class="fab fa-weixin"></i>
                            <span>微信</span>
                        </button>
                        <button class="share-option" data-platform="weibo">
                            <i class="fab fa-weibo"></i>
                            <span>微博</span>
                        </button>
                        <button class="share-option" data-platform="qq">
                            <i class="fab fa-qq"></i>
                            <span>QQ</span>
                        </button>
                        <button class="share-option" data-platform="copy">
                            <i class="fas fa-copy"></i>
                            <span>复制链接</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // 关闭事件
            modal.querySelector('.modal-backdrop').addEventListener('click', () => {
                this.closeShareModal(modal);
            });
            
            // 分享选项事件
            modal.querySelectorAll('.share-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const platform = e.currentTarget.getAttribute('data-platform');
                    this.handleShare(platform, shareData);
                    this.closeShareModal(modal);
                });
            });
        }

        handleShare(platform, shareData) {
            switch (platform) {
                case 'copy':
                    navigator.clipboard.writeText(shareData.url).then(() => {
                        this.showNotification('链接已复制到剪贴板', 'success');
                    });
                    break;
                case 'wechat':
                case 'weibo':
                case 'qq':
                    this.showNotification(`正在打开${platform}分享...`, 'info');
                    break;
            }
        }

        closeShareModal(modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }

        setupCardHoverEffect(card) {
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                this.showCardActions(card);
            });
            
            card.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    this.hideCardActions(card);
                }, 200);
            });
        }

        showCardActions(card) {
            const actions = card.querySelectorAll('.favorite-btn, .share-btn');
            actions.forEach((action, index) => {
                setTimeout(() => {
                    action.style.opacity = '1';
                    action.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }

        hideCardActions(card) {
            const actions = card.querySelectorAll('.favorite-btn, .share-btn');
            actions.forEach(action => {
                action.style.opacity = '0';
                action.style.transform = 'translateY(10px)';
            });
        }

        setupLoadMore() {
            this.totalItems = this.menuItems.length;
            this.updateLoadMoreButton(Math.min(this.itemsPerPage, this.totalItems));
        }

        loadMoreItems() {
            this.currentPage++;
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
            
            // 模拟加载延迟
            this.loadMoreBtn.textContent = '加载中...';
            this.loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                for (let i = startIndex; i < endIndex; i++) {
                    if (this.menuItems[i]) {
                        this.showItem(this.menuItems[i], i - startIndex);
                    }
                }
                
                this.loadMoreBtn.textContent = '加载更多';
                this.loadMoreBtn.disabled = false;
                
                this.updateLoadMoreButton(endIndex);
            }, 800);
        }

        updateLoadMoreButton(visibleCount) {
            if (!this.loadMoreBtn) return;
            
            if (visibleCount >= this.totalItems) {
                this.loadMoreBtn.style.display = 'none';
            } else {
                this.loadMoreBtn.style.display = 'inline-block';
            }
        }

        initializeFilters() {
            // 设置默认激活的筛选器
            const defaultFilter = this.filterButtons[0];
            if (defaultFilter) {
                defaultFilter.classList.add('active');
            }
        }

        showNotification(message, type = 'info') {
            // 使用主文件中的通知功能
            if (window.GourmetWebsite && window.GourmetWebsite.showNotification) {
                window.GourmetWebsite.showNotification(message, type);
            } else {
                console.log(`${type}: ${message}`);
            }
        }
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        new MenuManager();
    });

    // 暴露给全局作用域
    window.MenuManager = MenuManager;

})();