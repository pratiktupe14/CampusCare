/**
 * CampusCare Interactive Lightbox Viewer
 * Production-ready, 60fps transform-based image viewer with FLIP animation from thumbnail position.
 * Respects prefers-reduced-motion and full keyboard accessibility.
 */

class CampusCareLightbox {
    constructor() {
        this.lightboxEl = null;
        this.imgEl = null;
        this.captionEl = null;
        this.counterEl = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.closeBtn = null;
        this.backdropEl = null;
        
        this.items = [];
        this.currentIndex = 0;
        this.activeTrigger = null;
        this.isOpen = false;
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Create modal DOM structure if not present
        if (document.getElementById('campuscare-lightbox')) {
            this.lightboxEl = document.getElementById('campuscare-lightbox');
            return;
        }

        const template = `
        <div id="campuscare-lightbox" class="fixed inset-0 z-[9999] hidden items-center justify-center select-none" role="dialog" aria-modal="true" aria-label="Image Preview">
            <!-- Dark Backdrop Overlay -->
            <div id="lightbox-backdrop" class="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 transition-opacity duration-200 ease-out"></div>
            
            <!-- Modal Content Frame -->
            <div class="relative z-10 max-w-4xl max-h-[90vh] w-full p-4 flex flex-col items-center justify-center">
                <!-- Top Controls -->
                <div class="w-full flex justify-between items-center text-white/90 pb-2 px-1">
                    <span id="lightbox-counter" class="text-xs font-mono tracking-widest text-white/70"></span>
                    <button id="lightbox-close-btn" class="w-8 h-8 rounded-sm bg-black/40 hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Close Lightbox (Esc)">
                        <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <!-- Image Container -->
                <div class="relative flex items-center justify-center w-full overflow-hidden bg-black/40 border border-white/10 rounded-sm shadow-2xl">
                    <img id="lightbox-image" class="max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-md transition-transform duration-300 ease-out" alt="Enlarged complaint attachment" src="" />
                    
                    <!-- Prev / Next Navigation Arrows -->
                    <button id="lightbox-prev-btn" class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Previous Image (Left Arrow)">
                        <span class="material-symbols-outlined text-[24px]">chevron_left</span>
                    </button>
                    <button id="lightbox-next-btn" class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Next Image (Right Arrow)">
                        <span class="material-symbols-outlined text-[24px]">chevron_right</span>
                    </button>
                </div>

                <!-- Bottom Caption Bar -->
                <div class="w-full mt-2.5 px-3 py-2 bg-black/60 border border-white/10 rounded-sm text-left backdrop-blur-md">
                    <p id="lightbox-caption" class="text-xs text-white/90 font-medium"></p>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', template);

        this.lightboxEl = document.getElementById('campuscare-lightbox');
        this.backdropEl = document.getElementById('lightbox-backdrop');
        this.imgEl = document.getElementById('lightbox-image');
        this.captionEl = document.getElementById('lightbox-caption');
        this.counterEl = document.getElementById('lightbox-counter');
        this.closeBtn = document.getElementById('lightbox-close-btn');
        this.prevBtn = document.getElementById('lightbox-prev-btn');
        this.nextBtn = document.getElementById('lightbox-next-btn');

        this.attachEventListeners();
        this.bindTriggers();
    }

    bindTriggers() {
        const triggers = document.querySelectorAll('[data-lightbox-src]');
        triggers.forEach((btn, index) => {
            btn.removeEventListener('click', btn._lightboxHandler);
            btn._lightboxHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.collectItems(btn);
                this.open(btn);
            };
            btn.addEventListener('click', btn._lightboxHandler);
        });
    }

    collectItems(activeBtn) {
        const group = activeBtn.getAttribute('data-lightbox-group') || 'default';
        const allInGroup = Array.from(document.querySelectorAll(`[data-lightbox-src][data-lightbox-group="${group}"]`));
        
        if (allInGroup.length === 0) {
            allInGroup.push(activeBtn);
        }

        this.items = allInGroup.map(el => ({
            src: el.getAttribute('data-lightbox-src'),
            caption: el.getAttribute('data-lightbox-caption') || el.getAttribute('data-alt') || 'Complaint Photo Attachment',
            element: el
        }));

        this.currentIndex = Math.max(0, this.items.findIndex(item => item.element === activeBtn));
    }

    attachEventListeners() {
        // Close on backdrop or close button
        this.closeBtn.addEventListener('click', () => this.close());
        this.backdropEl.addEventListener('click', () => this.close());

        // Prev / Next
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });

        // Keyboard navigation & trap
        window.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            } else if (e.key === 'Tab') {
                // Trap focus
                const focusable = [this.closeBtn, this.prevBtn, this.nextBtn].filter(el => !el.disabled);
                if (focusable.length === 0) return;
                
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    open(triggerElement) {
        if (this.isAnimating) return;
        this.isOpen = true;
        this.isAnimating = true;
        this.activeTrigger = triggerElement;

        const currentItem = this.items[this.currentIndex];
        if (!currentItem || !currentItem.src) {
            this.isOpen = false;
            this.isAnimating = false;
            return;
        }

        this.updateView();

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.lightboxEl.classList.remove('hidden');
        this.lightboxEl.classList.add('flex');

        // Lock background scroll
        document.body.style.overflow = 'hidden';

        if (prefersReduced) {
            this.backdropEl.style.opacity = '1';
            this.imgEl.style.transform = 'none';
            this.imgEl.style.opacity = '1';
            this.closeBtn.focus();
            this.isAnimating = false;
            return;
        }

        // FLIP animation from thumbnail's bounding rect
        const triggerRect = triggerElement.getBoundingClientRect();
        const startX = triggerRect.left + triggerRect.width / 2;
        const startY = triggerRect.top + triggerRect.height / 2;
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        const deltaX = startX - viewportCenterX;
        const deltaY = startY - viewportCenterY;
        const scaleX = Math.max(0.1, triggerRect.width / 400);

        // Initial state
        this.backdropEl.style.opacity = '0';
        this.imgEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX})`;
        this.imgEl.style.opacity = '0.5';

        requestAnimationFrame(() => {
            // Animate overlay
            this.backdropEl.style.opacity = '1';

            // Animate image into place
            this.imgEl.style.transition = 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease-out';
            this.imgEl.style.transform = 'translate(0, 0) scale(1)';
            this.imgEl.style.opacity = '1';

            setTimeout(() => {
                this.isAnimating = false;
                this.closeBtn.focus();
            }, 300);
        });
    }

