// Shiny Text Animation - Vanilla JS (converted from React/Framer Motion)
class ShinyText {
    constructor(element, options = {}) {
        this.element = element;
        
        this.options = {
            text: options.text || 'Shiny Text',
            speed: options.speed || 2,
            color: options.color || '#b5b5b5',
            shineColor: options.shineColor || '#ffffff',
            spread: options.spread || 120,
            yoyo: options.yoyo !== undefined ? options.yoyo : false,
            pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : false,
            direction: options.direction || 'left',
            delay: options.delay || 0,
            ...options
        };
        
        this.progress = 0;
        this.isPaused = false;
        this.lastTime = null;
        this.elapsed = 0;
        this.directionMultiplier = this.options.direction === 'left' ? 1 : -1;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Set up the element
        this.element.textContent = this.options.text;
        this.element.style.backgroundImage = `linear-gradient(${this.options.spread}deg, ${this.options.color} 0%, ${this.options.color} 35%, ${this.options.shineColor} 50%, ${this.options.color} 65%, ${this.options.color} 100%)`;
        this.element.style.backgroundSize = '200% auto';
        this.element.style.webkitBackgroundClip = 'text';
        this.element.style.backgroundClip = 'text';
        this.element.style.webkitTextFillColor = 'transparent';
        
        // Set data attribute for glow effect
        this.element.parentElement?.setAttribute('data-text', this.options.text);
        
        // Hover events
        if (this.options.pauseOnHover) {
            this.element.addEventListener('mouseenter', () => this.isPaused = true);
            this.element.addEventListener('mouseleave', () => this.isPaused = false);
        }
        
        // Start animation
        this.animate();
    }
    
    animate(time) {
        if (!this.isPaused) {
            if (this.lastTime === null) {
                this.lastTime = time || performance.now();
            }
            
            const currentTime = time || performance.now();
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            this.elapsed += deltaTime;
            
            const animationDuration = this.options.speed * 1000;
            const delayDuration = this.options.delay * 1000;
            
            if (this.options.yoyo) {
                const cycleDuration = animationDuration + delayDuration;
                const fullCycle = cycleDuration * 2;
                const cycleTime = this.elapsed % fullCycle;
                
                if (cycleTime < animationDuration) {
                    const p = (cycleTime / animationDuration) * 100;
                    this.progress = this.directionMultiplier === 1 ? p : 100 - p;
                } else if (cycleTime < cycleDuration) {
                    this.progress = this.directionMultiplier === 1 ? 100 : 0;
                } else if (cycleTime < cycleDuration + animationDuration) {
                    const reverseTime = cycleTime - cycleDuration;
                    const p = 100 - (reverseTime / animationDuration) * 100;
                    this.progress = this.directionMultiplier === 1 ? p : 100 - p;
                } else {
                    this.progress = this.directionMultiplier === 1 ? 0 : 100;
                }
            } else {
                const cycleDuration = animationDuration + delayDuration;
                const cycleTime = this.elapsed % cycleDuration;
                
                if (cycleTime < animationDuration) {
                    const p = (cycleTime / animationDuration) * 100;
                    this.progress = this.directionMultiplier === 1 ? p : 100 - p;
                } else {
                    this.progress = this.directionMultiplier === 1 ? 100 : 0;
                }
            }
            
            // Transform: p=0 -> 150% (shine off right), p=100 -> -50% (shine off left)
            const backgroundPosition = `${150 - this.progress * 2}% center`;
            this.element.style.backgroundPosition = backgroundPosition;
        } else {
            this.lastTime = null;
        }
        
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const shinyTextElement = document.getElementById('shiny-text');
    if (shinyTextElement) {
        new ShinyText(shinyTextElement, {
            text: '"Be Progressive but Realistic"',
            speed: 3,
            color: '#a78bfa',
            shineColor: '#ffffff',
            spread: 90,
            yoyo: true,
            delay: 0.5
        });
    }
});
