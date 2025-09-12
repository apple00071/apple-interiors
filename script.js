// Portfolio data - Exact copy from SimplePortfolio.tsx
const fallbackCategories = [
  { id: 1, name: 'bedroom' },
  { id: 2, name: 'living-room' },
  { id: 3, name: 'kitchen' },
  { id: 4, name: 'dining' },
  { id: 5, name: 'false-ceiling' }
];

const fallbackItems = [
  {
    id: 1,
    image_paths: [
      '/images/portfolio/bedroom/104.webp',
      '/images/portfolio/bedroom/3.webp',
      '/images/portfolio/bedroom/99.webp',
      '/images/portfolio/bedroom/J7.webp',
      '/images/portfolio/bedroom/J8.webp',
      '/images/portfolio/bedroom/N3.webp'
    ],
    category: 'bedroom'
  },
  {
    id: 2,
    image_paths: [
      '/images/portfolio/living-room/1.webp',
      '/images/portfolio/living-room/12.webp',
      '/images/portfolio/living-room/13.webp',
      '/images/portfolio/living-room/4.webp',
      '/images/portfolio/living-room/7.webp'
    ],
    category: 'living-room'
  },
  {
    id: 3,
    image_paths: [
      '/images/portfolio/kitchen/J1.webp',
      '/images/portfolio/kitchen/J2.webp',
      '/images/portfolio/kitchen/J3.webp',
      '/images/portfolio/kitchen/J4.webp',
      '/images/portfolio/kitchen/J8.webp',
      '/images/portfolio/kitchen/J9.webp'
    ],
    category: 'kitchen'
  },
  {
    id: 4,
    image_paths: [
      '/images/portfolio/dining/1 (2).webp',
      '/images/portfolio/dining/2.webp',
      '/images/portfolio/dining/10.webp',
      '/images/portfolio/dining/26.webp',
      '/images/portfolio/dining/9.webp',
      '/images/portfolio/dining/N2.webp'
    ],
    category: 'dining'
  },
  {
    id: 5,
    image_paths: [
      '/images/portfolio/false-ceiling/141.webp',
      '/images/portfolio/false-ceiling/142.webp',
      '/images/portfolio/false-ceiling/2.webp',
      '/images/portfolio/false-ceiling/40.webp',
      '/images/portfolio/false-ceiling/73.webp',
      '/images/portfolio/false-ceiling/96.webp'
    ],
    category: 'false-ceiling'
  }
];

// Global variables
let selectedCategory = 'bedroom';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize portfolio
    initializePortfolio();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize header scroll effect
    initializeHeaderScroll();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Portfolio functionality
function initializePortfolio() {
    loadPortfolioItems(selectedCategory);
    
    // Portfolio filter functionality
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-600', 'hover:text-gray-900');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.classList.remove('text-gray-600', 'hover:text-gray-900');
            
            // Filter portfolio items
            const category = this.getAttribute('data-category');
            selectedCategory = category;
            loadPortfolioItems(category);
        });
    });
}

// Load portfolio items
function loadPortfolioItems(category) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const noImagesMessage = document.getElementById('no-images-message');
    
    if (!portfolioGrid) return;

    // Get all images for the selected category
    const selectedItems = fallbackItems.filter(item => item.category === category);
    const allImages = selectedItems.flatMap(item => 
        item.image_paths.map(path => ({
            src: path,
            category: item.category
        })));
    // Removed image limit to show all available images

    portfolioGrid.innerHTML = '';
    
    if (allImages.length === 0) {
        noImagesMessage.classList.remove('hidden');
        return;
    } else {
        noImagesMessage.classList.add('hidden');
    }
    
    allImages.forEach((image, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 fade-in';
        portfolioItem.innerHTML = `
            <div class="aspect-[4/3] relative">
                <img src="${image.src}" 
                     alt="${formatCategoryName(image.category)} design by Apple Interiors" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     loading="lazy">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
        `;
        portfolioGrid.appendChild(portfolioItem);
        
        // Trigger animation
        setTimeout(() => {
            portfolioItem.classList.add('visible');
        }, index * 100);
    });
}

// Format category name
function formatCategoryName(categoryName) {
    return categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Animation functionality
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Header scroll effect
function initializeHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(12px)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(12px)';
            header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Contact form handling (if added later)
function handleContactForm(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Simulate form submission
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert(`Thank you ${name}! We have received your message and will get back to you soon.`);
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

// Initialize contact form when it's added
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Enhanced contact form handling
function handleContactForm(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const type = formData.get('type');
    const location = formData.get('location');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !phone) {
        showFormStatus('error', 'Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormStatus('error', 'Please enter a valid email address.');
        return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showFormStatus('error', 'Please enter a valid phone number.');
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showFormStatus('success', `Thank you ${name}! We have received your message and will get back to you soon.`);
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Optional: Send to WhatsApp
        const whatsappMessage = `Hi, I'm ${name}. I'm interested in interior design services for my ${type || 'property'} in ${location || 'Hyderabad'}. ${message || 'Please contact me for more details.'}`;
        const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;

        // Show option to continue on WhatsApp
        setTimeout(() => {
            if (confirm('Would you like to continue this conversation on WhatsApp for faster response?')) {
                window.open(whatsappUrl, '_blank');
            }
        }, 2000);

    }, 1500);
}

// Show form status messages
function showFormStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    statusDiv.className = `p-4 rounded-lg ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`;
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 5000);
}

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.remove('loading');
    
    // Initialize any remaining functionality
    initializeContactForm();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Resize handler
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments if needed
}, 250));
