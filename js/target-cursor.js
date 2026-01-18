// ==================== TARGET CURSOR ====================
class TargetCursor {
    constructor(options = {}) {
        this.options = {
            targetSelector: options.targetSelector || '.cursor-target',
            spinDuration: options.spinDuration || 2,
            hideDefaultCursor: options.hideDefaultCursor !== undefined ? options.hideDefaultCursor : true,
            hoverDuration: options.hoverDuration || 0.2,
            parallaxOn: options.parallaxOn !== undefined ? options.parallaxOn : true
        };
        
        this.constants = {
            borderWidth: 3,
            cornerSize: 12
        };
        
        this.cursorRef = null;
        this.cornersRef = null;
        this.dotRef = null;
        this.spinTl = null;
        
        this.isActive = false;
        this.targetCornerPositions = null;
        this.activeStrength = { current: 0 };
        this.activeTarget = null;
        this.currentLeaveHandler = null;
        this.resumeTimeout = null;
        
        // Check if mobile
        this.isMobile = this.checkMobile();
        
        if (!this.isMobile) {
            this.init();
        }
    }
    
    checkMobile() {
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
        return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
    }
    
    init() {
        // Create cursor elements
        this.createCursorElements();
        
        // Hide default cursor
        if (this.options.hideDefaultCursor) {
            document.body.classList.add('hide-cursor');
        }
        
        // Get references
        this.cornersRef = this.cursorRef.querySelectorAll('.target-cursor-corner');
        
        // Initial position
        gsap.set(this.cursorRef, {
            xPercent: -50,
            yPercent: -50,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });
        
        // Create spin animation
        this.createSpinTimeline();
        
        // Bind event handlers
        this.bindEvents();
    }
    
    createCursorElements() {
        const wrapper = document.createElement('div');
        wrapper.className = 'target-cursor-wrapper';
        wrapper.innerHTML = `
            <div class="target-cursor-dot"></div>
            <div class="target-cursor-corner corner-tl"></div>
            <div class="target-cursor-corner corner-tr"></div>
            <div class="target-cursor-corner corner-br"></div>
            <div class="target-cursor-corner corner-bl"></div>
        `;
        document.body.appendChild(wrapper);
        
        this.cursorRef = wrapper;
        this.dotRef = wrapper.querySelector('.target-cursor-dot');
    }
    
    createSpinTimeline() {
        if (this.spinTl) {
            this.spinTl.kill();
        }
        this.spinTl = gsap.timeline({ repeat: -1 })
            .to(this.cursorRef, { 
                rotation: '+=360', 
                duration: this.options.spinDuration, 
                ease: 'none' 
            });
    }
    
    moveCursor(x, y) {
        if (!this.cursorRef) return;
        gsap.to(this.cursorRef, {
            x,
            y,
            duration: 0.1,
            ease: 'power3.out'
        });
    }
    
    tickerFn() {
        if (!this.targetCornerPositions || !this.cursorRef || !this.cornersRef) {
            return;
        }
        
        const strength = this.activeStrength.current;
        if (strength === 0) return;
        
        const cursorX = gsap.getProperty(this.cursorRef, 'x');
        const cursorY = gsap.getProperty(this.cursorRef, 'y');
        
        const corners = Array.from(this.cornersRef);
        corners.forEach((corner, i) => {
            const currentX = gsap.getProperty(corner, 'x') || 0;
            const currentY = gsap.getProperty(corner, 'y') || 0;
            
            const targetX = this.targetCornerPositions[i].x - cursorX;
            const targetY = this.targetCornerPositions[i].y - cursorY;
            
            const finalX = currentX + (targetX - currentX) * strength;
            const finalY = currentY + (targetY - currentY) * strength;
            
            const duration = strength >= 0.99 ? (this.options.parallaxOn ? 0.2 : 0) : 0.05;
            
            gsap.to(corner, {
                x: finalX,
                y: finalY,
                duration: duration,
                ease: duration === 0 ? 'none' : 'power1.out',
                overwrite: 'auto'
            });
        });
    }
    
