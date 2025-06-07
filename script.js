 // --- Preloader JavaScript ---
       window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                // Delay by 1 second before fading out
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    preloader.addEventListener('transitionend', () => preloader.remove());
                }, 2000); // 1000 ms = 1 second delay
            }
        });

        // --- Custom Cursor JavaScript ---
        const customCursor = document.querySelector('.custom-cursor');
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .card-base, .hamburger-menu');

        document.addEventListener('mousemove', e => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                customCursor.classList.add('hovered');
            });
            element.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hovered');
            });
        });

        // --- Scroll Progress Bar JavaScript ---
        const scrollProgress = document.getElementById('scroll-progress');

        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        });

        // --- Particle Background JavaScript ---
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 150; // Even more particles
        const particleSize = 2.8; // Slightly larger particles
        const particleSpeed = 0.8; // Slightly faster particles
        const connectDistance = 150; // Increased connection distance
        const particleTrailLength = 7; // Longer trails

        // Resize canvas to fill window
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial resize

        // Particle class
        class Particle {
            constructor(x, y) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.size = Math.random() * particleSize + 1;
                this.speedX = (Math.random() * 2 - 1) * particleSpeed;
                this.speedY = (Math.random() * 2 - 1) * particleSpeed;
                this.history = [{ x: this.x, y: this.y }];
                // Define a fixed set of neon colors for particles
                const neonColors = ["#00e6e6", "#a020f0", "#ff00ff", "#00ffff"]; // Cyan, Purple, Magenta, Aqua
                this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off walls
                if (this.x > canvas.width || this.x < 0) {
                    this.speedX *= -1;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.speedY *= -1;
                }

                // Keep track of history for trail effect
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > particleTrailLength) {
                    this.history.shift();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Draw trail
                for (let i = 0; i < this.history.length; i++) {
                    const pos = this.history[i];
                    const alpha = (i / this.history.length) * 0.7; // Fade out trail
                    // Use a slightly transparent version of the particle's color for the trail
                    const colorParts = this.color.match(/\w\w/g).map(c => parseInt(c, 16));
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, this.size * (i / this.history.length), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, ${alpha})`;
                    ctx.fill();
                }
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        // Animate particles
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas
            // Optimize by clearing only necessary area if particle trails are not too long and dense.
            // For dense trails like this, full clear is simpler and often performant enough.

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();

                // Connect particles
                for (let j = i; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

                    if (distance < connectDistance) {
                        ctx.beginPath();
                        // Use a blend of primary/secondary colors for connections, or a fixed neon color
                        ctx.strokeStyle = `rgba(0, 230, 230, ${0.5 - (distance / (connectDistance * 2))})`; // Cyan with fading opacity
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // --- Typing Effect for Hero Subtitle ---
        const heroSubtitle = document.getElementById('hero-subtitle');
        const phrases = ["Frontend Developer", "UI/UX Designer", "Web Animator", "Interactive Coder"]; // Frontend-focused phrases
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 60;
        const pauseBeforeDelete = 1500;
        const pauseBeforeType = 500;

        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                heroSubtitle.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                heroSubtitle.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = typingSpeed;
            if (isDeleting) {
                speed = deletingSpeed;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                speed = pauseBeforeDelete;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = pauseBeforeType;
            }

            setTimeout(typeWriter, speed);
        }

        document.addEventListener('DOMContentLoaded', () => {
            typeWriter();

            // Intersection Observer for Section Fade-in
            const sections = document.querySelectorAll('section');
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2 // Trigger when 20% of the section is visible
            };

            const sectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target); // Stop observing once faded in
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                sectionObserver.observe(section);
            });
        });

        // --- Back to Top Button ---
        const backToTopButton = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling down 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // --- Mobile Navigation Toggle ---
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');

        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile nav when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // --- Contact Form Submission (Example - replace with actual backend integration) ---
        const contactForm = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMessage.textContent = 'Sending message...';
            formMessage.classList.remove('hidden', 'text-green-500', 'text-red-500');
            formMessage.classList.add('block', 'text-primary-color');

            // Simulate API call
            try {
                // In a real application, you'd use fetch or XMLHttpRequest here
                // await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         name: document.getElementById('name').value,
                //         email: document.getElementById('email').value,
                //         message: document.getElementById('message').value,
                //     })
                // });
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

                formMessage.textContent = 'Message sent successfully!';
                formMessage.classList.remove('text-primary-color');
                formMessage.classList.add('text-green-500');
                contactForm.reset();
            } catch (error) {
                formMessage.textContent = 'Failed to send message. Please try again later.';
                formMessage.classList.remove('text-primary-color');
                formMessage.classList.add('text-red-500');
                console.error('Form submission error:', error);
            } finally {
                formMessage.classList.remove('hidden');
            }
        });

        // --- Copy Email to Clipboard ---
        const emailAddressSpan = document.getElementById('email-address');
        const copyEmailBtn = document.getElementById('copy-email-btn');

        copyEmailBtn.addEventListener('click', () => {
            const email = emailAddressSpan.textContent.trim();
            navigator.clipboard.writeText(email)
                .then(() => {
                    const originalText = copyEmailBtn.innerHTML;
                    copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyEmailBtn.classList.add('bg-green-600', 'hover:bg-green-700'); // Add success styling
                    setTimeout(() => {
                        copyEmailBtn.innerHTML = originalText;
                        copyEmailBtn.classList.remove('bg-green-600', 'hover:bg-green-700'); // Revert styling
                    }, 2000); // Revert after 2 seconds
                })
                .catch(err => {
                    console.error('Failed to copy email: ', err);
                    // Fallback for older browsers or if permission is denied
                    const tempInput = document.createElement('textarea');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);

                    const originalText = copyEmailBtn.innerHTML;
                    copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyEmailBtn.classList.add('bg-green-600', 'hover:bg-green-700'); // Add success styling
                    setTimeout(() => {
                        copyEmailBtn.innerHTML = originalText;
                        copyEmailBtn.classList.remove('bg-green-600', 'hover:bg-green-700'); // Revert styling
                    }, 2000); // Revert after 2 seconds
                });
        });
