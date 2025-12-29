// ============================================
// FASHION STYLIST WEBSITE - MAIN JAVASCRIPT
// ============================================

// Loading Animation
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link (but not dropdown menu items)
    const navLinks = document.querySelectorAll('.nav-menu > li > a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only close if it's not a dropdown parent link
            if (window.innerWidth <= 1024) {
                const isDropdownLink = this.parentElement.classList.contains('nav-dropdown');
                // Don't close menu if it's a dropdown link (handled separately)
                if (!isDropdownLink) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Keep mobile menu open when clicking dropdown menu items
    // This allows users to access multiple dropdown options without reopening the menu
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close the menu when clicking dropdown items
            // The menu will close naturally when navigating to a new page
            // or when clicking outside/on a top-level link
        });
    });

    // Close mobile menu when clicking outside (but not on dropdown items)
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            const isDropdownItem = event.target.closest('.dropdown-menu a');
            const isDropdownParent = event.target.closest('.nav-dropdown > a');
            
            // Don't close if clicking on dropdown items or dropdown parent
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target) && !isDropdownItem && !isDropdownParent) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (dropdownLink && dropdownMenu) {
            // For mobile, toggle dropdown on click
            if (window.innerWidth <= 1024) {
                dropdownLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        }
    });

    // Set active nav link based on current page
    setActiveNavLink();

    // Initialize lightbox if on portfolio page
    if (document.querySelector('.gallery-grid')) {
        initLightbox();
    }

    // Initialize filter buttons if on portfolio page
    if (document.querySelector('.filter-buttons')) {
        initFilterButtons();
    }

    // Form validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Smooth scroll for anchor links
    initSmoothScroll();
});

// Set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu > li > a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html') ||
            (currentPage === 'index2.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Lightbox functionality
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Filter buttons functionality
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Set initial transition styles
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category') || item.classList[1];
                if (filter === 'all' || item.classList.contains(filter) || itemCategory === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission
    showMessage('Thank you! Your message has been sent. We will get back to you soon.', 'success');
    form.reset();
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;

    if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    showMessage('Thank you for subscribing to our newsletter!', 'success');
    form.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border: 1px solid ${type === 'success' ? '#D4AF37' : '#ff4444'};
        background-color: ${type === 'success' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 68, 68, 0.1)'};
        color: ${type === 'success' ? '#D4AF37' : '#ff4444'};
        text-align: center;
    `;

    // Insert message after form
    const form = document.querySelector('#contact-form') || document.querySelector('#newsletter-form');
    if (form) {
        form.appendChild(messageEl);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll('.card, .testimonial-card, .gallery-item, section');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
});