    bindEvents() {
        // Mouse move
        this.moveHandler = (e) => this.moveCursor(e.clientX, e.clientY);
        window.addEventListener('mousemove', this.moveHandler);
        
        // Scroll
        this.scrollHandler = () => {
            if (!this.activeTarget || !this.cursorRef) return;
            const mouseX = gsap.getProperty(this.cursorRef, 'x');
            const mouseY = gsap.getProperty(this.cursorRef, 'y');
            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
            const isStillOverTarget = elementUnderMouse && 
                (elementUnderMouse === this.activeTarget || 
                 elementUnderMouse.closest(this.options.targetSelector) === this.activeTarget);
            if (!isStillOverTarget && this.currentLeaveHandler) {
                this.currentLeaveHandler();
            }
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        
        // Mouse down/up
        this.mouseDownHandler = () => {
            if (!this.dotRef) return;
            gsap.to(this.dotRef, { scale: 0.7, duration: 0.3 });
            gsap.to(this.cursorRef, { scale: 0.9, duration: 0.2 });
        };
        
        this.mouseUpHandler = () => {
            if (!this.dotRef) return;
            gsap.to(this.dotRef, { scale: 1, duration: 0.3 });
            gsap.to(this.cursorRef, { scale: 1, duration: 0.2 });
        };
        
        window.addEventListener('mousedown', this.mouseDownHandler);
        window.addEventListener('mouseup', this.mouseUpHandler);
        
        // Mouse over (enter handler)
        this.enterHandler = (e) => this.handleEnter(e);
        window.addEventListener('mouseover', this.enterHandler, { passive: true });
        
        // Ticker function binding
        this.boundTickerFn = () => this.tickerFn();
    }
    
    handleEnter(e) {
        const directTarget = e.target;
        const allTargets = [];
        let current = directTarget;
        
        while (current && current !== document.body) {
            if (current.matches && current.matches(this.options.targetSelector)) {
                allTargets.push(current);
            }
            current = current.parentElement;
        }
        
        const target = allTargets[0] || null;
        if (!target || !this.cursorRef || !this.cornersRef) return;
        if (this.activeTarget === target) return;
        
        if (this.activeTarget) {
            this.cleanupTarget(this.activeTarget);
        }
        
        if (this.resumeTimeout) {
            clearTimeout(this.resumeTimeout);
            this.resumeTimeout = null;
        }
        
        this.activeTarget = target;
        const corners = Array.from(this.cornersRef);
        corners.forEach(corner => gsap.killTweensOf(corner));
        
        gsap.killTweensOf(this.cursorRef, 'rotation');
        this.spinTl?.pause();
        gsap.set(this.cursorRef, { rotation: 0 });
        
        const rect = target.getBoundingClientRect();
        const { borderWidth, cornerSize } = this.constants;
        const cursorX = gsap.getProperty(this.cursorRef, 'x');
        const cursorY = gsap.getProperty(this.cursorRef, 'y');
        
        this.targetCornerPositions = [
            { x: rect.left - borderWidth, y: rect.top - borderWidth },
            { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
            { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
            { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
        ];
        
        this.isActive = true;
        gsap.ticker.add(this.boundTickerFn);
        
        gsap.to(this.activeStrength, {
            current: 1,
            duration: this.options.hoverDuration,
            ease: 'power2.out'
        });
        
        corners.forEach((corner, i) => {
            gsap.to(corner, {
                x: this.targetCornerPositions[i].x - cursorX,
                y: this.targetCornerPositions[i].y - cursorY,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        const leaveHandler = () => {
            gsap.ticker.remove(this.boundTickerFn);
            
            this.isActive = false;
            this.targetCornerPositions = null;
            gsap.set(this.activeStrength, { current: 0, overwrite: true });
            this.activeTarget = null;
            
            if (this.cornersRef) {
                const corners = Array.from(this.cornersRef);
                gsap.killTweensOf(corners);
                const { cornerSize } = this.constants;
                const positions = [
                    { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
                    { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
                    { x: cornerSize * 0.5, y: cornerSize * 0.5 },
                    { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
                ];
                
                corners.forEach((corner, index) => {
                    gsap.to(corner, {
                        x: positions[index].x,
                        y: positions[index].y,
                        duration: 0.3,
                        ease: 'power3.out'
                    });
                });
            }
            
            this.resumeTimeout = setTimeout(() => {
                if (!this.activeTarget && this.cursorRef && this.spinTl) {
                    const currentRotation = gsap.getProperty(this.cursorRef, 'rotation');
                    const normalizedRotation = currentRotation % 360;
                    this.spinTl.kill();
                    this.spinTl = gsap.timeline({ repeat: -1 })
                        .to(this.cursorRef, { 
                            rotation: '+=360', 
                            duration: this.options.spinDuration, 
                            ease: 'none' 
                        });
                    gsap.to(this.cursorRef, {
                        rotation: normalizedRotation + 360,
                        duration: this.options.spinDuration * (1 - normalizedRotation / 360),
                        ease: 'none',
                        onComplete: () => {
                            this.spinTl?.restart();
                        }
                    });
                }
                this.resumeTimeout = null;
            }, 50);
            
            this.cleanupTarget(target);
        };
        
        this.currentLeaveHandler = leaveHandler;
        target.addEventListener('mouseleave', leaveHandler);
    }
    
    cleanupTarget(target) {
        if (this.currentLeaveHandler) {
            target.removeEventListener('mouseleave', this.currentLeaveHandler);
        }
        this.currentLeaveHandler = null;
    }
    
    destroy() {
        if (this.boundTickerFn) {
            gsap.ticker.remove(this.boundTickerFn);
        }
        
        window.removeEventListener('mousemove', this.moveHandler);
        window.removeEventListener('mouseover', this.enterHandler);
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('mousedown', this.mouseDownHandler);
        window.removeEventListener('mouseup', this.mouseUpHandler);
        
        if (this.activeTarget) {
            this.cleanupTarget(this.activeTarget);
        }
        
        this.spinTl?.kill();
        document.body.classList.remove('hide-cursor');
        
        if (this.cursorRef) {
            this.cursorRef.remove();
        }
    }
}

// Initialize Target Cursor
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if GSAP is available
    if (typeof gsap !== 'undefined') {
        new TargetCursor({
            targetSelector: '.cursor-target',
            spinDuration: 5,
            hideDefaultCursor: true,
            hoverDuration: 0.2,
            parallaxOn: true
        });
    }
});
