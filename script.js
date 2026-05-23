/* ===================================
   YOUNG HOUSE BARBERSHOP
   Interactive JavaScript
   Particles + Animations + Scroll
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // PARTICLE SYSTEM - Barbershop Tools
    // ===================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse for interactive particles
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Barber tool shapes as path drawing functions
    const drawScissors = (ctx, x, y, size, rotation, alpha) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        
        // Left blade
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.8, -size * 0.6);
        ctx.stroke();
        
        // Right blade
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.8, size * 0.6);
        ctx.stroke();
        
        // Handles
        ctx.beginPath();
        ctx.arc(size * 0.45, -size * 0.25, size * 0.22, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(size * 0.45, size * 0.25, size * 0.22, 0, Math.PI * 2);
        ctx.stroke();
        
        // Center pivot
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(179, 128, 255, ${alpha})`;
        ctx.fill();
        
        ctx.restore();
    };

    const drawComb = (ctx, x, y, size, rotation, alpha) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        
        // Spine
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, 0);
        ctx.lineTo(size * 0.5, 0);
        ctx.stroke();
        
        // Teeth
        const teethCount = 7;
        const spacing = size / teethCount;
        for (let i = 0; i < teethCount; i++) {
            const tx = -size * 0.4 + i * spacing * 0.85;
            ctx.beginPath();
            ctx.moveTo(tx, 0);
            ctx.lineTo(tx, -size * 0.45);
            ctx.stroke();
        }
        
        ctx.restore();
    };

    const drawRazor = (ctx, x, y, size, rotation, alpha) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(179, 128, 255, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        
        // Handle
        ctx.beginPath();
        const hx = -size * 0.15, hy = -size * 0.1, hw = size * 0.3, hh = size * 0.7;
        ctx.moveTo(hx + 3, hy);
        ctx.lineTo(hx + hw - 3, hy);
        ctx.quadraticCurveTo(hx + hw, hy, hx + hw, hy + 3);
        ctx.lineTo(hx + hw, hy + hh - 3);
        ctx.quadraticCurveTo(hx + hw, hy + hh, hx + hw - 3, hy + hh);
        ctx.lineTo(hx + 3, hy + hh);
        ctx.quadraticCurveTo(hx, hy + hh, hx, hy + hh - 3);
        ctx.lineTo(hx, hy + 3);
        ctx.quadraticCurveTo(hx, hy, hx + 3, hy);
        ctx.closePath();
        ctx.stroke();
        
        // Blade
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, -size * 0.1);
        ctx.lineTo(size * 0.3, -size * 0.1);
        ctx.lineTo(size * 0.25, -size * 0.35);
        ctx.lineTo(-size * 0.25, -size * 0.35);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    };

    const drawBarberPole = (ctx, x, y, size, rotation, alpha) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        
        // Pole
        ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
        ctx.beginPath();
        const px = -size * 0.12, py = -size * 0.5, pw = size * 0.24, ph = size, pr = 4;
        ctx.moveTo(px + pr, py);
        ctx.lineTo(px + pw - pr, py);
        ctx.quadraticCurveTo(px + pw, py, px + pw, py + pr);
        ctx.lineTo(px + pw, py + ph - pr);
        ctx.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
        ctx.lineTo(px + pr, py + ph);
        ctx.quadraticCurveTo(px, py + ph, px, py + ph - pr);
        ctx.lineTo(px, py + pr);
        ctx.quadraticCurveTo(px, py, px + pr, py);
        ctx.closePath();
        ctx.stroke();
        
        // Stripes
        ctx.strokeStyle = `rgba(179, 128, 255, ${alpha * 0.6})`;
        for (let i = 0; i < 4; i++) {
            const sy = -size * 0.35 + i * size * 0.22;
            ctx.beginPath();
            ctx.moveTo(-size * 0.12, sy);
            ctx.lineTo(size * 0.12, sy + size * 0.15);
            ctx.stroke();
        }
        
        ctx.restore();
    };

    const drawDroplet = (ctx, x, y, size, rotation, alpha) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        
        // Simple glowing dot
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
        gradient.addColorStop(0, `rgba(179, 128, 255, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(147, 51, 234, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(124, 58, 237, 0)`);
        
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.restore();
    };

    const drawStar = (ctx, x, y, size, rotation, alpha) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(245, 197, 66, ${alpha * 0.7})`;
        ctx.lineWidth = 1;
        
        const s = size * 0.2;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(-s * 0.7, -s * 0.7);
        ctx.lineTo(s * 0.7, s * 0.7);
        ctx.moveTo(s * 0.7, -s * 0.7);
        ctx.lineTo(-s * 0.7, s * 0.7);
        ctx.stroke();
        
        ctx.restore();
    };

    const shapes = [drawScissors, drawComb, drawRazor, drawBarberPole, drawDroplet, drawDroplet, drawStar, drawDroplet];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 18 + 10;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.15;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.008;
            this.alpha = Math.random() * 0.2 + 0.05;
            this.targetAlpha = this.alpha;
            this.drawFn = shapes[Math.floor(Math.random() * shapes.length)];
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.parallaxFactor = Math.random() * 0.5 + 0.5;
        }

        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            
            // Pulse alpha
            this.targetAlpha = (Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.5 + 0.5) * 0.2 + 0.03;
            this.alpha += (this.targetAlpha - this.alpha) * 0.05;

            // Mouse interaction - particles gently pushed away
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
                this.alpha = Math.min(this.alpha + 0.05, 0.4);
            }

            // Wrap around
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
        }

        draw(time) {
            this.drawFn(ctx, this.x, this.y, this.size, this.rotation, this.alpha);
        }
    }

    // Determine particle count based on screen size
    function getParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        if (area < 400000) return 18;  // small mobile
        if (area < 800000) return 28;  // mobile/tablet
        return 45; // desktop
    }

    function initParticles() {
        particles = [];
        const count = getParticleCount();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    let startTime = Date.now();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const time = (Date.now() - startTime) / 1000;

        particles.forEach(p => {
            p.update(time);
            p.draw(time);
        });

        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Reinit on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initParticles();
        }, 300);
    });


    // ===================================
    // NAVBAR
    // ===================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);


    // ===================================
    // SCROLL REVEAL ANIMATIONS
    // ===================================
    function addRevealClasses() {
        // Section headers
        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('reveal');
        });

        // Card grids
        document.querySelectorAll('.about-grid, .services-grid, .testimonials-track, .gallery-grid').forEach(el => {
            el.classList.add('reveal-stagger');
        });

        // Contact
        document.querySelectorAll('.contact-info, .contact-map').forEach(el => {
            el.classList.add('reveal');
        });

        // CTA
        document.querySelectorAll('.cta-card').forEach(el => {
            el.classList.add('reveal');
        });
    }

    addRevealClasses();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        revealObserver.observe(el);
    });


    // ===================================
    // COUNTER ANIMATION
    // ===================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;
        counterAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.count);
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const startTime = Date.now();

            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                
                if (isFloat) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isFloat) {
                        stat.textContent = target.toFixed(1);
                    } else {
                        stat.textContent = target + '+';
                    }
                }
            }
            
            updateCounter();
        });
    }

    // Trigger counter when hero stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);


    // ===================================
    // SMOOTH ANCHOR SCROLLING (fallback)
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ===================================
    // MAGNETIC BUTTON EFFECT (Desktop)
    // ===================================
    if (window.innerWidth > 900) {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }


    // ===================================
    // TILT EFFECT ON CARDS (Desktop)
    // ===================================
    if (window.innerWidth > 900) {
        document.querySelectorAll('.service-card, .about-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const tiltX = (y - 0.5) * 8;
                const tiltY = (x - 0.5) * -8;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }


    // ===================================
    // GALLERY HOVER GLOW EFFECT
    // ===================================
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--glow-x', `${x}px`);
            item.style.setProperty('--glow-y', `${y}px`);
        });
    });


    // ===================================
    // PARALLAX SCROLL ON ORBS
    // ===================================
    const orbs = document.querySelectorAll('.orb');
    
    function parallaxOrbs() {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = [0.03, 0.05, 0.02, 0.04][i];
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', parallaxOrbs, { passive: true });


    // ===================================
    // PRELOADER REMOVAL
    // ===================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Fallback: ensure body is interactive
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 3000);

});
