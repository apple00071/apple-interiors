// Shared Navigation Component
// This script creates a reusable navigation bar that can be included in all pages

class SharedNavigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('portfolio')) return 'portfolio';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }

    createNotificationBar() {
        return `
            <!-- Notification Bar -->
            <div id="notification-bar" class="fixed top-0 left-0 right-0 z-[101] w-full bg-primary text-white overflow-hidden" style="height: var(--notification-height);">
                <div class="scrolling-text-container flex items-center h-full">
                    <div class="scrolling-text text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap">
                        🚀 We are launching the Apple Interiors NRI Connect Soon
                        <svg class="inline-block w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        🚀 We are launching the Apple Interiors NRI Connect Soon
                        <svg class="inline-block w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        🚀 We are launching the Apple Interiors NRI Connect Soon
                        <svg class="inline-block w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        🚀 We are launching the Apple Interiors NRI Connect Soon
                        <svg class="inline-block w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }

    createHeader() {
        return `
            <!-- Header -->
            <header id="header" class="fixed left-0 right-0 z-[100] px-4 transition-all duration-300 shadow-sm w-full bg-white/95 backdrop-blur-[12px]" style="top: var(--notification-height, 2.5rem); height: var(--header-height, 4rem);">
                <!-- Main Navigation -->
                <div class="container mx-auto flex items-center justify-between h-full">
                    <!-- Logo -->
                    <div class="flex items-center z-[101]">
                        <a href="/" class="flex items-center">
                            <div class="relative h-8 w-24 sm:h-10 sm:w-32 md:h-16 md:w-56">
                                <img src="/images/New-logo.png" alt="Apple Interiors Logo" class="object-contain w-full h-full" loading="eager">
                            </div>
                        </a>
                    </div>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex items-center space-x-8">
                        <a href="/" class="${this.getNavLinkClass('home')}">
                            Home
                            ${this.getActiveIndicator('home')}
                        </a>
                        <a href="/about" class="${this.getNavLinkClass('about')}">
                            About
                            ${this.getActiveIndicator('about')}
                        </a>
                        <a href="/services" class="${this.getNavLinkClass('services')}">
                            Services
                            ${this.getActiveIndicator('services')}
                        </a>
                        <a href="/portfolio" class="${this.getNavLinkClass('portfolio')}">
                            Portfolio
                            ${this.getActiveIndicator('portfolio')}
                        </a>
                        <a href="/contact" class="${this.getNavLinkClass('contact')}">
                            Contact
                            ${this.getActiveIndicator('contact')}
                        </a>
                        
                        <!-- Social Media Icons -->
                        <div class="flex items-center space-x-4">
                            <a href="https://www.instagram.com/appleinteriors.hyderabad/?hl=en" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-yellow-500 transition-colors duration-300">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/appleinteriors.net/" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-yellow-500 transition-colors duration-300">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@appleinteriors-hyderabad" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-yellow-500 transition-colors duration-300">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </nav>

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" class="md:hidden flex flex-col items-center justify-center w-12 h-12 p-3 space-y-1 z-[101] cursor-pointer touch-manipulation bg-transparent border-none" type="button" aria-label="Toggle mobile menu" style="min-width: 44px; min-height: 44px;">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
        `;
    }

    createMobileMenu() {
        return `
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="fixed left-0 right-0 bg-white backdrop-blur-lg md:hidden overflow-hidden shadow-lg z-[95] h-0 opacity-0 transition-all duration-400" style="top: var(--total-header-height, 6.5rem);">
                <nav class="container mx-auto py-6 px-4 overflow-y-auto h-full">
                    <div class="flex flex-col space-y-3">
                        <div class="border-b border-gray-100 pb-3">
                            <a href="/" class="${this.getMobileNavLinkClass('home')}">Home</a>
                        </div>
                        <div class="border-b border-gray-100 pb-3">
                            <a href="/about" class="${this.getMobileNavLinkClass('about')}">About</a>
                        </div>
                        <div class="border-b border-gray-100 pb-3">
                            <a href="/services" class="${this.getMobileNavLinkClass('services')}">Services</a>
                        </div>
                        <div class="border-b border-gray-100 pb-3">
                            <a href="/portfolio" class="${this.getMobileNavLinkClass('portfolio')}">Portfolio</a>
                        </div>
                        <div class="border-b border-gray-100 pb-3">
                            <a href="/contact" class="${this.getMobileNavLinkClass('contact')}">Contact</a>
                        </div>
                    </div>
                </nav>
            </div>
        `;
    }

    getNavLinkClass(page) {
        const baseClass = "text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium relative group py-2";
        const activeClass = "text-primary font-medium text-sm relative group py-2";
        return this.currentPage === page ? activeClass : baseClass;
    }

    getMobileNavLinkClass(page) {
        const baseClass = "hover:text-primary transition-colors duration-300 text-xl font-medium block py-4 text-foreground";
        const activeClass = "text-primary text-xl font-medium block py-4";
        return this.currentPage === page ? activeClass : baseClass;
    }

    getActiveIndicator(page) {
        if (this.currentPage === page) {
            return '<span class="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"></span>';
        }
        return '<span class="absolute left-0 right-0 bottom-0 h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>';
    }

    init() {
        try {
            // Create navigation container
            const navContainer = document.createElement('div');
            navContainer.id = 'shared-navigation';
            navContainer.innerHTML = this.createNotificationBar() + this.createHeader() + this.createMobileMenu();
            
            // Insert at the beginning of body
            document.body.insertBefore(navContainer, document.body.firstChild);
            
            // Initialize scrolling text immediately
            this.initScrollingText();

            // Initialize mobile menu functionality with a small delay to ensure DOM is ready
            setTimeout(() => {
                this.initMobileMenu();
            }, 100);
            
        } catch (error) {
            console.error('Error initializing shared navigation:', error);
        }
    }

    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        console.log('Attempting to initialize mobile menu...', { mobileMenuBtn, mobileMenu });

        if (mobileMenuBtn && mobileMenu) {
            console.log('Mobile menu elements found, initializing...'); // Debug log

            // Function to toggle menu
            const toggleMenu = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = mobileMenu.classList.contains('open');
                console.log('Mobile menu button triggered, isOpen:', isOpen); // Debug log

                if (isOpen) {
                    mobileMenu.classList.remove('open');
                    mobileMenuBtn.classList.remove('open');
                    console.log('Closing mobile menu'); // Debug log
                } else {
                    mobileMenu.classList.add('open');
                    mobileMenuBtn.classList.add('open');
                    console.log('Opening mobile menu'); // Debug log
                }
            };

            // Add multiple event types for better mobile compatibility
            mobileMenuBtn.addEventListener('click', toggleMenu);
            mobileMenuBtn.addEventListener('touchstart', toggleMenu);

            // Add visual feedback for touch
            mobileMenuBtn.addEventListener('touchstart', () => {
                mobileMenuBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            });

            mobileMenuBtn.addEventListener('touchend', () => {
                setTimeout(() => {
                    mobileMenuBtn.style.backgroundColor = '';
                }, 150);
            });

            // Close mobile menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    mobileMenuBtn.classList.remove('open');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    if (mobileMenu.classList.contains('open')) {
                        mobileMenu.classList.remove('open');
                        mobileMenuBtn.classList.remove('open');
                        console.log('Closing mobile menu (clicked outside)'); // Debug log
                    }
                }
            });
        } else {
            console.error('Mobile menu elements not found:', { mobileMenuBtn, mobileMenu }); // Debug log
        }
    }

    initScrollingText() {
        const scrollingText = document.querySelector('.scrolling-text');
        if (scrollingText) {
            console.log('Scrolling text initialized'); // Debug log

            // Adjust animation speed based on text length and screen width
            const textWidth = scrollingText.scrollWidth;
            const screenWidth = window.innerWidth;
            const duration = Math.max(20, (textWidth + screenWidth) / 50); // Minimum 20s, adjust based on content

            scrollingText.style.animationDuration = `${duration}s`;

            // Handle window resize
            window.addEventListener('resize', () => {
                const newTextWidth = scrollingText.scrollWidth;
                const newScreenWidth = window.innerWidth;
                const newDuration = Math.max(20, (newTextWidth + newScreenWidth) / 50);
                scrollingText.style.animationDuration = `${newDuration}s`;
            });
        } else {
            console.error('Scrolling text element not found');
        }
    }
}

// Initialize shared navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SharedNavigation();
});
