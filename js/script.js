var container = document.querySelector('.container');
var overlay = document.querySelector('.overlay');

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

// Tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and content panes
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
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
        });
    });
    
    // Abstract toggle functionality for publications
    const abstractToggles = document.querySelectorAll('.abstract-toggle a');
    
    abstractToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
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
});