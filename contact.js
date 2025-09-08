// Resend API Configuration
const RESEND_CONFIG = {
    apiKey: 're_ebajyGt8_2rzcyYpj1cBK19w8CLixWsGd',
    apiUrl: 'https://api.resend.com/emails',
    fromEmail: 'noreply@appleinteriors.in', // You'll need to verify this domain with Resend
    adminEmail: 'aravind.bandaru@appleinteriors.in'
};

// Initialize contact form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
}

// Handle contact form submission with Resend API
async function handleContactFormSubmission(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);

    // Basic validation
    if (!validateForm(formObject)) {
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;

    try {
        // Send emails via serverless API
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formData: formObject })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showFormStatus('success', `Thank you ${formObject.name}! We have received your message and will get back to you within 24 hours.`);
            event.target.reset();

            // Optional: Send to WhatsApp as backup
            setTimeout(() => {
                if (confirm('Would you like to continue this conversation on WhatsApp for faster response?')) {
                    const whatsappMessage = createWhatsAppMessage(formObject);
                    const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
                    window.open(whatsappUrl, '_blank');
                }
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to send emails');
        }

    } catch (error) {
        console.error('Resend API Error:', error);

        // Fallback: Show success message and redirect to WhatsApp
        showFormStatus('warning', `Thank you ${formObject.name}! We'll contact you soon. For immediate assistance, please use WhatsApp.`);

        setTimeout(() => {
            const whatsappMessage = createWhatsAppMessage(formObject);
            const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }, 3000);

        event.target.reset();
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Validate form data
function validateForm(formData) {
    const { name, email, phone } = formData;
    
    // Check required fields
    if (!name || !email || !phone) {
        showFormStatus('error', 'Please fill in all required fields (Name, Email, Phone).');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormStatus('error', 'Please enter a valid email address.');
        return false;
    }
    
    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    const cleanPhone = phone.replace(/\s|-/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        showFormStatus('error', 'Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

// Email sending is now handled by the serverless API endpoint

// Create WhatsApp message from form data
function createWhatsAppMessage(formData) {
    const { name, email, phone, type, location, budget, message } = formData;
    
    let whatsappMessage = `Hi, I'm ${name}. I'm interested in interior design services.\n\n`;
    whatsappMessage += `📧 Email: ${email}\n`;
    whatsappMessage += `📱 Phone: ${phone}\n`;
    
    if (type) {
        whatsappMessage += `🏠 Property Type: ${type}\n`;
    }
    
    if (location) {
        whatsappMessage += `📍 Location: ${location}\n`;
    }
    
    if (budget) {
        whatsappMessage += `💰 Budget: ${budget}\n`;
    }
    
    if (message) {
        whatsappMessage += `\n💬 Message: ${message}\n`;
    }
    
    whatsappMessage += `\nPlease contact me for more details. Thank you!`;
    
    return whatsappMessage;
}

// Show form status messages
function showFormStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;
    
    // Set appropriate styling based on type
    let bgColor, textColor;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            break;
        case 'error':
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            break;
        case 'warning':
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            break;
        default:
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
    }
    
    statusDiv.className = `p-4 rounded-lg ${bgColor} ${textColor}`;
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 8000);
    
    // Scroll to status message
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Alternative contact form handler (fallback without Resend API)
function handleContactFormFallback(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);

    if (!validateForm(formObject)) {
        return;
    }

    // Show success message
    showFormStatus('success', `Thank you ${formObject.name}! We'll contact you soon via WhatsApp or phone.`);

    // Create WhatsApp message and open
    setTimeout(() => {
        const whatsappMessage = createWhatsAppMessage(formObject);
        const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    }, 2000);

    // Reset form
    event.target.reset();
}

// Utility function to check if Resend API is properly configured
function isResendConfigured() {
    return RESEND_CONFIG.apiKey && RESEND_CONFIG.apiKey !== 'your_api_key_here';
}

// Export functions for use in other scripts
window.ContactForm = {
    handleSubmission: handleContactFormSubmission,
    handleFallback: handleContactFormFallback,
    validateForm: validateForm,
    showStatus: showFormStatus,
    isConfigured: isResendConfigured
};
