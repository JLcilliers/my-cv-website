// Animate timeline items on scroll
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    timelineObserver.observe(item);
});

// Animate project cards on scroll
const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1
});

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    projectObserver.observe(card);
});

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // For now, just show an alert
    // In production, you'd send this to a backend service
    alert(`Thank you for your message! I'll get back to you soon.\n\nName: ${name}\nEmail: ${email}`);
    
    // Reset form
    contactForm.reset();
    
    // Optional: Add a success message
    const button = contactForm.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Message Sent!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 3000);
});

// Smooth Parallax Effects
const heroSection = document.querySelector('.hero');
const heroContainer = document.querySelector('.hero-container');
const floatingElements = document.querySelectorAll('.floating-element');
const bgLayers = document.querySelectorAll('.hero-bg-layer');
const parallaxElements = document.querySelectorAll('[data-parallax]');

// Mouse movement parallax
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Smooth animation loop
function animateParallax() {
    // Smooth easing
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;
    
    // Apply parallax to background layers
    bgLayers.forEach((layer, index) => {
        const speed = (index + 1) * 10;
        layer.style.transform = `translate(${targetX * speed}px, ${targetY * speed}px) scale(1.1)`;
    });
    
    // Apply parallax to floating elements
    floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 15;
        element.style.transform = `translate(${targetX * speed}px, ${targetY * speed}px) rotate(${targetX * 5}deg)`;
    });
    
    // Subtle parallax on hero content
    if (heroContainer) {
        heroContainer.style.transform = `translate(${targetX * 5}px, ${targetY * 5}px)`;
    }
    
    requestAnimationFrame(animateParallax);
}
animateParallax();

// Scroll-based parallax
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY;
    
    // Parallax for hero section elements
    if (scrollY < window.innerHeight) {
        parallaxElements.forEach((element) => {
            const speed = element.dataset.parallax === 'title' ? 0.5 : 
                         element.dataset.parallax === 'subtitle' ? 0.3 : 
                         element.dataset.parallax === 'buttons' ? 0.2 : 0.1;
            
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        // Fade out hero on scroll
        const opacity = 1 - (scrollY / window.innerHeight);
        heroContainer.style.opacity = Math.max(0, opacity);
    }
    
    lastScrollY = scrollY;
});

// Smooth scroll to sections
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

// Add viewport-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Special handling for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Skill bars animation
const skillsSection = document.querySelector('.skills');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const skill = bar.getAttribute('data-skill');
                    bar.style.width = skill + '%';
                }, index * 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});