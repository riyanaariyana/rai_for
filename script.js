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

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

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
            }
        });
    });

    /* =========================
       SCROLL ANIMATION
    ========================= */
    const animatedElements = document.querySelectorAll(
        '.service-card, .fleet-item, .feature, .stat, .about-text, .contact-info'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });

    /* =========================
       SCROLL TO TOP BUTTON
    ========================= */
    const scrollBtn = document.getElementById("scrollTopBtn");

    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });

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
        let target = parseInt(counter.innerText.replace(/\D/g, ''));
        let current = 0;
        let increment = target / 100;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.innerText = Math.floor(current) + (counter.innerText.includes('%') ? '%' : '+');
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + (counter.innerText.includes('%') ? '%' : '+');
            }
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        });

        counterObserver.observe(counter);
    });

    /* =========================
       PARALLAX HERO
    ========================= */
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        if (hero) {
            let offset = window.scrollY;
            hero.style.transform = `translateY(${offset * 0.3}px)`;
        }
    });

    /* =========================
       CONTACT FORM (EmailJS)
    ========================= */
    const quoteForm = document.getElementById("quoteForm");

    if (quoteForm) {
        quoteForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = this.name.value.trim();
            const email = this.email.value.trim();
            const message = this.message.value.trim();

            if (!name || !email || !message) {
                showNotification("Please fill all fields ❌", "error");
                return;
            }

            if (!validateEmail(email)) {
                showNotification("Invalid email ❌", "error");
                return;
            }

            const btn = this.querySelector("button");
            const originalText = btn.innerText;

            btn.innerText = "Sending...";
            btn.disabled = true;

            emailjs.sendForm("service_p7qyvbj", ""template_51nhbma", this)
            .then(() => {
                showNotification("Message sent successfully ✅", "success");
                this.reset();
            })
            .catch((error) => {
                showNotification("Error sending message ❌", "error");
                console.log(error);
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

});

/* =========================
   EMAIL VALIDATION
========================= */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* =========================
   EMAILJS INIT
========================= */
(function(){
    emailjs.init("gCL2GdMeQnoH5hXUR"); // Public Key
})();

/* =========================
   NOTIFICATION SYSTEM
========================= */
function showNotification(message, type = "info") {
    const notification = document.createElement("div");

    notification.className = "notification";
    notification.innerText = message;

    notification.style.position = "fixed";
    notification.style.top = "100px";
    notification.style.right = "20px";
    notification.style.padding = "15px 20px";
    notification.style.borderRadius = "10px";
    notification.style.color = "#fff";
    notification.style.zIndex = "9999";
    notification.style.transition = "0.3s ease";
    notification.style.transform = "translateX(300px)";

    if (type === "success") {
        notification.style.background = "#28a745";
    } else if (type === "error") {
        notification.style.background = "#dc3545";
    } else {
        notification.style.background = "#2c5aa0";
    }

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = "translateX(0)";
    });

    setTimeout(() => {
        notification.style.transform = "translateX(300px)";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
