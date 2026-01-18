// Rotating Text Animation - Vanilla JS
class RotatingText {
    constructor(element, options = {}) {
        this.element = element;
        this.wordContainer = element.querySelector('.rotating-text__word');
        
        this.options = {
            texts: options.texts || ['Hello', 'World'],
            rotationInterval: options.rotationInterval || 3000,
            loop: options.loop !== undefined ? options.loop : true,
            ...options
        };
        
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.showText(this.options.texts[this.currentIndex]);
        this.startRotation();
    }
    
    showText(text) {
        this.wordContainer.textContent = text;
        this.wordContainer.classList.remove('exit');
        // Force reflow to restart animation
        void this.wordContainer.offsetWidth;
        this.wordContainer.classList.add('enter');
    }
    
    async animateOut() {
        this.wordContainer.classList.remove('enter');
        this.wordContainer.classList.add('exit');
        
        // Wait for exit animation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    async next() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        await this.animateOut();
        
        this.currentIndex++;
        if (this.currentIndex >= this.options.texts.length) {
            if (this.options.loop) {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.options.texts.length - 1;
                this.isAnimating = false;
                return;
            }
        }
        
        this.showText(this.options.texts[this.currentIndex]);
        this.isAnimating = false;
    }
    
    startRotation() {
        setInterval(() => {
            this.next();
        }, this.options.rotationInterval);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const rotatingTextElement = document.getElementById('rotating-text');
    if (rotatingTextElement) {
        new RotatingText(rotatingTextElement, {
            texts: [
                'Process Intelligence',
                'Data Science',
                'eXplainability'
            ],
            rotationInterval: 3000,
            loop: true
        });
    }
});
