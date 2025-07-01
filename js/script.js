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

// Tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and content panes
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Tab scroll functionality for mobile
    const tabsContainer = document.querySelector('.tabs');
    const scrollLeftBtn = document.querySelector('.tab-scroll-left');
    const scrollRightBtn = document.querySelector('.tab-scroll-right');
    
    if (scrollLeftBtn && scrollRightBtn && tabsContainer) {
        scrollLeftBtn.addEventListener('click', function() {
            tabsContainer.scrollBy({ left: -100, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', function() {
            tabsContainer.scrollBy({ left: 100, behavior: 'smooth' });
        });
        
        // Show/hide scroll buttons based on scroll position
        function updateScrollButtons() {
            const isAtStart = tabsContainer.scrollLeft <= 0;
            const isAtEnd = tabsContainer.scrollLeft >= 
                (tabsContainer.scrollWidth - tabsContainer.clientWidth);
            
            scrollLeftBtn.style.opacity = isAtStart ? '0.3' : '0.7';
            scrollRightBtn.style.opacity = isAtEnd ? '0.3' : '0.7';
        }
        
        tabsContainer.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        updateScrollButtons(); // Initial check
    }
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Show the selected tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Scroll active tab into view on mobile
            if (window.innerWidth <= 768) {
                this.scrollIntoView({ 
                    behavior: 'smooth', 
                    inline: 'center',
                    block: 'nearest'
                });
            }
        });
    });
    
    // Abstract toggle functionality for publications
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