// Console Cleaner for Production
// This script suppresses unwanted console messages in production environment

(function() {
    'use strict';
    
    // Only run in production (not localhost)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname.includes('localhost')) {
        return; // Don't suppress logs in development
    }
    
    // Store original console methods
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
        trace: console.trace
    };
    
    // List of keywords to suppress
    const suppressKeywords = [
        'google-reviews',
        'gmb-reviews',
        'API URL',
        'Initializing',
        'Successfully loaded',
        'These are authentic',
        'Source: Google My Business',
        'Attempting to',
        'Error while trying',
        'tailwindcss',
        'Production',
        'Business:',
        'Loading customer testimonials',
        'Fetching',
        'Response:',
        'Request:',
        'HTTP',
        'XMLHttpRequest',
        'fetch',
        'CORS',
        'Network',
        'Failed to load',
        'Connection',
        'Timeout'
    ];
    
    // Function to check if message should be suppressed
    function shouldSuppress(args) {
        const message = args.join(' ').toLowerCase();
        return suppressKeywords.some(keyword => 
            message.includes(keyword.toLowerCase())
        );
    }
    
    // Override console methods
    console.log = function(...args) {
        if (!shouldSuppress(args)) {
            originalConsole.log.apply(console, args);
        }
    };
    
    console.warn = function(...args) {
        if (!shouldSuppress(args)) {
            originalConsole.warn.apply(console, args);
        }
    };
    
    console.error = function(...args) {
        if (!shouldSuppress(args)) {
            originalConsole.error.apply(console, args);
        }
    };
    
    console.info = function(...args) {
        if (!shouldSuppress(args)) {
            originalConsole.info.apply(console, args);
        }
    };
    
    console.debug = function(...args) {
        if (!shouldSuppress(args)) {
            originalConsole.debug.apply(console, args);
        }
    };
    
    console.trace = function(...args) {
        if (!shouldSuppress(args)) {
            originalConsole.trace.apply(console, args);
        }
    };
    
    // Suppress network errors
    const originalFetch = window.fetch;
    if (originalFetch) {
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).catch(error => {
                // Only log non-API related errors
                const errorMessage = error.message || '';
                if (!suppressKeywords.some(keyword => 
                    errorMessage.toLowerCase().includes(keyword.toLowerCase()))) {
                    originalConsole.error('Network error:', error);
                }
                throw error;
            });
        };
    }
    
    // Suppress XMLHttpRequest errors
    const originalXHR = window.XMLHttpRequest;
    if (originalXHR) {
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOnError = xhr.onerror;
            
            xhr.onerror = function(event) {
                // Suppress API-related XHR errors
                const url = xhr.responseURL || '';
                if (!suppressKeywords.some(keyword => 
                    url.toLowerCase().includes(keyword.toLowerCase()))) {
                    if (originalOnError) {
                        originalOnError.call(this, event);
                    }
                }
            };
            
            return xhr;
        };
    }
    
    // Suppress window errors for specific scripts
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        const errorMessage = message || '';
        const sourceFile = source || '';
        
        // Suppress errors from specific files or containing specific keywords
        if (suppressKeywords.some(keyword => 
            errorMessage.toLowerCase().includes(keyword.toLowerCase()) ||
            sourceFile.toLowerCase().includes(keyword.toLowerCase()))) {
            return true; // Prevent default error handling
        }
        
        // Call original error handler for other errors
        if (originalOnError) {
            return originalOnError.call(this, message, source, lineno, colno, error);
        }
        
        return false;
    };
    
    // Clean console on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Clear any existing console messages after a short delay
        setTimeout(() => {
            if (console.clear && typeof console.clear === 'function') {
                console.clear();
            }
        }, 1000);
    });
    
})();
