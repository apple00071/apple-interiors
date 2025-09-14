// Resend API Configuration
const RESEND_CONFIG = {
    apiUrl: "https://api.resend.com/emails",
    fromEmail: "noreply@appleinteriors.in", // Verified domain
    adminEmail: "aravind.bandaru@appleinteriors.in",
    apiKey: process.env.RESEND_API_KEY || '' // Moved to environment variable
};

// Check if API key is configured
if (!RESEND_CONFIG.apiKey) {
    console.warn('RESEND_API_KEY is not set in environment variables');
}

// Initialize contact form when the page loads
document.addEventListener("DOMContentLoaded", function() {
    initializeContactForm();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", handleContactFormSubmission);
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
    const submitButton = event.target.querySelector("button[type=\"submit\"]");
    const originalText = submitButton.textContent;
    submitButton.innerHTML = "<span class=\"spinner\"></span> Sending...";
    submitButton.disabled = true;

    try {
        // Send emails via serverless API
        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({ formData: formObject })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showFormStatus("success", `Thank you ${formObject.name}! We have received your message and will get back to you within 24 hours.`);
            event.target.reset();

            // Optional: Send to WhatsApp as backup
            setTimeout(() => {
                if (confirm("Would you like to continue this conversation on WhatsApp for faster response?")) {
                    const whatsappMessage = createWhatsAppMessage(formObject);
                    const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
                    window.open(whatsappUrl, "_blank");
                }
            }, 2000);
        } else {
            throw new Error(result.error || "Failed to send emails");
        }

    } catch (error) {
        console.error("Email submission error:", error);

        // Check if it is a server configuration error
        if (error.message && error.message.includes("configuration error")) {
            showFormStatus("error", "Our email system is currently experiencing technical difficulties. Please try the WhatsApp option below or call us directly.");
        } else {
            // Fallback: Show message and redirect to WhatsApp
            showFormStatus("warning", `Thank you ${formObject.name}! We have received your information but could not send a confirmation email. For immediate assistance, please use WhatsApp.`);
        }

        setTimeout(() => {
            const whatsappMessage = createWhatsAppMessage(formObject);
            const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, "_blank");
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
        showFormStatus("error", "Please fill in all required fields (Name, Email, Phone).");
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormStatus("error", "Please enter a valid email address.");
        return false;
    }
    
    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    const cleanPhone = phone.replace(/\s|-/g, "");
    if (!phoneRegex.test(cleanPhone)) {
        showFormStatus("error", "Please enter a valid phone number.");
        return false;
    }
    
    return true;
}

// Create WhatsApp message from form data
function createWhatsAppMessage(formData) {
    const { name, email, phone, type, location, budget, message } = formData;
    
    let whatsappMessage = `Hi, I am ${name}. I am interested in interior design services.\n\n`;
    whatsappMessage += ` Email: ${email}\n`;
    whatsappMessage += ` Phone: ${phone}\n`;
    
    if (type) {
        whatsappMessage += ` Property Type: ${type}\n`;
    }
    
    if (location) {
        whatsappMessage += ` Location: ${location}\n`;
    }
    
    if (budget) {
        whatsappMessage += ` Budget: ${budget}\n`;
    }
    
    if (message) {
        whatsappMessage += `\n Message: ${message}\n`;
    }
    
    whatsappMessage += `\nPlease contact me for more details. Thank you!`;
    
    return whatsappMessage;
}

// Show form status messages
function showFormStatus(type, message) {
    const statusDiv = document.getElementById("form-status");
    if (!statusDiv) return;
    
    // Set appropriate styling based on type
    let bgColor, textColor, borderColor;
    switch (type) {
        case "success":
            bgColor = "bg-green-50";
            textColor = "text-green-800";
            borderColor = "border-green-200";
            break;
        case "error":
            bgColor = "bg-red-50";
            textColor = "text-red-800";
            borderColor = "border-red-200";
            break;
        case "warning":
            bgColor = "bg-yellow-50";
            textColor = "text-yellow-800";
            borderColor = "border-yellow-200";
            break;
        default:
            bgColor = "bg-blue-50";
            textColor = "text-blue-800";
            borderColor = "border-blue-200";
    }
    
    // Update status element
    statusDiv.className = `p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} mb-4 transition-all duration-300`;
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
    statusDiv.classList.remove("hidden");
    
    // Auto-hide after 8 seconds
    const hideTimeout = setTimeout(() => {
        statusDiv.classList.add("opacity-0");
        setTimeout(() => {
            statusDiv.classList.add("hidden");
            statusDiv.classList.remove("opacity-0");
        }, 300);
    }, 8000);
    
    // Clear previous timeout if it exists
    if (window.statusTimeout) {
        clearTimeout(window.statusTimeout);
    }
    window.statusTimeout = hideTimeout;
    
    // Scroll to status message smoothly
    setTimeout(() => {
        statusDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
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
    showFormStatus("success", `Thank you ${formObject.name}! We will contact you soon via WhatsApp or phone.`);

    // Create WhatsApp message and open
    setTimeout(() => {
        const whatsappMessage = createWhatsAppMessage(formObject);
        const whatsappUrl = `https://wa.me/919603960337?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
    }, 2000);

    // Reset form
    event.target.reset();
}

// Utility function to check if Resend API is properly configured
function isResendConfigured() {
    // We do not check for API key here as it is now handled server-side
    return true;
}

// Export functions for use in other scripts
window.ContactForm = {
    handleSubmission: handleContactFormSubmission,
    handleFallback: handleContactFormFallback,
    validateForm: validateForm,
    showStatus: showFormStatus,
    isConfigured: isResendConfigured
};
