/**
 * Apple Interiors - NRI Concierge Modal
 * Features an automatic cross-fade slideshow of top portfolio projects & verified NRI reviews.
 */

(function () {
    try {
        // Clear any previous dismissal key so it opens freely for all visitors
        localStorage.removeItem('apple_nri_popup_dismissed_until');
    } catch (e) {}

    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('nri_preview') === '1' || urlParams.has('test_country');

    const SLIDES = [
        {
            image: '/images/portfolio/living-room/1.webp',
            quote: 'Got our entire 3BHK flat in Gachibowli designed & delivered while we were in California. Complete peace of mind!',
            author: 'Verified NRI Homeowner, USA',
            project: 'Luxury Living Room • Gachibowli'
        },
        {
            image: '/images/portfolio/kitchen/J1.webp',
            quote: 'Managed our modular kitchen and turnkey interiors directly over WhatsApp from Dubai. Top notch craftsmanship!',
            author: 'Verified NRI Homeowner, UAE',
            project: 'Modular Kitchen • Kokapet'
        },
        {
            image: '/images/portfolio/bedroom/3.webp',
            quote: 'Handover was completed spotless right before our vacation from London. 100% transparent and on-time.',
            author: 'Verified NRI Homeowner, UK',
            project: 'Master Bedroom Suite • Financial District'
        }
    ];


    function formatCountryName(rawCountry) {
        if (!rawCountry || rawCountry === 'UNKNOWN' || rawCountry === 'LOCAL' || rawCountry === 'IN') {
            return 'Abroad';
        }

        const trimmed = String(rawCountry).trim();
        if (trimmed.length > 2 && !/^[A-Za-z]{2}$/.test(trimmed)) {
            return trimmed;
        }

        const code = trimmed.toUpperCase();
        const customNames = {
            'US': 'the USA',
            'USA': 'the USA',
            'GB': 'the UK',
            'UK': 'the UK',
            'AE': 'the UAE',
            'UAE': 'the UAE',
            'SG': 'Singapore',
            'CA': 'Canada',
            'AU': 'Australia',
            'NZ': 'New Zealand',
            'QA': 'Qatar',
            'SA': 'Saudi Arabia',
            'KW': 'Kuwait',
            'OM': 'Oman',
            'BH': 'Bahrain',
            'MY': 'Malaysia',
            'DE': 'Germany',
            'FR': 'France',
            'IE': 'Ireland',
            'NL': 'the Netherlands',
            'CH': 'Switzerland',
            'SE': 'Sweden',
            'NO': 'Norway',
            'DK': 'Denmark',
            'IT': 'Italy',
            'JP': 'Japan',
            'KR': 'South Korea',
            'HK': 'Hong Kong',
            'ZA': 'South Africa'
        };

        if (customNames[code]) {
            return customNames[code];
        }

        try {
            if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
                const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
                const name = regionNames.of(code);
                if (name) return name;
            }
        } catch (e) {
            // Silently fallback
        }

        return code.length === 2 ? 'Abroad' : code;
    }

    function createModalHTML(countryName) {
        const countryLabel = formatCountryName(countryName);
        const headingPlace = (countryLabel === 'Abroad') ? 'the USA or Abroad' : countryLabel;
        const waMessage = encodeURIComponent(
            `Hi Apple Interiors, I'm an NRI based in ${countryLabel} looking for complete home interior design for my property in Hyderabad.`
        );

        const slidesHTML = SLIDES.map((slide, idx) => `
            <div class="nri-slide ${idx === 0 ? 'nri-slide-active' : ''}" data-slide-index="${idx}">
                <img src="${slide.image}" alt="${slide.project}" class="nri-img-cover" />
                <div class="nri-quote-overlay">
                    <div class="nri-slide-tag">${slide.project}</div>
                    <div class="nri-stars">★★★★★</div>
                    <p class="nri-quote-body">"${slide.quote}"</p>
                    <span class="nri-quote-user">— ${slide.author}</span>
                </div>
            </div>
        `).join('');

        const dotsHTML = SLIDES.map((_, idx) => `
            <span class="nri-dot-indicator ${idx === 0 ? 'nri-dot-active' : ''}" data-dot-index="${idx}"></span>
        `).join('');

        return `
        <div id="nri-popup-overlay" class="nri-overlay" role="dialog" aria-modal="true">
            <div class="nri-card">
                <!-- Close Button -->
                <button id="nri-popup-close" class="nri-close-btn" aria-label="Close dialog">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="nri-grid">
                    <!-- Left: Cross-Fade Slideshow Pane -->
                    <div class="nri-image-pane" id="nri-slideshow-container">
                        ${slidesHTML}
                        <div class="nri-slideshow-dots">
                            ${dotsHTML}
                        </div>
                    </div>

                    <!-- Right: Content Pane -->
                    <div class="nri-content-pane">
                        <div class="nri-header-section">
                            <h2 class="nri-main-heading">
                                Living in ${headingPlace}? <br>
                                <span class="nri-sub-heading">Complete Home Interiors in Hyderabad.</span>
                            </h2>
                            <p class="nri-lead-text">
                                End-to-end bespoke interior execution with zero stress. Track progress remotely and move into a finished home on your next trip.
                            </p>
                        </div>

                        <!-- 3 Architectural Benefit Cards -->
                        <div class="nri-features-stack">
                            <div class="nri-feature-row">
                                <div class="nri-icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                    </svg>
                                </div>
                                <div class="nri-feature-text">
                                    <h4>Live Video & 3D Walkthroughs</h4>
                                    <p>Weekly milestone video calls & photo progress reports directly on WhatsApp.</p>
                                </div>
                            </div>

                            <div class="nri-feature-row">
                                <div class="nri-icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                                <div class="nri-feature-text">
                                    <h4>Your Timezone Friendly Hours</h4>
                                    <p>Design consultations scheduled around your evening & weekend hours.</p>
                                </div>
                            </div>

                            <div class="nri-feature-row">
                                <div class="nri-icon-box">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                                    </svg>
                                </div>
                                <div class="nri-feature-text">
                                    <h4>100% Turnkey Handover</h4>
                                    <p>Modular kitchens, bespoke wardrobes, false ceiling, lighting & deep cleaning.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Action Group: Option B (Official WhatsApp Green + Sleek Direct Call) -->
                        <div class="nri-cta-wrapper">
                            <a href="https://wa.me/919603960337?text=${waMessage}" target="_blank" rel="noopener noreferrer" class="nri-primary-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Connect on WhatsApp</span>
                            </a>
                            <div class="nri-call-direct">
                                <span>Direct Call:</span>
                                <a href="tel:+919603960337" class="nri-call-link">+91 9603 960337</a>
                            </div>
                        </div>

                        <!-- Trust Footer -->
                        <div class="nri-trust-row">
                            <span class="nri-trust-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                10-Year Material Warranty
                            </span>
                            <span class="nri-trust-divider">•</span>
                            <span class="nri-trust-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                400+ Homes Completed in Hyderabad
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function injectStyles() {
        if (document.getElementById('nri-popup-styles')) return;

        const style = document.createElement('style');
        style.id = 'nri-popup-styles';
        style.textContent = `
            .nri-overlay {
                position: fixed;
                inset: 0;
                background: rgba(17, 24, 39, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
            }

            .nri-overlay.nri-active {
                opacity: 1;
                visibility: visible;
            }

            .nri-card {
                position: relative;
                background: #ffffff;
                border-radius: 24px;
                max-width: 900px;
                width: 100%;
                overflow: hidden;
                box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.35);
                border: 1px solid rgba(234, 179, 8, 0.2);
                transform: scale(0.96) translateY(14px);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                color: #374151;
            }

            .nri-overlay.nri-active .nri-card {
                transform: scale(1) translateY(0);
            }

            .nri-close-btn {
                position: absolute;
                top: 16px;
                right: 16px;
                background: #f3f4f6;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #4b5563;
                cursor: pointer;
                z-index: 20;
                transition: all 0.2s ease;
            }

            .nri-close-btn:hover {
                background: #1f2937;
                color: #eab308;
                transform: rotate(90deg);
            }

            .nri-grid {
                display: grid;
                grid-template-columns: 360px 1fr;
            }

            /* Image Slideshow Pane */
            .nri-image-pane {
                position: relative;
                background: #111827;
                overflow: hidden;
                min-height: 520px;
            }

            .nri-slide {
                position: absolute;
                inset: 0;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
            }

            .nri-slide-active {
                opacity: 1;
                visibility: visible;
            }

            .nri-img-cover {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .nri-quote-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 32px 20px 24px 20px;
                background: linear-gradient(180deg, transparent 0%, rgba(17, 24, 39, 0.95) 100%);
                color: #ffffff;
            }

            .nri-slide-tag {
                display: inline-block;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(6px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #fef08a;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 3px 8px;
                border-radius: 4px;
                margin-bottom: 8px;
            }

            .nri-stars {
                color: #eab308;
                font-size: 13px;
                letter-spacing: 2px;
                margin-bottom: 6px;
            }

            .nri-quote-body {
                font-size: 12px;
                line-height: 1.5;
                color: #f3f4f6;
                margin: 0 0 6px 0;
            }

            .nri-quote-user {
                font-size: 10.5px;
                color: #eab308;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 700;
            }

            /* Slideshow Dots */
            .nri-slideshow-dots {
                position: absolute;
                top: 16px;
                left: 16px;
                display: flex;
                gap: 6px;
                z-index: 10;
            }

            .nri-dot-indicator {
                width: 20px;
                height: 3px;
                background: rgba(255, 255, 255, 0.35);
                border-radius: 2px;
                transition: all 0.3s ease;
            }

            .nri-dot-indicator.nri-dot-active {
                background: #eab308;
                width: 28px;
            }

            /* Content Pane */
            .nri-content-pane {
                padding: 38px 36px 28px 36px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .nri-header-section {
                margin-bottom: 18px;
            }

            .nri-main-heading {
                font-size: 22px;
                line-height: 1.35;
                color: #1f2937;
                font-weight: 700;
                margin: 0 0 8px 0;
                letter-spacing: -0.3px;
            }

            .nri-sub-heading {
                color: #1f2937;
                font-weight: 500;
            }

            .nri-lead-text {
                font-size: 13px;
                line-height: 1.55;
                color: #6b7280;
                margin: 0;
            }

            /* Feature Stack */
            .nri-features-stack {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 22px;
            }

            .nri-feature-row {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 8px 10px;
                border-radius: 12px;
                background: #fafaf9;
                border: 1px solid #f3f4f6;
            }

            .nri-icon-box {
                width: 30px;
                height: 30px;
                border-radius: 8px;
                background: #fef08a;
                color: #a16207;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .nri-feature-text h4 {
                font-size: 12.5px;
                font-weight: 700;
                color: #1f2937;
                margin: 0 0 2px 0;
            }

            .nri-feature-text p {
                font-size: 11.5px;
                line-height: 1.4;
                color: #6b7280;
                margin: 0;
            }

            /* Clean CTA Redesign */
            .nri-cta-wrapper {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 18px;
            }

            .nri-primary-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background: linear-gradient(135deg, #25D366 0%, #1da851 100%);
                color: #ffffff !important;
                font-size: 13.5px;
                font-weight: 700;
                padding: 14px 24px;
                border-radius: 12px;
                text-decoration: none;
                transition: all 0.25s ease;
                box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
            }

            .nri-primary-btn:hover {
                background: linear-gradient(135deg, #22c35e 0%, #199447 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 22px rgba(37, 211, 102, 0.45);
            }

            .nri-call-direct {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-size: 12px;
                color: #6b7280;
            }

            .nri-call-link {
                color: #1f2937;
                font-weight: 700;
                text-decoration: underline;
                text-underline-offset: 2px;
                transition: color 0.2s ease;
            }

            .nri-call-link:hover {
                color: #ca8a04;
            }

            /* Trust Row */
            .nri-trust-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 11px;
                font-weight: 600;
                color: #6b7280;
            }

            .nri-trust-item {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .nri-trust-divider {
                color: #d1d5db;
            }

            /* Mobile */
            @media (max-width: 768px) {
                .nri-grid {
                    grid-template-columns: 1fr;
                }
                .nri-image-pane {
                    display: none;
                }
                .nri-content-pane {
                    padding: 30px 20px 24px 20px;
                }
                .nri-main-heading {
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initSlideshow() {
        const slides = document.querySelectorAll('.nri-slide');
        const dots = document.querySelectorAll('.nri-dot-indicator');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        const intervalTime = 4500; // 4.5 seconds per slide

        const timer = setInterval(() => {
            slides[currentIndex].classList.remove('nri-slide-active');
            dots[currentIndex].classList.remove('nri-dot-active');

            currentIndex = (currentIndex + 1) % slides.length;

            slides[currentIndex].classList.add('nri-slide-active');
            dots[currentIndex].classList.add('nri-dot-active');
        }, intervalTime);

        return timer;
    }

    function showPopup(country) {
        injectStyles();

        const wrapper = document.createElement('div');
        wrapper.innerHTML = createModalHTML(country);
        document.body.appendChild(wrapper);

        const overlay = document.getElementById('nri-popup-overlay');
        const closeBtn = document.getElementById('nri-popup-close');

        requestAnimationFrame(() => {
            setTimeout(() => {
                overlay.classList.add('nri-active');
                initSlideshow();
            }, 100);
        });

        function closeModal() {
            overlay.classList.remove('nri-active');
            setTimeout(() => {
                wrapper.remove();
            }, 400);
        }

        closeBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    async function checkAndTrigger() {
        if (isPreview) {
            const testCountry = urlParams.get('test_country') || 'United States';
            setTimeout(() => showPopup(testCountry), 400);
            return;
        }

        try {
            const res = await fetch('/api/geo');
            if (!res.ok) return;

            const data = await res.json();

            if (data.isNRI || (data.country && data.country !== 'IN' && data.country !== 'UNKNOWN' && data.country !== 'LOCAL')) {
                setTimeout(() => {
                    showPopup(data.country);
                }, 1600);
            }
        } catch (err) {
            // Silently ignore
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndTrigger);
    } else {
        checkAndTrigger();
    }
})();
