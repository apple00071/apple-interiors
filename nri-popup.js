/**
 * Apple Interiors - Smart Non-Intrusive NRI Concierge Banner
 * Gently alerts international visitors about remote turnkey interior design in Hyderabad
 * without blocking the screen or disrupting user experience.
 */

(function () {
    // Never show on the dedicated NRI landing page itself
    if (window.location.pathname.includes('nri-interior-designers-hyderabad')) {
        return;
    }

    // Check if dismissed in this session
    try {
        if (sessionStorage.getItem('apple_nri_banner_dismissed') === '1') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('nri_preview') !== '1' && !urlParams.has('test_country')) {
                return;
            }
        }
    } catch (e) {}

    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('nri_preview') === '1' || urlParams.has('test_country');

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
        } catch (e) {}

        return code.length === 2 ? 'Abroad' : code;
    }

    function injectStyles() {
        if (document.getElementById('nri-floating-styles')) return;

        const style = document.createElement('style');
        style.id = 'nri-floating-styles';
        style.textContent = `
            #nri-floating-card {
                position: fixed;
                bottom: 24px;
                left: 24px;
                right: auto;
                z-index: 999;
                max-width: 400px;
                width: calc(100% - 32px);
                background: rgba(31, 41, 55, 0.97);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(234, 179, 8, 0.3);
                border-radius: 24px;
                padding: 18px 20px;
                box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.35);
                color: #ffffff;
                font-family: 'Montserrat', system-ui, sans-serif;
                transform: translateY(120%);
                opacity: 0;
                transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease;
                box-sizing: border-box;
            }

            #nri-floating-card.nri-visible {
                transform: translateY(0);
                opacity: 1;
            }

            .nri-badge-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .nri-tag {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(234, 179, 8, 0.15);
                color: #eab308;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                padding: 4px 12px;
                border-radius: 999px;
                border: 1px solid rgba(234, 179, 8, 0.3);
            }

            .nri-close-pill {
                background: transparent;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .nri-close-pill:hover {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.1);
            }

            .nri-floating-title {
                font-size: 15px;
                font-weight: 500;
                color: #ffffff;
                line-height: 1.35;
                margin: 0 0 6px 0;
                text-transform: uppercase;
                letter-spacing: -0.01em;
            }

            .nri-floating-title span {
                color: #eab308;
                font-weight: 600;
            }

            .nri-floating-desc {
                font-size: 12px;
                color: #d1d5db;
                line-height: 1.5;
                margin: 0 0 14px 0;
                hyphens: none;
                -webkit-hyphens: none;
                word-break: normal;
            }

            .nri-floating-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .nri-btn-explore {
                flex: 1;
                background: #eab308;
                color: #1f2937;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                text-decoration: none;
                padding: 10px 16px;
                border-radius: 999px;
                text-align: center;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
            }

            .nri-btn-explore:hover {
                background: #ca8a04;
                transform: translateY(-1px);
            }

            .nri-btn-whatsapp {
                background: #25D366;
                color: #ffffff;
                border-radius: 999px;
                padding: 9px 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                transition: all 0.2s ease;
            }

            .nri-btn-whatsapp:hover {
                background: #1EBE5D;
                transform: translateY(-1px);
            }

            @media (max-width: 640px) {
                #nri-floating-card {
                    bottom: 16px;
                    right: 16px;
                    left: 16px;
                    width: auto;
                    padding: 14px 16px;
                }
                .nri-floating-title {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function showBanner(rawCountry) {
        if (document.getElementById('nri-floating-card')) return;

        injectStyles();

        const countryLabel = formatCountryName(rawCountry);
        const headingPlace = (countryLabel === 'Abroad') ? 'the USA or Abroad' : countryLabel;
        const waMessage = encodeURIComponent(
            `Hi Apple Interiors, I'm an NRI based in ${countryLabel} looking for turnkey home interiors in Hyderabad.`
        );

        const card = document.createElement('div');
        card.id = 'nri-floating-card';
        card.setAttribute('role', 'complementary');
        card.setAttribute('aria-label', 'NRI Interior Concierge');
        card.innerHTML = `
            <div class="nri-badge-row">
                <div class="nri-tag">
                    <span style="font-size: 13px;">🌍</span>
                    NRI Home Interiors
                </div>
                <button id="nri-banner-close" class="nri-close-pill" aria-label="Dismiss notification">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <h4 class="nri-floating-title">
                Living in <span>${headingPlace}</span>?
            </h4>
            <p class="nri-floating-desc">
                Turnkey flat & villa interiors in Hyderabad. Weekly WhatsApp video milestones & 100% remote handover before your vacation.
            </p>
            <div class="nri-floating-actions">
                <a href="/nri-interior-designers-hyderabad" class="nri-btn-explore">
                    <span>Explore NRI Services</span>
                    <span>&rarr;</span>
                </a>
                <a href="https://wa.me/919603960337?text=${waMessage}" target="_blank" rel="noopener noreferrer" class="nri-btn-whatsapp" title="Connect on WhatsApp">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                </a>
            </div>
        `;

        document.body.appendChild(card);

        // Animate entrance smoothly
        requestAnimationFrame(() => {
            setTimeout(() => {
                card.classList.add('nri-visible');
            }, 50);
        });

        const closeBtn = document.getElementById('nri-banner-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                card.classList.remove('nri-visible');
                setTimeout(() => card.remove(), 450);
                try {
                    sessionStorage.setItem('apple_nri_banner_dismissed', '1');
                } catch (e) {}
            });
        }
    }

    async function checkAndTrigger() {
        if (isPreview) {
            const testCountry = urlParams.get('test_country') || 'United States';
            setTimeout(() => showBanner(testCountry), 600);
            return;
        }

        try {
            const res = await fetch('/api/geo');
            if (!res.ok) return;

            const data = await res.json();

            if (data.isNRI || (data.country && data.country !== 'IN' && data.country !== 'UNKNOWN' && data.country !== 'LOCAL')) {
                setTimeout(() => {
                    showBanner(data.country);
                }, 2000);
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
