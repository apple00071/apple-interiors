// Shared Navigation Component - Pill Header Style

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
        if (path.includes('nri')) return 'nri';
        if (path.includes('contact')) return 'contact';
        if (path.includes('blog')) return 'blog';
        return 'home';
    }

    createHeader() {
        return `
            <div class="fixed top-4 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none transition-all duration-300" id="pill-nav-container">
                <header class="bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-6 py-3 flex items-center justify-between w-full max-w-6xl pointer-events-auto border border-gray-100 relative">
                    
                    <!-- Logo -->
                    <a href="/" class="flex-shrink-0 flex items-center">
                        <img src="/images/New-logo.png" alt="Apple Interiors Logo" class="h-12 md:h-16 object-contain">
                    </a>

                    <!-- Desktop Nav (Absolutely Centered to Header/Screen Size) -->
                    <nav class="hidden md:flex items-center space-x-5 lg:space-x-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <a href="/" class="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center h-8 leading-none ${this.currentPage === 'home' ? 'text-primary' : ''}">Home</a>
                        <a href="/about" class="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center h-8 leading-none ${this.currentPage === 'about' ? 'text-primary' : ''}">About</a>
                        <a href="/services" class="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center h-8 leading-none ${this.currentPage === 'services' ? 'text-primary' : ''}">Services</a>
                        <a href="/portfolio" class="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center h-8 leading-none ${this.currentPage === 'portfolio' ? 'text-primary' : ''}">Portfolio</a>
                        <a href="/nri-interior-designers-hyderabad" class="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center h-8 leading-none ${this.currentPage === 'nri' ? 'text-primary' : ''}">NRI Services</a>
                        <a href="/blog" class="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center h-8 leading-none ${this.currentPage === 'blog' ? 'text-primary' : ''}">Blog</a>
                    </nav>

                    <!-- Desktop Right Actions & Social Links -->
                    <div class="hidden md:flex items-center space-x-4">
                        <!-- Social Media -->
                        <div class="flex items-center space-x-3 mr-2 border-r border-gray-200 pr-4 h-6">
                            <a href="https://www.facebook.com/appleinteriors.net/" target="_blank" rel="noopener noreferrer"
                                class="text-secondary/60 hover:text-primary hover:scale-110 transition-all duration-300 flex items-center">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/appleinteriors.hyderabad/?hl=en" target="_blank" rel="noopener noreferrer"
                                class="text-secondary/60 hover:text-primary hover:scale-110 transition-all duration-300 flex items-center">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@appleinteriors-hyderabad" target="_blank" rel="noopener noreferrer"
                                class="text-secondary/60 hover:text-primary hover:scale-110 transition-all duration-300 flex items-center">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                        <a href="tel:+919603960337" class="text-secondary font-bold text-xs tracking-wider border border-secondary rounded-full px-5 py-2.5 hover:bg-secondary hover:text-white transition-colors flex items-center h-9 leading-none">CALL US</a>
                        <a href="/contact" class="bg-primary text-secondary font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors flex items-center h-9 leading-none">
                            Get Quote
                            <span class="ml-2 bg-secondary text-primary rounded-full w-4 h-4 flex items-center justify-center text-[10px]">&rarr;</span>
                        </a>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" class="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50">
                        <span class="block w-6 h-[2px] bg-secondary transition-transform duration-300 origin-center"></span>
                        <span class="block w-6 h-[2px] bg-secondary transition-opacity duration-300"></span>
                        <span class="block w-6 h-[2px] bg-secondary transition-transform duration-300 origin-center"></span>
                    </button>
                </header>
            </div>

            <!-- Mobile Drawer -->
            <div id="mobile-drawer" class="fixed inset-0 z-[90] bg-white flex flex-col pt-24 px-6 transform translate-x-full transition-transform duration-500 ease-in-out md:hidden overflow-y-auto">
                <nav class="flex flex-col space-y-6 flex-grow">
                    <a href="/" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'home' ? 'text-primary' : ''}">Home</a>
                    <a href="/about" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'about' ? 'text-primary' : ''}">About</a>
                    <a href="/services" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'services' ? 'text-primary' : ''}">Services</a>
                    <a href="/portfolio" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'portfolio' ? 'text-primary' : ''}">Portfolio</a>
                    <a href="/nri-interior-designers-hyderabad" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'nri' ? 'text-primary' : ''}">NRI Services</a>
                    <a href="/blog" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'blog' ? 'text-primary' : ''}">Blog</a>
                    <a href="/contact" class="text-3xl font-bold text-secondary uppercase tracking-wider ${this.currentPage === 'contact' ? 'text-primary' : ''}">Contact</a>
                </nav>
                <div class="pb-10 flex flex-col gap-6">
                     <a href="tel:+919603960337" class="text-center text-secondary font-bold text-sm tracking-wider border border-secondary rounded-full px-5 py-4 hover:bg-secondary hover:text-white transition-colors flex items-center justify-center">CALL +91 9603 960337</a>
                     <a href="/contact" class="text-center bg-primary text-secondary font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-full hover:bg-primary-hover transition-colors flex items-center justify-center">Get A Quote</a>
                     
                     <!-- Mobile Social Links -->
                     <div class="flex justify-center space-x-6 border-t border-gray-100 pt-6">
                        <a href="https://www.facebook.com/appleinteriors.net/" target="_blank" rel="noopener noreferrer"
                            class="text-secondary/70 hover:text-primary transition-colors">
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    clip-rule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/appleinteriors.hyderabad/?hl=en" target="_blank" rel="noopener noreferrer"
                            class="text-secondary/70 hover:text-primary transition-colors">
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@appleinteriors-hyderabad" target="_blank" rel="noopener noreferrer"
                            class="text-secondary/70 hover:text-primary transition-colors">
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                     </div>
                </div>
            </div>
        `;
    }

    init() {
        const navContainer = document.createElement('div');
        navContainer.id = 'shared-navigation';
        navContainer.innerHTML = this.createHeader();
        document.body.insertBefore(navContainer, document.body.firstChild);
        
        // Handle Mobile Menu
        setTimeout(() => {
            const btn = document.getElementById('mobile-menu-btn');
            const drawer = document.getElementById('mobile-drawer');
            const spans = btn.querySelectorAll('span');
            let isOpen = false;

            btn.addEventListener('click', () => {
                isOpen = !isOpen;
                if (isOpen) {
                    drawer.classList.remove('translate-x-full');
                    spans[0].classList.add('translate-y-[8px]', 'rotate-45');
                    spans[1].classList.add('opacity-0');
                    spans[2].classList.add('-translate-y-[8px]', '-rotate-45');
                    document.body.style.overflow = 'hidden';
                } else {
                    drawer.classList.add('translate-x-full');
                    spans[0].classList.remove('translate-y-[8px]', 'rotate-45');
                    spans[1].classList.remove('opacity-0');
                    spans[2].classList.remove('-translate-y-[8px]', '-rotate-45');
                    document.body.style.overflow = '';
                }
            });
        }, 100);

        // Hide Pill nav slightly on scroll down, show on scroll up
        let lastScrollY = window.scrollY;
        const pillNav = document.getElementById('pill-nav-container');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                if (window.scrollY > lastScrollY) {
                    pillNav.style.transform = 'translateY(-150%)'; // Hide
                } else {
                    pillNav.style.transform = 'translateY(0)'; // Show
                }
            } else {
                pillNav.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SharedNavigation();

    // Auto-load NRI / International Geo Popup across all pages
    if (!document.getElementById('nri-popup-script')) {
        const nriScript = document.createElement('script');
        nriScript.id = 'nri-popup-script';
        nriScript.src = '/nri-popup.js';
        nriScript.defer = true;
        document.head.appendChild(nriScript);
    }
});
