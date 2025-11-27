// Map functionality for all pages
function openGoogleMaps() {
    // Apple Interiors coordinates
    const latitude = 17.503003418559427;
    const longitude = 78.39299037116976;
    
    // Check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // User location found, create directions URL
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude},${longitude}/@${latitude},${longitude},16z`;
                window.open(directionsUrl, "_blank");
            },
            function(error) {
                // Geolocation failed, open map with Apple Interiors location
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                window.open(mapUrl, "_blank");
            }
        );
    } else {
        // Geolocation not supported, open map with Apple Interiors location
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        window.open(mapUrl, "_blank");
    }
}

// Portfolio data - Exact copy from SimplePortfolio.tsx
const fallbackCategories = [
    { id: 1, name: "bedroom" },
    { id: 2, name: "living-room" },
    { id: 3, name: "kitchen" },
    { id: 4, name: "dining" },
    { id: 5, name: "false-ceiling" }
];

const fallbackItems = [
    {
        id: 1,
        image_paths: [
            "/images/portfolio/bedroom/104.webp",
            "/images/portfolio/bedroom/3.webp",
            "/images/portfolio/bedroom/99.webp",
            "/images/portfolio/bedroom/J7.webp",
            "/images/portfolio/bedroom/J8.webp",
            "/images/portfolio/bedroom/N3.webp"
        ],
        category: "bedroom"
    },
    {
        id: 2,
        image_paths: [
            "/images/portfolio/living-room/1.webp",
            "/images/portfolio/living-room/12.webp",
            "/images/portfolio/living-room/13.webp",
            "/images/portfolio/living-room/4.webp",
            "/images/portfolio/living-room/7.webp"
        ],
        category: "living-room"
    },
    {
        id: 3,
        image_paths: [
            "/images/portfolio/kitchen/J1.webp",
            "/images/portfolio/kitchen/J2.webp",
            "/images/portfolio/kitchen/J3.webp",
            "/images/portfolio/kitchen/J4.webp",
            "/images/portfolio/kitchen/J8.webp",
            "/images/portfolio/kitchen/J9.webp"
        ],
        category: "kitchen"
    },
    {
        id: 4,
        image_paths: [
            "/images/portfolio/dining/1 (2).webp",
            "/images/portfolio/dining/2.webp",
            "/images/portfolio/dining/10.webp",
            "/images/portfolio/dining/26.webp",
            "/images/portfolio/dining/9.webp",
            "/images/portfolio/dining/N2.webp"
        ],
        category: "dining"
    },
    {
        id: 5,
        image_paths: [
            "/images/portfolio/false-ceiling/141.webp",
            "/images/portfolio/false-ceiling/142.webp",
            "/images/portfolio/false-ceiling/2.webp",
            "/images/portfolio/false-ceiling/40.webp",
            "/images/portfolio/false-ceiling/73.webp",
            "/images/portfolio/false-ceiling/96.webp"
        ],
        category: "false-ceiling"
    }
];

// Global variables
let selectedCategory = "bedroom";

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
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
    
    // Initialize map functionality
    initializeMapFunctionality();
    
    // Initialize home contact form
    initializeHomeContactForm();

    initializeFAQAccordions();
});

// Initialize map functionality
function initializeMapFunctionality() {
    // Add click event to all map containers
    const mapContainers = document.querySelectorAll('iframe[src*="google.com/maps"]');
    mapContainers.forEach(iframe => {
        const container = iframe.parentElement;
        container.style.cursor = "pointer";
        container.title = "Click to get directions";
        container.addEventListener("click", openGoogleMaps);
        
        // Add hover effect
        container.addEventListener("mouseenter", function() {
            this.style.opacity = "0.9";
        });
        
        container.addEventListener("mouseleave", function() {
            this.style.opacity = "1";
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", function() {
            mobileMenuBtn.classList.toggle("open");
            mobileMenu.classList.toggle("open");
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                mobileMenuBtn.classList.remove("open");
                mobileMenu.classList.remove("open");
            });
        });
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const headerHeight = document.getElementById("header").offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Portfolio functionality
function initializePortfolio() {
    loadPortfolioItems(selectedCategory);
    
    // Portfolio filter functionality
    const filterButtons = document.querySelectorAll(".portfolio-filter-btn");
    filterButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.classList.add("text-gray-600", "hover:text-gray-900");
            });
            
            // Add active class to clicked button
            this.classList.add("active");
            this.classList.remove("text-gray-600", "hover:text-gray-900");
            
            // Filter portfolio items
            const category = this.getAttribute("data-category");
            selectedCategory = category;
            loadPortfolioItems(category);
        });
    });
}

// Load portfolio items
function loadPortfolioItems(category) {
    const portfolioGrid = document.getElementById("portfolio-grid");
    const noImagesMessage = document.getElementById("no-images-message");
    
    if (!portfolioGrid) return;

    // Get all images for the selected category
    const selectedItems = fallbackItems.filter(item => item.category === category);
    const allImages = selectedItems.flatMap(item => 
        item.image_paths.map(path => ({
            src: path,
            category: item.category
        })));

    portfolioGrid.innerHTML = "";
    
    if (allImages.length === 0) {
        noImagesMessage.classList.remove("hidden");
        return;
    } else {
        noImagesMessage.classList.add("hidden");
    }
    
    allImages.forEach((image, index) => {
        const portfolioItem = document.createElement("div");
        portfolioItem.className = "portfolio-item group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 fade-in";
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
            portfolioItem.classList.add("visible");
        }, index * 100);
    });
}

// Format category name
function formatCategoryName(categoryName) {
    return categoryName
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Animation functionality
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function initializeFAQAccordions() {
    const faqItems = document.querySelectorAll('#faq .faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (!button || !answer) return;

        button.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');

        button.addEventListener('click', function() {
            const isOpen = !answer.classList.contains('hidden');

            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherButton = otherItem.querySelector('.faq-question');
                const otherIcon = otherItem.querySelector('.faq-icon');

                if (otherAnswer && otherButton) {
                    otherAnswer.classList.add('hidden');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                    otherButton.setAttribute('aria-expanded', 'false');
                    if (otherIcon) {
                        otherIcon.classList.remove('rotate-180');
                    }
                }
            });

            if (!isOpen) {
                answer.classList.remove('hidden');
                answer.setAttribute('aria-hidden', 'false');
                button.setAttribute('aria-expanded', 'true');
                if (icon) {
                    icon.classList.add('rotate-180');
                }
            }
        });
    });
}

// Header and notification bar scroll effect
function initializeHeaderScroll() {
    const header = document.getElementById("header");
    const notificationBar = document.getElementById("notification-bar");
    let lastScrollY = window.scrollY;
    let isHidden = false;

    const showBars = () => {
        if (header) {
            header.style.transform = "translateY(0)";
            header.style.background = "rgba(255, 255, 255, 0.95)";
            header.style.backdropFilter = "blur(12px)";
            header.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
        }
        if (notificationBar) {
            notificationBar.style.transform = "translateY(0)";
        }
        isHidden = false;
    };

    const hideBars = () => {
        if (notificationBar) {
            notificationBar.style.transform = "translateY(-100%)";
        }
        if (header) {
            // Move header up by both notification bar height + its own height
            const notificationHeight = notificationBar ? notificationBar.offsetHeight : 0;
            const headerHeight = header.offsetHeight;
            const totalTranslate = -(notificationHeight + headerHeight);
            header.style.transform = `translateY(${totalTranslate}px)`;
            header.style.boxShadow = "none";
        }
        isHidden = true;
    };

    // Ensure smooth transition
    if (header) {
        header.style.transition = "transform 0.3s ease, background 0.2s ease, box-shadow 0.2s ease";
    }
    if (notificationBar) {
        notificationBar.style.transition = "transform 0.3s ease";
    }

    window.addEventListener("scroll", function() {
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;

        if (currentY < 10) {
            showBars();
        } else if (scrollingDown && !isHidden) {
            hideBars();
        } else if (!scrollingDown && isHidden) {
            showBars();
        }

        lastScrollY = currentY;
    });
}

// Home Contact Form Manager
class HomeContactFormManager {
    constructor() {
        this.form = document.getElementById('homeContactForm');
        this.statusDiv = document.getElementById('home-contact-status');
        this.submitBtn = document.getElementById('homeSubmitBtn');
        this.btnText = this.submitBtn?.querySelector('.btn-text');
        this.btnLoading = this.submitBtn?.querySelector('.btn-loading');

        // Bot detection properties
        this.formStartTime = Date.now();
        this.interactionCount = 0;
        this.keystrokes = 0;
        this.mouseMovements = 0;
        this.focusEvents = 0;

        // CSRF token
        this.csrfToken = null;

        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupValidation();
            this.setupBotDetection();
            this.fetchCSRFToken();
        }
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupBotDetection() {
        if (!this.form) return;

        // Track user interactions
        this.form.addEventListener('keydown', () => {
            this.keystrokes++;
            this.interactionCount++;
        });

        this.form.addEventListener('mousemove', () => {
            this.mouseMovements++;
        });

        this.form.addEventListener('focusin', () => {
            this.focusEvents++;
            this.interactionCount++;
        });

        // Track form field interactions
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.interactionCount++;
            });
        });
    }

    // CSRF token management
    async fetchCSRFToken() {
        try {
            const response = await fetch('/api/csrf-token');
            if (response.ok) {
                const data = await response.json();
                this.csrfToken = data.token;
            } else {
                console.warn('Failed to fetch CSRF token');
            }
        } catch (error) {
            console.warn('Error fetching CSRF token:', error);
        }
    }

    // Bot detection analysis
    analyzeUserBehavior() {
        const timeSpent = Date.now() - this.formStartTime;
        const minTimeThreshold = 5000; // Minimum 5 seconds to fill form
        const maxTimeThreshold = 30 * 60 * 1000; // Maximum 30 minutes

        const suspiciousIndicators = [];

        // Check if form was filled too quickly (likely bot)
        if (timeSpent < minTimeThreshold) {
            suspiciousIndicators.push('Form filled too quickly');
        }

        // Check if form took too long (might be abandoned/automated)
        if (timeSpent > maxTimeThreshold) {
            suspiciousIndicators.push('Form took too long to complete');
        }

        // Check for lack of human-like interactions
        if (this.keystrokes < 5 && this.interactionCount < 3) {
            suspiciousIndicators.push('Insufficient user interactions');
        }

        // Check for no mouse movements (possible bot)
        if (this.mouseMovements === 0 && timeSpent > 10000) {
            suspiciousIndicators.push('No mouse movements detected');
        }

        // Check for no focus events
        if (this.focusEvents === 0) {
            suspiciousIndicators.push('No focus events detected');
        }

        return {
            timeSpent,
            keystrokes: this.keystrokes,
            mouseMovements: this.mouseMovements,
            focusEvents: this.focusEvents,
            interactionCount: this.interactionCount,
            suspiciousIndicators,
            isSuspicious: suspiciousIndicators.length > 0
        };
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }

        // Email validation
        if (fieldName === 'emailAddress' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Phone validation
        if (fieldName === 'phoneNumber' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) {
            if (message) {
                errorDiv.textContent = message;
                errorDiv.classList.remove('hidden');
                field.classList.add('border-red-500');
            } else {
                errorDiv.classList.add('hidden');
                field.classList.remove('border-red-500');
            }
        }
    }

    clearFieldError(field) {
        this.showFieldError(field, '');
    }

    getFieldLabel(fieldName) {
        const labels = {
            fullName: 'Full Name',
            emailAddress: 'Email Address',
            phoneNumber: 'Phone Number',
            propertyType: 'Property Type',
            projectLocation: 'Project Location',
            budget: 'Budget',
            projectMessage: 'Project Message'
        };
        return labels[fieldName] || fieldName;
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showStatus('error', 'Please fix the errors above and try again.');
            return;
        }

        // Analyze user behavior for bot detection
        const behaviorAnalysis = this.analyzeUserBehavior();

        // Log suspicious behavior (for debugging)
        if (behaviorAnalysis.isSuspicious) {
            console.warn('Suspicious form submission detected:', behaviorAnalysis);
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Prepare form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Add behavior analysis data for server-side verification
            data._behaviorAnalysis = JSON.stringify(behaviorAnalysis);

            // Add CSRF token if available
            if (this.csrfToken) {
                data._csrfToken = this.csrfToken;
            }

            // Send to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.csrfToken || ''
                },
                body: JSON.stringify(data)
            });

            // Check if response is ok first
            if (!response.ok) {
                // Handle non-200 responses
                let errorMessage = `Server error: ${response.status} ${response.statusText}`;

                // Try to get error details if response is JSON
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                    } else {
                        // Response is not JSON (likely HTML error page)
                        console.error('Non-JSON response received from API');
                        errorMessage = 'Contact form service is temporarily unavailable. Please use the contact information below.';
                    }
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }

                throw new Error(errorMessage);
            }

            // Parse JSON response only if response is ok
            let result;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    result = await response.json();
                } else {
                    throw new Error('Invalid response format: Expected JSON');
                }
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                throw new Error('Invalid response from server. Please try again.');
            }

            if (result.success) {
                this.showStatus('success', result.message || 'Thank you! Your message has been sent successfully. We will get back to you soon.');
                this.form.reset();
                this.clearAllErrors();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('Form submission error:', error);

            // Provide specific error message based on error type
            let errorMessage = 'Sorry, there was an error sending your message. ';

            if (error.message.includes('Contact form service is temporarily unavailable') ||
                error.message.includes('Server error: 404') ||
                error.message.includes('Failed to fetch')) {
                errorMessage += 'Our contact system is temporarily unavailable. Please contact us directly using the information below.';
            } else {
                errorMessage += 'Please try again or contact us directly at +91 9603 9603 37.';
            }

            this.showStatus('error', errorMessage);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        if (this.submitBtn && this.btnText && this.btnLoading) {
            this.submitBtn.disabled = loading;
            if (loading) {
                this.btnText.classList.add('hidden');
                this.btnLoading.classList.remove('hidden');
            } else {
                this.btnText.classList.remove('hidden');
                this.btnLoading.classList.add('hidden');
            }
        }
    }

    showStatus(type, message) {
        if (this.statusDiv) {
            this.statusDiv.className = `p-4 rounded-lg mb-6 ${
                type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
            }`;
            this.statusDiv.textContent = message;
            this.statusDiv.classList.remove('hidden');

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (this.statusDiv) {
                    this.statusDiv.classList.add('hidden');
                }
            }, 10000);

            // Scroll to status message
            this.statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearAllErrors() {
        const errorMessages = this.form.querySelectorAll('.error-message');
        const inputs = this.form.querySelectorAll('input, textarea');

        errorMessages.forEach(error => error.classList.add('hidden'));
        inputs.forEach(input => input.classList.remove('border-red-500'));
    }
}

// Initialize home contact form
function initializeHomeContactForm() {
    // Only initialize if we're on a page with the home contact form
    if (document.getElementById('homeContactForm')) {
        new HomeContactFormManager();
    }
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

// Performance optimization
window.addEventListener("load", function() {
    // Remove loading states
    document.body.classList.remove("loading");
});

// Error handling
window.addEventListener("error", function(e) {
    console.error("JavaScript error:", e.error);
});

// Resize handler
window.addEventListener("resize", debounce(function() {
    // Handle responsive adjustments if needed
}, 250));
