// New Contact Form Implementation
class ContactFormManager {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.statusContainer = null;
        this.isSubmitting = false;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupForm());
        } else {
            this.setupForm();
        }
    }

    setupForm() {
        this.form = document.getElementById('newContactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.statusContainer = document.getElementById('contact-status');

        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }

        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add real-time validation
        this.setupValidation();

        console.log('New contact form initialized successfully');
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        switch (fieldName) {
            case 'fullName':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = 'Full name must be at least 2 characters';
                }
                break;

            case 'emailAddress':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phoneNumber':
                const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
                const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                if (!value || !phoneRegex.test(cleanPhone)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        field.classList.remove('border-gray-300', 'focus:ring-blue-500', 'focus:border-blue-500');

        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        field.classList.add('border-gray-300', 'focus:ring-blue-500', 'focus:border-blue-500');

        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    validateForm() {
        const requiredFields = ['fullName', 'emailAddress', 'phoneNumber'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return;
        }

        // Validate form
        if (!this.validateForm()) {
            this.showStatus('error', 'Please fix the errors above and try again.');
            return;
        }

        this.isSubmitting = true;
        this.setLoadingState(true);

        try {
            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Send to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                        const textResponse = await response.text();
                        console.error('Non-JSON response received:', textResponse.substring(0, 200));
                        errorMessage = 'API endpoint not available. Please try again later or contact us directly.';
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
                this.showStatus('success', result.message || 'Your message has been sent successfully!');
                this.form.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('Form submission error:', error);

            // Determine error type and provide appropriate message
            let errorMessage = 'Sorry, there was an issue sending your message. ';
            let showFallback = false;

            if (error.message.includes('API endpoint not available') ||
                error.message.includes('Server error: 404') ||
                error.message.includes('Failed to fetch')) {
                errorMessage += 'Our contact system is temporarily unavailable. ';
                showFallback = true;
            } else if (error.message.includes('Invalid response')) {
                errorMessage += 'There was a technical issue with the submission. ';
                showFallback = true;
            } else {
                errorMessage += 'Please try again in a moment. ';
            }

            // Add contact alternatives
            errorMessage += 'You can also reach us directly:';

            // Show error message with fallback options
            this.showStatus('error', errorMessage);

            // Add fallback contact options if there's a system issue
            if (showFallback) {
                this.addFallbackOptions();
            }

        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        if (!this.submitBtn) return;

        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        if (loading) {
            btnText?.classList.add('hidden');
            btnLoading?.classList.remove('hidden');
            this.submitBtn.disabled = true;
        } else {
            btnText?.classList.remove('hidden');
            btnLoading?.classList.add('hidden');
            this.submitBtn.disabled = false;
        }
    }

    showStatus(type, message) {
        if (!this.statusContainer) return;

        let bgColor, textColor, borderColor, icon;

        switch (type) {
            case 'success':
                bgColor = 'bg-green-50';
                textColor = 'text-green-800';
                borderColor = 'border-green-200';
                icon = '✅';
                break;
            case 'error':
                bgColor = 'bg-red-50';
                textColor = 'text-red-800';
                borderColor = 'border-red-200';
                icon = '❌';
                break;
            case 'warning':
                bgColor = 'bg-yellow-50';
                textColor = 'text-yellow-800';
                borderColor = 'border-yellow-200';
                icon = '⚠️';
                break;
            default:
                bgColor = 'bg-blue-50';
                textColor = 'text-blue-800';
                borderColor = 'border-blue-200';
                icon = 'ℹ️';
        }

        this.statusContainer.className = `p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} mb-6 transition-all duration-300`;
        this.statusContainer.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 text-lg mr-3">${icon}</div>
                <div class="flex-1">
                    <p class="font-medium">${message}</p>
                </div>
            </div>
        `;

        this.statusContainer.classList.remove('hidden');

        // Scroll to status message
        setTimeout(() => {
            this.statusContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);

        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusContainer.classList.add('hidden');
            }, 10000);
        }
    }

    addFallbackOptions() {
        // Add fallback contact options to the status message
        const fallbackHtml = `
            <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-3">Alternative Contact Methods:</h4>
                <div class="space-y-2">
                    <div class="flex items-center space-x-3">
                        <span class="text-blue-600">📞</span>
                        <a href="tel:+919603960337" class="text-blue-700 hover:text-blue-900 font-medium">
                            +91 9603 9603 37
                        </a>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-green-600">💬</span>
                        <a href="https://wa.me/919603960337?text=Hi%2C%20I%20would%20like%20to%20discuss%20interior%20design%20services."
                           target="_blank"
                           class="text-green-700 hover:text-green-900 font-medium">
                            WhatsApp Us
                        </a>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-gray-600">📧</span>
                        <a href="mailto:aravind.bandaru@appleinteriors.in"
                           class="text-gray-700 hover:text-gray-900 font-medium">
                            aravind.bandaru@appleinteriors.in
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Append to status container
        this.statusContainer.insertAdjacentHTML('beforeend', fallbackHtml);
    }
}

// Initialize the contact form when the script loads
const contactForm = new ContactFormManager();

// Export for global access
window.contactForm = contactForm;


