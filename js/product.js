/* ============================================
   SHOPZONE - PRODUCT PAGE JAVASCRIPT
   File: js/product.js
   Description: Product detail page JS —
                image gallery, size selector,
                color selector, quantity,
                add to cart, reviews, tabs,
                related products, sticky bar
============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ============================================
       1. IMAGE GALLERY — THUMBNAIL SWITCHER
    ============================================ */
    const mainImage    = document.getElementById('mainImage');
    const mainEmoji    = document.getElementById('mainEmoji');
    const thumbnails   = document.querySelectorAll('.thumb, .thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function () {
            // Remove active from all thumbs
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update main image emoji
            if (mainEmoji) {
                mainEmoji.style.opacity   = '0';
                mainEmoji.style.transform = 'scale(0.85)';
                mainEmoji.style.transition = 'all 0.2s ease';

                setTimeout(() => {
                    mainEmoji.textContent     = this.textContent.trim();
                    mainEmoji.style.opacity   = '1';
                    mainEmoji.style.transform = 'scale(1)';
                }, 180);
            }
        });
    });


    /* ============================================
       2. SIZE SELECTOR
    ============================================ */
    const sizeButtons    = document.querySelectorAll('.size-btn, .size-opt');
    const selectedSizeEl = document.getElementById('selectedSize');

    sizeButtons.forEach(btn => {
        // Skip disabled/unavailable buttons
        if (btn.classList.contains('disabled') || btn.classList.contains('unavailable')) return;

        btn.addEventListener('click', function () {
            sizeButtons.forEach(b => {
                if (!b.classList.contains('disabled') && !b.classList.contains('unavailable')) {
                    b.classList.remove('active');
                }
            });
            this.classList.add('active');

            // Update selected size label
            if (selectedSizeEl) {
                selectedSizeEl.textContent = this.textContent.trim();
            }
        });
    });


    /* ============================================
       3. COLOR SELECTOR
    ============================================ */
    const colorButtons     = document.querySelectorAll('.color-btn, .color-opt');
    const selectedColorEl  = document.getElementById('selectedColor');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update selected color label
            if (selectedColorEl) {
                const colorName = this.getAttribute('title') ||
                                  this.dataset.color         ||
                                  'Selected';
                selectedColorEl.textContent = colorName;
            }
        });
    });


    /* ============================================
       4. QUANTITY SELECTOR
    ============================================ */
    const qtyInput   = document.getElementById('qtyInput');
    const qtyBtns    = document.querySelectorAll('.qty-btn');

    if (qtyInput) {
        qtyBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                let current = parseInt(qtyInput.value) || 1;
                const isPlus = this.textContent.trim() === '+' ||
                               this.dataset.action === 'increase';

                if (isPlus) {
                    if (current < 10) current++;
                } else {
                    if (current > 1) current--;
                }

                qtyInput.value = current;

                // Animate input
                qtyInput.style.transform  = 'scale(1.15)';
                qtyInput.style.color      = '#e94560';
                qtyInput.style.transition = 'all 0.15s ease';
                setTimeout(() => {
                    qtyInput.style.transform = 'scale(1)';
                    qtyInput.style.color     = '#1a1a2e';
                }, 150);
            });
        });

        // Manual input validation
        qtyInput.addEventListener('change', function () {
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1)  val = 1;
            if (val > 10)               val = 10;
            this.value = val;
        });
    }


    /* ============================================
       5. ADD TO CART — PRODUCT DETAIL
    ============================================ */
    const addCartBtn  = document.getElementById('addCartBtn');
    const cartCountEl = document.getElementById('cartCount');

    if (addCartBtn) {
        addCartBtn.addEventListener('click', function () {
            // Validate size selection
            const activeSize = document.querySelector('.size-btn.active, .size-opt.active');
            if (sizeButtons.length > 0 && !activeSize) {
                showProductToast('⚠️ Please select a size first!', 'error');
                // Shake the size selector
                const sizeSection = document.querySelector('.size-options, .size-selector');
                if (sizeSection) {
                    sizeSection.style.animation = 'shake 0.4s ease';
                    setTimeout(() => sizeSection.style.animation = '', 400);
                }
                return;
            }

            const qty = parseInt(qtyInput ? qtyInput.value : 1);

            // Button animation
            this.innerHTML    = '<i class="fas fa-check"></i> Added to Cart!';
            this.classList.add('added');
            this.style.background    = '#27ae60';
            this.style.borderColor   = '#27ae60';
            this.disabled            = true;

            // Update cart count
            let count = parseInt(localStorage.getItem('cartCount')) || 3;
            count += qty;
            localStorage.setItem('cartCount', count);

            const badges = document.querySelectorAll('.icon-badge, #cartCount');
            badges.forEach(b => b.textContent = count);

            // Show toast
            showProductToast(`🛒 ${qty} item${qty > 1 ? 's' : ''} added to cart!`, 'success');

            // Reset button after delay
            setTimeout(() => {
                this.innerHTML  = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.classList.remove('added');
                this.style.background  = '';
                this.style.borderColor = '';
                this.disabled          = false;
            }, 2200);
        });
    }


    /* ============================================
       6. BUY NOW BUTTON
    ============================================ */
    const buyNowBtn = document.querySelector('.btn-buy-now');

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function () {
            const activeSize = document.querySelector('.size-btn.active, .size-opt.active');
            if (sizeButtons.length > 0 && !activeSize) {
                showProductToast('⚠️ Please select a size first!', 'error');
                return;
            }

            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled  = true;

            setTimeout(() => {
                showProductToast('🎉 Redirecting to checkout...', 'success');
                this.innerHTML = '<i class="fas fa-bolt"></i> Buy Now';
                this.disabled  = false;
            }, 1500);
        });
    }


    /* ============================================
       7. WISHLIST BUTTON — PRODUCT DETAIL
    ============================================ */
    const wishlistBtn = document.getElementById('wishlistBtn');

    if (wishlistBtn) {
        let isWishlisted = false;

        wishlistBtn.addEventListener('click', function () {
            isWishlisted = !isWishlisted;

            if (isWishlisted) {
                this.style.color     = '#e94560';
                this.style.transform = 'scale(1.25)';
                showProductToast('❤️ Added to wishlist!', 'success');
            } else {
                this.style.color     = '#ccc';
                this.style.transform = 'scale(1)';
                showProductToast('💔 Removed from wishlist', 'success');
            }

            this.style.transition = 'all 0.25s ease';
        });
    }


    /* ============================================
       8. PRODUCT DETAIL TABS
    ============================================ */
    const tabButtons  = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content, .tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.dataset.tab ||
                          this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');

            if (tabId) {
                const target = document.getElementById(tabId);
                if (target) {
                    target.classList.add('active');
                    target.style.animation = 'fadeIn 0.3s ease';
                }
            }
        });
    });


    /* ============================================
       9. STAR RATING PICKER (REVIEW FORM)
    ============================================ */
    const starPicker   = document.getElementById('starRating');
    let selectedRating = 0;

    if (starPicker) {
        const stars = starPicker.querySelectorAll('i');

        stars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseenter', function () {
                stars.forEach((s, i) => {
                    s.className = i <= index ? 'fas fa-star' : 'far fa-star';
                    s.style.color = i <= index ? '#ffc107' : '#ddd';
                });
            });

            // Mouse leave — revert to selected
            star.addEventListener('mouseleave', function () {
                stars.forEach((s, i) => {
                    s.className = i < selectedRating ? 'fas fa-star' : 'far fa-star';
                    s.style.color = i < selectedRating ? '#ffc107' : '#ddd';
                });
            });

            // Click to select rating
            star.addEventListener('click', function () {
                selectedRating = index + 1;
                stars.forEach((s, i) => {
                    s.classList.toggle('selected', i < selectedRating);
                    s.style.color = i < selectedRating ? '#ffc107' : '#ddd';
                });
            });
        });
    }

    // Global setRating function (used inline onclick)
    window.setRating = function (n) {
        selectedRating = n;
        if (starPicker) {
            const stars = starPicker.querySelectorAll('i');
            stars.forEach((s, i) => {
                s.className   = i < n ? 'fas fa-star selected' : 'far fa-star';
                s.style.color = i < n ? '#ffc107' : '#ddd';
            });
        }
    };


    /* ============================================
       10. SUBMIT REVIEW FORM
    ============================================ */
    const submitReviewBtn = document.querySelector('.btn-submit-review');

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', function () {
            const nameInput   = document.querySelector('.review-form-input, #reviewName');
            const textArea    = document.querySelector('.review-form-textarea, #reviewText');
            const name        = nameInput  ? nameInput.value.trim()  : '';
            const reviewText  = textArea   ? textArea.value.trim()   : '';

            // Validation
            if (selectedRating === 0) {
                showProductToast('⭐ Please select a star rating!', 'error');
                return;
            }

            if (!name) {
                showProductToast('📝 Please enter your name!', 'error');
                if (nameInput) nameInput.focus();
                return;
            }

            if (reviewText.length < 10) {
                showProductToast('📝 Please write a longer review!', 'error');
                if (textArea) textArea.focus();
                return;
            }

            // Success state
            this.innerHTML = '<i class="fas fa-check"></i> Review Submitted!';
            this.classList.add('submitted');
            this.style.background = '#27ae60';
            this.disabled = true;

            showProductToast('🎉 Thank you for your review!', 'success');

            // Reset form
            setTimeout(() => {
                if (nameInput)  nameInput.value  = '';
                if (textArea)   textArea.value   = '';
                selectedRating = 0;

                if (starPicker) {
                    starPicker.querySelectorAll('i').forEach(s => {
                        s.className   = 'far fa-star';
                        s.style.color = '#ddd';
                    });
                }

                this.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
                this.classList.remove('submitted');
                this.style.background = '';
                this.disabled = false;
            }, 3000);
        });
    }


    /* ============================================
       11. RELATED PRODUCTS — CART BUTTONS
    ============================================ */
    const relatedCartBtns = document.querySelectorAll(
        '.related-grid .btn-cart, .related-grid .btn-cart-sm, .related-card .btn-cart-sm'
    );

    relatedCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const original = this.textContent;
            this.textContent      = 'Added ✓';
            this.style.background = '#27ae60';
            this.disabled         = true;

            // Update cart count
            let count = parseInt(localStorage.getItem('cartCount')) || 3;
            count++;
            localStorage.setItem('cartCount', count);
            document.querySelectorAll('.icon-badge, #cartCount')
                .forEach(b => b.textContent = count);

            showProductToast('🛒 Item added to cart!', 'success');

            setTimeout(() => {
                this.textContent      = original;
                this.style.background = '';
                this.disabled         = false;
            }, 1800);
        });
    });


    /* ============================================
       12. STICKY ADD TO CART BAR
          (Appears when main add-to-cart scrolls out)
    ============================================ */
    const stickyBar   = document.getElementById('stickyBar');
    const mainAddBtn  = document.getElementById('addCartBtn');

    if (stickyBar && mainAddBtn) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyBar.style.transform  = 'translateY(0)';
                    stickyBar.style.opacity    = '1';
                    stickyBar.style.visibility = 'visible';
                } else {
                    stickyBar.style.transform  = 'translateY(100%)';
                    stickyBar.style.opacity    = '0';
                    stickyBar.style.visibility = 'hidden';
                }
            });
        }, { threshold: 0 });

        observer.observe(mainAddBtn);
    }


    /* ============================================
       13. PRODUCT IMAGE ZOOM ON HOVER
    ============================================ */
    const mainImageWrap = document.querySelector('.main-image, .main-image-wrap');

    if (mainImageWrap) {
        mainImageWrap.addEventListener('mousemove', function (e) {
            const rect    = this.getBoundingClientRect();
            const x       = ((e.clientX - rect.left) / rect.width)  * 100;
            const y       = ((e.clientY - rect.top)  / rect.height) * 100;
            const emoji   = this.querySelector('#mainEmoji');

            if (emoji) {
                emoji.style.transformOrigin = `${x}% ${y}%`;
            }
        });
    }


    /* ============================================
       14. SHARE BUTTONS
    ============================================ */
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const platform  = this.classList[1]; // facebook, twitter, etc.
            const pageUrl   = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            let shareUrl    = '';

            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?url=${pageUrl}&title=${pageTitle}`;
                    break;
                default:
                    showProductToast('🔗 Link copied!', 'success');
                    return;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });


    /* ============================================
       15. PRODUCT CARD HOVER (RELATED)
    ============================================ */
    const relatedCards = document.querySelectorAll('.related-card, .product-card');

    relatedCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });


    /* ============================================
       16. TOAST NOTIFICATION (LOCAL)
    ============================================ */
    function showProductToast(message, type = 'success') {
        // Use global if available
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }

        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1a1a2e;
            color: #fff;
            padding: 14px 24px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            border-left: 4px solid ${type === 'success' ? '#27ae60' : '#e94560'};
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 3000);
    }


    /* ============================================
       17. KEYBOARD SHORTCUTS
    ============================================ */
    document.addEventListener('keydown', function (e) {
        // Press + or = to increase quantity
        if ((e.key === '+' || e.key === '=') && qtyInput) {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 10) qtyInput.value = val + 1;
        }

        // Press - to decrease quantity
        if (e.key === '-' && qtyInput) {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        }

        // Press W to toggle wishlist
        if (e.key === 'w' || e.key === 'W') {
            if (wishlistBtn && document.activeElement.tagName !== 'INPUT' &&
                document.activeElement.tagName !== 'TEXTAREA') {
                wishlistBtn.click();
            }
        }
    });


    /* ============================================
       18. SHAKE ANIMATION (CSS injected)
    ============================================ */
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%       { transform: translateX(-8px); }
            40%       { transform: translateX(8px); }
            60%       { transform: translateX(-5px); }
            80%       { transform: translateX(5px); }
        }
        @keyframes slideIn {
            from { transform: translateX(80px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(shakeStyle);


}); // END DOMContentLoaded
