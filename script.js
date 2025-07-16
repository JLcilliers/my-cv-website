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

// Light Speed Space Effect
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star class
class Star {
    constructor() {
        this.x = Math.random() * canvas.width - canvas.width / 2;
        this.y = Math.random() * canvas.height - canvas.height / 2;
        this.z = Math.random() * 1000;
        this.prevX = this.x;
        this.prevY = this.y;
    }

    update(speed) {
        this.prevX = this.x / this.z;
        this.prevY = this.y / this.z;
        this.z -= speed;
        
        if (this.z <= 0) {
            this.x = Math.random() * canvas.width - canvas.width / 2;
            this.y = Math.random() * canvas.height - canvas.height / 2;
            this.z = 1000;
            this.prevX = this.x / this.z;
            this.prevY = this.y / this.z;
        }
    }

    draw() {
        const x = this.x / this.z;
        const y = this.y / this.z;
        const px = this.prevX;
        const py = this.prevY;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw star trail
        ctx.beginPath();
        ctx.moveTo(px + centerX, py + centerY);
        ctx.lineTo(x + centerX, y + centerY);
        
        // Star gets brighter as it gets closer
        const opacity = 1 - this.z / 1000;
        const size = (1 - this.z / 1000) * 2;
        
        ctx.strokeStyle = `rgba(224, 255, 38, ${opacity})`;
        ctx.lineWidth = size;
        ctx.stroke();
        
        // Draw star point
        ctx.beginPath();
        ctx.arc(x + centerX, y + centerY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
}

// Create stars
const stars = [];
for (let i = 0; i < 800; i++) {
    stars.push(new Star());
}

// Animation
let speed = 2;
let targetSpeed = 2;

// Speed up on mouse move
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    targetSpeed = 2 + (mouseX + mouseY) * 8;
});

// Animate
function animate() {
    // Fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Smooth speed transition
    speed += (targetSpeed - speed) * 0.05;
    
    // Update and draw stars
    stars.forEach(star => {
        star.update(speed);
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Add perspective tilt to hero content on mouse move
const heroContainer = document.querySelector('.hero-container');
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    
    heroContainer.style.transform = `rotateY(${mouseX}deg) rotateX(${-mouseY}deg)`;
});

// Reset transform on mouse leave
document.addEventListener('mouseleave', () => {
    heroContainer.style.transform = 'rotateY(0deg) rotateX(0deg)';
});

// Remove parallax effect to fix scrolling issue
// Hero section will now scroll normally

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