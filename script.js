/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE NAVIGATION
    ========================= */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    /* =========================
       NAVBAR SCROLL EFFECT
    ========================= */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', throttle(() => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    }, 10));

    /* =========================
       SMOOTH SCROLL
    ========================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu on link click
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    /* =========================
       SCROLL ANIMATION
    ========================= */
    const animatedElements = document.querySelectorAll(
        '.service-card, .fleet-item, .feature, .stat, .about-text, .contact-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        observer.observe(el);
    });

    /* =========================
       SCROLL TO TOP BUTTON
    ========================= */
    const scrollBtn = document.getElementById("scrollTopBtn");

    if (scrollBtn) {
        window.addEventListener("scroll", throttle(() => {
            scrollBtn.style.opacity = window.scrollY > 300 ? "1" : "0";
            scrollBtn.style.visibility = window.scrollY > 300 ? "visible" : "hidden";
        }, 10));

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* =========================
       HERO COUNTERS
    ========================= */
    const counters = document.querySelectorAll('.stat h3');

    counters.forEach(counter => {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });

        counterObserver.observe(counter);
    });

    /* =========================
       PARALLAX HERO
    ========================= */
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }, 16));
    }

    /* =========================
       CONTACT FORM
    ========================= */
    const quoteForm = document.getElementById("quoteForm");

    if (quoteForm) {
        quoteForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Validation
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();

            if (!name || !email || !message) {
                showNotification("Please fill all fields ❌", "error");
                return;
            }

            if (!validateEmail(email)) {
                showNotification("Please enter a valid email ❌", "error");
                return;
            }

            // Show loading state
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;

            // EmailJS - FIXED TEMPLATE ID
            emailjs.sendForm('service_p7qyvbj', 'template_51nhbma', this)
                .then(() => {
                    showNotification("Message sent successfully! 🎉", "success");
                    this.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    showNotification("Failed to send message. Please try again. ❌", "error");
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});

/* =========================
   UTILITY FUNCTIONS
========================= */

/**
 * Throttle function to limit scroll event calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Email validation
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Animate counter numbers
 */
function animateCounter(counter) {
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
    let current = 0;
    const increment = target / (target > 100 ? 200 : 100);
    const suffix = counter.textContent.includes('%') ? '%' : '+';
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + suffix;
        }
    };
    
    updateCounter();
}

/* =========================
   EMAILJS INIT
========================= */
(function(){
    emailjs.init({
        publicKey: 'gCL2GdMeQnoH5hXUR'
    });
})();

/* =========================
   NOTIFICATION SYSTEM
========================= */
function showNotification(message, type = "info") {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification__close">&times;</button>
    `;

    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '9999',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        transform: 'translateX(400px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '350px'
    });

    // Type-specific backgrounds
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Close button
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        margin-left: 12px;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    });

    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');

    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        }
    }, 4000);
}
