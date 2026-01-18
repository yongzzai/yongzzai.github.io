var container = document.querySelector('.container');
var overlay = document.querySelector('.overlay');

// Check if device supports hover (desktop)
const canHover = window.matchMedia('(hover: hover)').matches;

if (canHover) {
    // Desktop hover effects
    container.addEventListener('mousemove', function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var rotateY = -1/5 * x + 20;
        var rotateX = 4/30 * y - 20;

        overlay.style = `background-position: ${x/5 + y/5}%; filter: opacity(${x/200}) brightness(1.2)`;
        
        container.style = `transform: perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseout', function() {
        overlay.style = 'filter: opacity(0)';
        container.style = 'transform: perspective(350px) rotateY(0deg) rotateX(0deg)';
    });
} else {
    // Mobile touch effects - simplified
    container.addEventListener('touchstart', function(e) {
        e.preventDefault();
        overlay.style = 'filter: opacity(0.3) brightness(1.1)';
        container.style = 'transform: perspective(350px) rotateY(5deg) rotateX(-5deg)';
    });
    
    container.addEventListener('touchend', function() {
        overlay.style = 'filter: opacity(0)';
        container.style = 'transform: perspective(350px) rotateY(0deg) rotateX(0deg)';
    });
}

// ==================== TEXT TYPING ANIMATION ====================
class TextType {
    constructor(element, options = {}) {
        this.element = element;
        this.textContent = element.querySelector('.text-type__content');
        this.cursor = element.querySelector('.text-type__cursor');
        
        this.options = {
            text: options.text || ['Hello World!'],
            typingSpeed: options.typingSpeed || 50,
            deletingSpeed: options.deletingSpeed || 30,
            pauseDuration: options.pauseDuration || 2000,
            initialDelay: options.initialDelay || 0,
            loop: options.loop !== undefined ? options.loop : true,
            ...options
        };
        
        this.textArray = Array.isArray(this.options.text) ? this.options.text : [this.options.text];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.displayedText = '';
        
        setTimeout(() => this.type(), this.options.initialDelay);
    }
    
    type() {
        const currentText = this.textArray[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Deleting
            this.displayedText = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            // Typing
            this.displayedText = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        this.textContent.textContent = this.displayedText;
        
        let typeSpeed = this.isDeleting ? this.options.deletingSpeed : this.options.typingSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            // Finished typing, pause before deleting
            if (!this.options.loop && this.currentTextIndex === this.textArray.length - 1) {
                return; // Stop if not looping and at the end
            }
            typeSpeed = this.options.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            // Finished deleting, move to next text
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
            typeSpeed = 500; // Small pause before typing next
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize text typing animation
document.addEventListener('DOMContentLoaded', function() {
    const textTypeElement = document.getElementById('text-type');
    if (textTypeElement) {
        new TextType(textTypeElement, {
            text: ['Welcome to yongzzai.com!', 'Good to See You!'],
            typingSpeed: 80,
            deletingSpeed: 40,
            pauseDuration: 2000,
            initialDelay: 500,
            loop: true
        });
    }
});
// ==================== END TEXT TYPING ====================

// Tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Content loader - load tab content from separate HTML files
    const contentFiles = {
        'tech': 'content/tech.html',
        'projects': 'content/projects.html',
        'conference': 'content/conference.html',
        'publication': 'content/publication.html',
        'teaching': 'content/teaching.html'
    };
    
    // Track loaded content to avoid reloading
    const loadedContent = {};
    
    // Function to load content into a tab pane
    async function loadTabContent(tabId) {
        if (loadedContent[tabId]) return; // Already loaded
        
        const pane = document.getElementById(tabId);
        const filePath = contentFiles[tabId];
        
        if (!pane || !filePath) return;
        
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const html = await response.text();
                pane.innerHTML = html;
                loadedContent[tabId] = true;
                
                // Re-attach abstract toggle listeners for publication tab
                if (tabId === 'publication') {
                    attachAbstractToggleListeners();
                }
                
                // Re-attach details toggle listeners for projects tab
                if (tabId === 'projects') {
                    attachDetailsToggleListeners();
                }
            }
        } catch (error) {
            console.error(`Failed to load content for ${tabId}:`, error);
        }
    }
    
    // Function to attach abstract toggle listeners
    function attachAbstractToggleListeners() {
        const abstractToggles = document.querySelectorAll('.abstract-toggle a');
        abstractToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const abstract = this.parentElement.nextElementSibling;
                
                if (abstract.classList.contains('show')) {
                    abstract.classList.remove('show');
                    this.textContent = 'Show Abstract';
                } else {
                    abstract.classList.add('show');
                    this.textContent = 'Hide Abstract';
                }
            });
        });
    }
    
    // Function to attach details toggle listeners for projects
    function attachDetailsToggleListeners() {
        const detailsToggles = document.querySelectorAll('.details-toggle a');
        detailsToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const details = this.parentElement.nextElementSibling;
                
                if (details.classList.contains('show')) {
                    details.classList.remove('show');
                    this.textContent = 'Show Details';
                } else {
                    details.classList.add('show');
                    this.textContent = 'Hide Details';
                }
            });
        });
    }
    
    // Load the default active tab (tech)
    loadTabContent('tech');
    
    // Get all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // ==================== GOOEY NAV FUNCTIONALITY ====================
    const gooeyConfig = {
        animationTime: 600,
        particleCount: 15,
        particleDistances: [90, 10],
        particleR: 100,
        timeVariance: 300,
        colors: [1, 2, 3, 1, 2, 3, 1, 4]
    };
    
    const containerRef = document.querySelector('.gooey-nav-container');
    const navRef = containerRef?.querySelector('nav ul');
    const filterRef = containerRef?.querySelector('.effect.filter');
    const textRef = containerRef?.querySelector('.effect.text');
    const navItems = navRef?.querySelectorAll('li');
    let activeIndex = 0;
    
    const noise = (n = 1) => n / 2 - Math.random() * n;
    
    const getXY = (distance, pointIndex, totalPoints) => {
        const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    };
    
    const createParticle = (i, t, d, r) => {
        let rotate = noise(r / 10);
        return {
            start: getXY(d[0], gooeyConfig.particleCount - i, gooeyConfig.particleCount),
            end: getXY(d[1] + noise(7), gooeyConfig.particleCount - i, gooeyConfig.particleCount),
            time: t,
            scale: 1 + noise(0.2),
            color: gooeyConfig.colors[Math.floor(Math.random() * gooeyConfig.colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    };
    
    const makeParticles = (element) => {
        const d = gooeyConfig.particleDistances;
        const r = gooeyConfig.particleR;
        const bubbleTime = gooeyConfig.animationTime * 2 + gooeyConfig.timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);
        
        for (let i = 0; i < gooeyConfig.particleCount; i++) {
            const t = gooeyConfig.animationTime * 2 + noise(gooeyConfig.timeVariance * 2);
            const p = createParticle(i, t, d, r);
            element.classList.remove('active');
            
            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
                particle.style.setProperty('--rotate', `${p.rotate}deg`);
                
                point.classList.add('point');
                particle.appendChild(point);
                element.appendChild(particle);
                
                requestAnimationFrame(() => {
                    element.classList.add('active');
                });
                
                setTimeout(() => {
                    try {
                        element.removeChild(particle);
                    } catch {
                        // Do nothing
                    }
                }, t);
            }, 30);
        }
    };
    
    const updateEffectPosition = (element) => {
        if (!containerRef || !filterRef || !textRef) return;
        const containerRect = containerRef.getBoundingClientRect();
        const pos = element.getBoundingClientRect();
        
        const styles = {
            left: `${pos.x - containerRect.x}px`,
            top: `${pos.y - containerRect.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`
        };
        Object.assign(filterRef.style, styles);
        Object.assign(textRef.style, styles);
        textRef.innerText = element.querySelector('a').innerText;
    };
    
    const handleNavClick = (e, index) => {
        e.preventDefault();
        const liEl = e.currentTarget;
        if (activeIndex === index) return;
        
        activeIndex = index;
        
        // Update active state
        navItems.forEach(item => item.classList.remove('active'));
        liEl.classList.add('active');
        
        updateEffectPosition(liEl);
        
        // Clear existing particles
        if (filterRef) {
            const particles = filterRef.querySelectorAll('.particle');
            particles.forEach(p => filterRef.removeChild(p));
        }
        
        // Animate text
        if (textRef) {
            textRef.classList.remove('active');
            void textRef.offsetWidth;
            textRef.classList.add('active');
        }
        
        // Create particles
        if (filterRef) {
            makeParticles(filterRef);
        }
        
        // Switch tab content
        const tabId = liEl.getAttribute('data-tab');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        const selectedPane = document.getElementById(tabId);
        if (selectedPane) {
            selectedPane.classList.add('active');
            loadTabContent(tabId);
        }
    };
    
    // Initialize gooey nav
    if (navItems && navItems.length > 0) {
        navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => handleNavClick(e, index));
        });
        
        // Set initial position
        const activeLi = navRef.querySelector('li.active') || navItems[0];
        if (activeLi) {
            updateEffectPosition(activeLi);
            textRef?.classList.add('active');
        }
        
        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
            const currentActiveLi = navRef.querySelectorAll('li')[activeIndex];
            if (currentActiveLi) {
                updateEffectPosition(currentActiveLi);
            }
        });
        
        resizeObserver.observe(containerRef);
    }
    // ==================== END GOOEY NAV ====================
    
    // Theme Toggle Functionality
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeSwitch.checked = true;
    } else if (storedTheme === null && !prefersDarkMode) {
        document.body.classList.add('light-mode');
        themeSwitch.checked = true;
    }
    
    // Listen for toggle changes
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Smooth scrolling for better mobile experience
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Optimize images for mobile
    function optimizeImagesForMobile() {
        if (window.innerWidth <= 768) {
            const techImages = document.querySelectorAll('#tech img');
            techImages.forEach(img => {
                img.style.height = 'auto';
                img.style.maxWidth = '100px';
            });
        }
    }
    
    optimizeImagesForMobile();
    window.addEventListener('resize', optimizeImagesForMobile);
});