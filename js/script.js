
/* =========================================================
   JRH POWER GENERATORS
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       01. MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("mobileMenuToggle");
    const navigation = document.querySelector(".main-navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute("aria-expanded", isOpen);

            document.body.classList.toggle("menu-open", isOpen);

        });

        // Close menu when clicking outside

        document.addEventListener("click", function (event) {

            if (
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navigation.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                document.body.classList.remove("menu-open");

            }

        });

        // Close menu after clicking a navigation link

        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                if (window.innerWidth <= 768) {

                    navigation.classList.remove("active");
                    menuToggle.classList.remove("active");

                    menuToggle.setAttribute("aria-expanded", "false");

                    document.body.classList.remove("menu-open");

                }

            });

        });

    }


    /* =====================================================
       02. MOBILE DROPDOWN MENUS
    ===================================================== */

    const dropdowns = document.querySelectorAll(".nav-dropdown");

    dropdowns.forEach(function (dropdown) {

        const toggle = dropdown.querySelector(".dropdown-toggle");

        if (!toggle) return;

        toggle.setAttribute("aria-expanded", "false");

        toggle.addEventListener("click", function (event) {

            if (window.innerWidth <= 768) {

                event.preventDefault();

                const isOpen = dropdown.classList.toggle("open");

                toggle.setAttribute("aria-expanded", isOpen);

            }

        });

    });


    /* =====================================================
       03. STICKY HEADER
    ===================================================== */

    const header = document.getElementById("siteHeader");

    if (header) {

        let lastScroll = 0;

        function handleHeaderScroll() {

            const currentScroll = window.scrollY;

            if (currentScroll > 150) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

            lastScroll = currentScroll;

        }

        window.addEventListener("scroll", handleHeaderScroll, {
            passive: true
        });

        handleHeaderScroll();

    }


    /* =====================================================
       04. ANIMATED STATISTICS COUNTERS
    ===================================================== */

    const counters = document.querySelectorAll(".stat-item h3");

    const counterObserver = new IntersectionObserver(function (entries, observer) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                const counter = entry.target;

                const target = parseInt(
                    counter.textContent.replace(/[^0-9]/g, ""),
                    10
                );

                if (isNaN(target)) return;

                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {

                    const elapsed = currentTime - startTime;

                    const progress = Math.min(elapsed / duration, 1);

                    // Smooth ease-out animation

                    const easeOut = 1 - Math.pow(1 - progress, 4);

                    const currentValue = Math.floor(target * easeOut);

                    counter.textContent = "+" + currentValue;

                    if (progress < 1) {

                        requestAnimationFrame(updateCounter);

                    } else {

                        counter.textContent = "+" + target;

                    }

                }

                requestAnimationFrame(updateCounter);

                observer.unobserve(counter);

            }

        });

    }, {
        threshold: 0.5
    });

    counters.forEach(function (counter) {

        counterObserver.observe(counter);

    });


    /* =====================================================
       05. FAQ ACCORDION
    ===================================================== */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        const summary = item.querySelector("summary");

        if (!summary) return;

        summary.setAttribute("aria-expanded", item.open);

        summary.addEventListener("click", function () {

            // Allow only one FAQ to remain open

            faqItems.forEach(function (otherItem) {

                if (otherItem !== item) {

                    otherItem.open = false;

                    const otherSummary = otherItem.querySelector("summary");

                    if (otherSummary) {
                        otherSummary.setAttribute("aria-expanded", "false");
                    }

                }

            });

            // Wait for native details behaviour

            requestAnimationFrame(function () {

                summary.setAttribute("aria-expanded", item.open);

            });

        });

    });


    /* =====================================================
       06. SMOOTH SCROLLING
    ===================================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Update browser URL

                history.replaceState(null, "", targetId);

            }

        });

    });


    /* =====================================================
       07. CONTACT FORM
    ===================================================== */

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = contactForm.querySelector(
                'input[name="name"]'
            );

            const email = contactForm.querySelector(
                'input[name="email"]'
            );

            const phone = contactForm.querySelector(
                'input[name="phone"]'
            );

            const message = contactForm.querySelector(
                'textarea[name="message"]'
            );

            // Check required fields

            if (
                !name || !email || !phone || !message ||
                !name.value.trim() ||
                !email.value.trim() ||
                !phone.value.trim() ||
                !message.value.trim()
            ) {

                alert("Por favor, completa todos los campos.");

                return;

            }

            // Validate email

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value.trim())) {

                alert("Por favor, introduce un correo electrónico válido.");

                email.focus();

                return;

            }

            // Prepare email details

            const subject = encodeURIComponent(
                "Nueva consulta desde la página web de JRH Power Generators"
            );

            const body = encodeURIComponent(
                "Nueva consulta desde el sitio web:\n\n" +
                "Nombre: " + name.value.trim() + "\n" +
                "Correo electrónico: " + email.value.trim() + "\n" +
                "Teléfono: " + phone.value.trim() + "\n\n" +
                "Mensaje:\n" + message.value.trim()
            );

            const mailtoLink =
                "mailto:jrhgenerators@gmail.com" +
                "?subject=" + subject +
                "&body=" + body;

            // Open visitor's email application

            window.location.href = mailtoLink;

        });

    }


    /* =====================================================
       08. SCROLL REVEAL ANIMATIONS
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".intro-content, .intro-image, .feature-card, " +
        ".service-card, .solar-content, .solar-image, " +
        ".advantages-content, .advantages-image, " +
        ".about-content, .about-image, .reference-item"
    );

    const revealObserver = new IntersectionObserver(function (entries, observer) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(function (element) {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });


    /* =====================================================
       09. CURRENT YEAR IN FOOTER
    ===================================================== */

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }


    /* =====================================================
       10. CLOSE MOBILE MENU ON RESIZE
    ===================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 768) {

            if (navigation) {
                navigation.classList.remove("active");
            }

            if (menuToggle) {
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }

            dropdowns.forEach(function (dropdown) {

                dropdown.classList.remove("open");

                const toggle = dropdown.querySelector(".dropdown-toggle");

                if (toggle) {
                    toggle.setAttribute("aria-expanded", "false");
                }

            });

            document.body.classList.remove("menu-open");

        }

    });


    /* =====================================================
       11. REDUCED MOTION SUPPORT
    ===================================================== */

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

        document.documentElement.style.scrollBehavior = "auto";

    }

});
