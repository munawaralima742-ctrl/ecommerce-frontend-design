/* ============================================
   SHOPZONE - MAIN JAVASCRIPT
   File: js/main.js
   Description: Global JS — navbar scroll effect,
                search bar, mobile menu, back to top,
                cart count, toast notifications,
                countdown timer, animations
============================================ */

/* ===== WAIT FOR DOM ===== */
document.addEventListener('DOMContentLoaded', function () {

    /* ============================================
       1. NAVBAR SCROLL EFFECT
    ============================================ */
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ============================================
       2. SEARCH BAR — LIVE SEARCH
    ============================================ */
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = document.querySelector('.search-results');

    // Sample product data for search
    const products = [
        { name: 'Nike Air Max 2024',      price: '$89.99',   emoji: '👟', category: 'Footwear'    },
        { name: 'iPhone 15 Pro Max',       price: '$999.99',  emoji: '📱', category: 'Electronics' },
        { name: 'MacBook Pro M3',          price: '$1299.99', emoji: '💻', category: 'Electronics' },
        { name: 'Summer Floral Dress',     price: '$45.99',   emoji: '👗', category: 'Fashion'     },
        { name: 'PlayStation 5 Console',   price: '$499.99',  emoji: '🎮', category: 'Gaming'      },
        { name: 'Sony WH-1000XM5',         price: '$279.99',  emoji: '🎧', category: 'Electronics' },
        { name: 'Apple Watch Series 9',    price: '$399.99',  emoji: '⌚', category: 'Electronics' },
        { name: 'Leather Handbag',         price: '$79.99',   emoji: '👜', category: 'Fashion'     },
        { name: 'Gym Dumbbell Set',        price: '$149.99',  emoji: '🏋️', category: 'Sports'      },
        { name: 'Luxury Makeup Kit',       price: '$59.99',   emoji: '💄', category: 'Beauty'      },
        { name: 'Modern Sofa Set',         price: '$899.99',  emoji: '🛋️', category: 'Home'        },
        { name: 'Bestseller Book Bundle',  price: '$29.99',   emoji: '📚', category: 'Books'       },
    ];

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();

            if (!searchResults) return;

            if (query.length === 0) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }

            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );

            searchResults.innerHTML = '';

            if (filtered.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-no-result">
                        😕 No results found for "<strong>${query}</strong>"
                    </div>`;
            } else {
                filtered.slice(0, 5).forEach(product => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <div class="result-icon">${product.emoji}</div>
                        <div class="result-info">
                            <div class="result-name">${product.name}</div>
                            <div class="result-price">${product.price}</div>
                        </div>
                    `;
                    item.addEventListener('click', function () {
                        window.location.href = 'product-detail.html';
                    });
                    searchResults.appendChild(item);
                });
            }

            searchResults.classList.add('active');
        });

        // Close search results on outside click
        document.addEventListener('click', function (e) {
            if (searchResults && !searchInput.closest('.search-bar').contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Search on Enter key
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && this.value.trim()) {
                window.location.href = 'products.html';
                if (searchResults) searchResults.classList.remove('active');
            }
        });
    }


    /* ============================================
       3. CART COUNT — GLOBAL
    ============================================ */
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 3;

    function updateCartBadge() {
        const badges = document.querySelectorAll('.icon-badge, .badge, #cartCount');
        badges.forEach(badge => {
            if (badge.closest('.nav-icon-btn') || badge.id === 'cartCount') {
                badge.textContent = cartCount;
            }
        });
    }

    updateCartBadge();

    // Global add to cart handler
    window.addToCart = function (qty = 1) {
        cartCount += qty;
        localStorage.setItem('cartCount', cartCount);
        updateCartBadge();
        showToast('✅ Item added to cart!', 'success');
    };


    /* ============================================
       4. TOAST NOTIFICATION
    ============================================ */
    window.showToast = function (message, type = 'success') {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 3000);
    };


    /* ============================================
       5. BACK TO TOP BUTTON
    ============================================ */
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ============================================
       6. ADD TO CART BUTTONS — ALL PAGES
    ============================================ */
    const cartButtons = document.querySelectorAll('.btn-cart, .btn-add-to-cart, .btn-add-cart');

    cartButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#27ae60';
            this.style.borderColor = '#27ae60';
            this.disabled = true;

            addToCart(1);

            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.borderColor = '';
                this.disabled = false;
            }, 1800);
        });
    });


    /* ============================================
       7. WISHLIST BUTTONS — ALL PAGES
    ============================================ */
    const wishlistBtns = document.querySelectorAll(
        '.wishlist-btn, .product-wishlist, .img-wishlist-btn'
    );

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            this.style.color = isActive ? '#e94560' : '';
            showToast(
                isActive ? '❤️ Added to wishlist!' : '💔 Removed from wishlist',
                'success'
            );
        });
    });


    /* ============================================
       8. COUNTDOWN TIMER
    ============================================ */
    function updateCountdown() {
        const hoursEl   = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');

        if (!hoursEl) return;

        // Set end time 8 hours from now (stored in session)
        if (!sessionStorage.getItem('dealEndTime')) {
            const endTime = new Date().getTime() + (8 * 60 * 60 * 1000);
            sessionStorage.setItem('dealEndTime', endTime);
        }

        const endTime = parseInt(sessionStorage.getItem('dealEndTime'));

        function tick() {
            const now       = new Date().getTime();
            const remaining = endTime - now;

            if (remaining <= 0) {
                hoursEl.textContent   = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const hours   = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            hoursEl.textContent   = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        tick();
        setInterval(tick, 1000);
    }

    updateCountdown();


    /* ============================================
       9. PRODUCT TABS (HOME & DETAIL PAGE)
    ============================================ */
    const tabBtns = document.querySelectorAll('.product-tab');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Tab content switching can be extended here
        });
    });

    // Detail page tabs
    const detailTabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes      = document.querySelectorAll('.tab-pane, .tab-content');

    detailTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const target = this.dataset.tab;

            detailTabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            this.classList.add('active');

            const targetPane = document.getElementById(target);
            if (targetPane) targetPane.classList.add('active');
        });
    });


    /* ============================================
       10. NEWSLETTER FORM
    ============================================ */
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        const subscribeBtn   = newsletterForm.querySelector('button');
        const emailInput     = newsletterForm.querySelector('input[type="email"]');

        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', function () {
                const email = emailInput ? emailInput.value.trim() : '';

                if (!email || !email.includes('@')) {
                    showToast('⚠️ Please enter a valid email!', 'error');
                    return;
                }

                this.textContent = 'Subscribed ✓';
                this.style.background = '#27ae60';
                if (emailInput) emailInput.value = '';

                showToast('🎉 Successfully subscribed!', 'success');

                setTimeout(() => {
                    this.textContent = 'Subscribe';
                    this.style.background = '';
                }, 3000);
            });
        }
    }


    /* ============================================
       11. SCROLL REVEAL ANIMATIONS
    ============================================ */
    const revealElements = document.querySelectorAll(
        '.product-card, .category-card, .stat-item, .banner-card, .testimonial-card, .deal-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(25px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`;
        observer.observe(el);
    });


    /* ============================================
       12. FILTER CARD TOGGLE (PRODUCTS PAGE)
    ============================================ */
    const filterToggles = document.querySelectorAll('.filter-toggle');

    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const card    = this.closest('.filter-card');
            const content = card.querySelector(
                '.category-list, .price-range-filter, .rating-list, .color-grid, .size-grid, .brand-list'
            );

            if (content) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
                this.classList.toggle('collapsed', !isHidden);
            }
        });
    });


    /* ============================================
       13. COLOR FILTER DOTS
    ============================================ */
    const colorDots = document.querySelectorAll('.color-dot, .color-opt');

    colorDots.forEach(dot => {
        dot.addEventListener('click', function () {
            // For single-select groups
            const parent = this.closest('.color-grid, .color-options, .color-selector');
            if (parent) {
                parent.querySelectorAll('.color-dot, .color-opt').forEach(d => {
                    d.classList.remove('active');
                });
            }
            this.classList.toggle('active');
        });
    });


    /* ============================================
       14. SIZE FILTER BUTTONS
    ============================================ */
    const sizeFilterBtns = document.querySelectorAll('.size-filter-btn');

    sizeFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const parent = this.closest('.size-grid');
            if (parent) {
                parent.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
            }
            this.classList.toggle('active');
        });
    });


    /* ============================================
       15. ACTIVE FILTER TAGS — REMOVE
    ============================================ */
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('tag-remove') || e.target.closest('.tag-remove')) {
            const tag = e.target.closest('.filter-tag');
            if (tag) {
                tag.style.transform = 'scale(0)';
                tag.style.opacity   = '0';
                tag.style.transition = 'all 0.2s ease';
                setTimeout(() => tag.remove(), 200);
            }
        }
    });


    /* ============================================
       16. CLEAR ALL FILTERS
    ============================================ */
    const clearBtn = document.querySelector('.btn-clear-filters, .btn-clear');

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            // Uncheck all checkboxes and radios
            document.querySelectorAll('.filter-card input[type="checkbox"]')
                .forEach(cb => cb.checked = false);
            document.querySelectorAll('.filter-card input[type="radio"]')
                .forEach(r  => r.checked  = false);

            // Remove active from color dots and size buttons
            document.querySelectorAll('.color-dot, .size-filter-btn')
                .forEach(el => el.classList.remove('active'));

            // Remove all active filter tags
            document.querySelectorAll('.filter-tag').forEach(tag => tag.remove());

            showToast('🗑️ All filters cleared!', 'success');
        });
    }


    /* ============================================
       17. SORT DROPDOWN
    ============================================ */
    const sortSelect = document.querySelector('.sort-dropdown, .sort-select, #sortSelect');

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            showToast(`📊 Sorted by: ${this.options[this.selectedIndex].text}`, 'success');
        });
    }


    /* ============================================
       18. VIEW TOGGLE (GRID / LIST)
    ============================================ */
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productsGrid = document.getElementById('productsGrid');

    if (gridViewBtn && listViewBtn && productsGrid) {
        gridViewBtn.addEventListener('click', function () {
            productsGrid.classList.remove('list-view');
            productsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function () {
            productsGrid.classList.add('list-view');
            productsGrid.style.gridTemplateColumns = '1fr';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }


    /* ============================================
       19. PAGINATION
    ============================================ */
    const pageBtns = document.querySelectorAll('.page-btn:not(.arrow)');

    pageBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            pageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });


    /* ============================================
       20. LOAD MORE BUTTON
    ============================================ */
    const loadMoreBtn = document.querySelector('.btn-load-more');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const originalHTML = this.innerHTML;
            this.innerHTML     = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.classList.add('loading');
            this.disabled      = true;

            setTimeout(() => {
                this.innerHTML  = '<i class="fas fa-check"></i> All Products Loaded';
                this.style.borderColor = '#27ae60';
                this.style.color       = '#27ae60';
                this.disabled          = false;
            }, 1800);
        });
    }


    /* ============================================
       21. CATEGORY CARDS — HOVER EFFECT
    ============================================ */
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.35s ease';
        });
    });


    /* ============================================
       22. ACTIVE NAV LINK HIGHLIGHT
    ============================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks    = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });


    /* ============================================
       23. PRICE RANGE SLIDER LIVE UPDATE
    ============================================ */
    const priceSlider  = document.querySelector('.price-slider, .range-slider');
    const maxPriceInput = document.querySelector('.price-inputs input:last-child');

    if (priceSlider && maxPriceInput) {
        priceSlider.addEventListener('input', function () {
            maxPriceInput.value = this.value;
        });
    }


    /* ============================================
       24. SMOOTH SCROLL FOR ANCHOR LINKS
    ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

}); // END DOMContentLoaded
