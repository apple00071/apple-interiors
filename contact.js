// Contact Form - Apple Interiors Email Integration
// Clean implementation with proper API connection

const API_CONFIG = {
    endpoint: '/api/send-email',
    apiKey: 're_cBhHvgdz_6KB4XdZoXAVN5BgFDWW83oQu'
};

// Email configuration
const EMAIL_CONFIG = {
    fromEmail: 'noreply@appleinteriors.in',
    adminEmail: 'aravind.bandaru@appleinteriors.in',
    companyName: 'Apple Interiors'
};

// Initialize contact form when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
});

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    
    // Get form element
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('form-status');
    
    // Get form data
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Send to API endpoint
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                formData: formObject,
                config: EMAIL_CONFIG
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showStatus('success', `Thank you ${formObject.name}! Your message has been sent successfully. We'll get back to you within 24 hours.`);
            form.reset();
            
            // Offer WhatsApp option
            setTimeout(() => {
                if (confirm('Would you like to continue this conversation on WhatsApp for faster response?')) {
                    openWhatsApp(formObject);
                }
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to send email');
        }
        
    } catch (error) {
        console.error('Email submission error:', error);
        showStatus('error', 'Failed to send email. Please try WhatsApp or call us directly.');
        
        // Fallback to WhatsApp after 3 seconds
        setTimeout(() => {
            if (confirm('Would you like to send this message via WhatsApp instead?')) {
                openWhatsApp(formObject);
            }
        }, 3000);
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Validate form fields
function validateForm(data) {
    const { name, email, phone } = data;
    
    if (!name || !email || !phone) {
        showStatus('error', 'Please fill in all required fields (Name, Email, Phone).');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showStatus('error', 'Please enter a valid email address.');
        return false;
    }
    
    // Phone validation for Indian numbers
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        showStatus('error', 'Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

// Show status messages
function showStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;
    
    // Style classes based on type
    const styles = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
    };
    
    statusDiv.className = `p-4 rounded-lg border ${styles[type] || styles.error} mb-4 transition-all duration-300`;
    statusDiv.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : '!'}
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
        </div>
    `;
    
    statusDiv.classList.remove('hidden');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        statusDiv.classList.add('opacity-0');
        setTimeout(() => {
            statusDiv.classList.add('hidden');
            statusDiv.classList.remove('opacity-0');
        }, 300);
    }, 8000);
}

// Open WhatsApp with form data
function openWhatsApp(data) {
    const { name, email, phone, type, location, message } = data;
    
    let whatsappMessage = `Hi, I am ${name}. I am interested in interior design services from ${EMAIL_CONFIG.companyName}.\n\n`;
    whatsappMessage += `📧 Email: ${email}\n`;
    whatsappMessage += `📞 Phone: ${phone}\n`;
    
    if (type) whatsappMessage += `🏠 Property Type: ${type}\n`;
    if (location) whatsappMessage += `📍 Location: ${location}\n`;
    if (message) whatsappMessage += `💬 Message: ${message}\n`;
    
    whatsappMessage += `\nPlease contact me for more details. Thank you!`;
    
    const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Export for potential use in other scripts
window.AppleInteriorsContact = {
    submitForm: handleFormSubmission,
    validateForm: validateForm,
    showStatus: showStatus,
    openWhatsApp: openWhatsApp
};
