
window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("welcome-screen").classList.add("fade-out"), 250);

    const colorThief = new ColorThief();
    const toggle = document.getElementById("mode-toggle");
    const body = document.body;
    const bgImage = document.getElementById("bg-image");
    const bottomSentinel = document.getElementById("bottom-sentinel");
    let isDark = true;
    let isEndActive = false;

    const isDarkMode = () => !body.classList.contains("light-mode");

    function initParticles(color) {
        if (window.pJSDom?.length) {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            window.pJSDom = [];
        }

        particlesJS("nav-bg", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: color },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: color,
                    opacity: 0.4,
                    width: 1,
                },
                move: { enable: true, speed: 2 },
            },
            interactivity: {
                events: { onhover: { enable: true, mode: "repulse" } },
                modes: { repulse: { distance: 100 } },
            },
            retina_detect: true,
        });
    }

    initParticles("#ffffff");

    toggle.addEventListener("click", () => {
        isDark = !isDark;
        body.classList.toggle("light-mode", !isDark);
        toggle.innerHTML = isDark ? "☀️" : "🌙";
        initParticles(isDark ? "#ffffff" : "#000000");
    });

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a[href^='#']");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("visible", entry.isIntersecting);
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll(".scroll-section").forEach((section) => observer.observe(section));

    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("nav-links").classList.toggle("show");
    });

    document.querySelectorAll(".project").forEach((project) => {
        const wrapper = project.querySelector(".project-preview-wrapper");
        const img = project.querySelector(".project-preview");
        if (!wrapper || !img) return;

        if (img.complete) {
            img.dataset.loaded = "true";
        } else {
            img.addEventListener("load", () => (img.dataset.loaded = "true"));
        }

        project.addEventListener("mouseenter", () => {
            const maxScroll = img.scrollHeight - wrapper.offsetHeight;
            if (maxScroll > 0) {
                img.style.transition = "transform 5s linear 0.5s";
                img.style.transform = `translateY(-${maxScroll}px)`;
            }

            if (img.dataset.loaded === "true") {
                try {
                    const [r, g, b] = colorThief.getColor(img);
                    project.style.boxShadow = `0 0 30px 10px rgb(${r}, ${g}, ${b})`;
                } catch (e) {
                    console.warn("Color extraction failed", e);
                }
            }
        });

        project.addEventListener("mouseleave", () => {
            img.style.transition = "none";
            img.style.transform = "translateY(0)";
            void img.offsetWidth;
            img.style.transition = "transform 5s linear 0.5s";
            project.style.boxShadow = "0 0 0 transparent";
        });
    });

    if (window.innerWidth < 924) {
        const shownHints = new WeakSet();

        const projectObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        const project = entry.target;
                        if (shownHints.has(project)) return;

                        const hasPreview = project.querySelector(".project-preview-wrapper");
                        const hasSite = project.querySelector(".project-links a[href*='http']");
                        const hint = project.querySelector(".tap-to-preview");

                        if (hasPreview && hasSite && hint) {
                            project.classList.add("show-tap-hint");
                            setTimeout(() => project.classList.remove("show-tap-hint"), 2000);
                            shownHints.add(project);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        document.querySelectorAll(".project").forEach((project) => projectObserver.observe(project));
    }

    document.querySelector("a[href*='drive.google.com']").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("cv-overlay").style.display = "flex";
    });

    document.getElementById("cv-close").addEventListener("click", () => {
        document.getElementById("cv-overlay").style.display = "none";
    });

    document.querySelector(".cv-viewer").addEventListener("click", (e) => e.stopPropagation());
    document.getElementById("cv-overlay").addEventListener("click", () => {
        document.getElementById("cv-overlay").style.display = "none";
    });

    const bottomObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isEndActive) {
                    isEndActive = true;
                    bgImage.style.opacity = "0";
                    setTimeout(() => {
                        bgImage.src = isDarkMode()
                            ? "./Assets/BackgroundDarkEnd.jpg"
                            : "./Assets/BackgroundLightEnd.jpg";
                        body.classList.add("bg-end");
                        bgImage.style.opacity = "1";
                    }, 400);
                } else if (!entry.isIntersecting && isEndActive) {
                    isEndActive = false;
                    bgImage.style.opacity = "0";
                    setTimeout(() => {
                        bgImage.src = "./Assets/Background.jpg";
                        body.classList.remove("bg-end");
                        bgImage.style.opacity = "1";
                    }, 400);
                }
            });
        },
        { rootMargin: "0px 0px 350px 0px", threshold: 0 }
    );

    bottomObserver.observe(bottomSentinel);
});