    close() {
        if (this.isAnimating || !this.isOpen) return;
        this.isAnimating = true;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            this.lightboxEl.classList.add('hidden');
            this.lightboxEl.classList.remove('flex');
            document.body.style.overflow = '';
            this.isOpen = false;
            this.isAnimating = false;
            if (this.activeTrigger) this.activeTrigger.focus();
            return;
        }

        // Animate back to trigger rect
        let deltaX = 0, deltaY = 0, scaleX = 0.2;
        if (this.activeTrigger) {
            const triggerRect = this.activeTrigger.getBoundingClientRect();
            const startX = triggerRect.left + triggerRect.width / 2;
            const startY = triggerRect.top + triggerRect.height / 2;
            deltaX = startX - (window.innerWidth / 2);
            deltaY = startY - (window.innerHeight / 2);
            scaleX = Math.max(0.1, triggerRect.width / 400);
        }

        this.backdropEl.style.opacity = '0';
        this.imgEl.style.transition = 'transform 220ms ease-in, opacity 180ms ease-in';
        this.imgEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX})`;
        this.imgEl.style.opacity = '0';

        setTimeout(() => {
            this.lightboxEl.classList.add('hidden');
            this.lightboxEl.classList.remove('flex');
            document.body.style.overflow = '';
            this.isOpen = false;
            this.isAnimating = false;
            if (this.activeTrigger) this.activeTrigger.focus();
        }, 230);
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.activeTrigger = this.items[this.currentIndex].element;
            this.crossfadeImage();
        }
    }

    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.activeTrigger = this.items[this.currentIndex].element;
            this.crossfadeImage();
        }
    }

    crossfadeImage() {
        this.imgEl.style.opacity = '0.3';
        setTimeout(() => {
            this.updateView();
            this.imgEl.style.opacity = '1';
        }, 120);
    }

    updateView() {
        const item = this.items[this.currentIndex];
        if (!item) return;

        this.imgEl.src = item.src;
        this.captionEl.textContent = item.caption;
        this.counterEl.textContent = `${this.currentIndex + 1} / ${this.items.length}`;

        this.prevBtn.disabled = (this.currentIndex === 0);
        this.nextBtn.disabled = (this.currentIndex === this.items.length - 1);
        
        if (this.items.length <= 1) {
            this.prevBtn.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
        } else {
            this.prevBtn.classList.remove('hidden');
            this.nextBtn.classList.remove('hidden');
        }
    }
}

// Instantiate and export
window.CampusCareLightboxInstance = new CampusCareLightbox();
export default CampusCareLightbox;
