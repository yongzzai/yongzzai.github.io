// Letter Glitch Background - Vanilla JS Version
(function() {
    // Configuration
    const config = {
        glitchColors: ['#2b4539', '#61dca3', '#61b3dc'],
        glitchSpeed: 50,
        centerVignette: false,
        outerVignette: true,
        smooth: true,
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
    };

    const fontSize = 16;
    const charWidth = 10;
    const charHeight = 20;

    let canvas = null;
    let context = null;
    let letters = [];
    let grid = { columns: 0, rows: 0 };
    let animationRef = null;
    let lastGlitchTime = Date.now();

    const lettersAndSymbols = Array.from(config.characters);

    function getRandomChar() {
        return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
    }

    function getRandomColor() {
        return config.glitchColors[Math.floor(Math.random() * config.glitchColors.length)];
    }

    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function interpolateColor(start, end, factor) {
        const result = {
            r: Math.round(start.r + (end.r - start.r) * factor),
            g: Math.round(start.g + (end.g - start.g) * factor),
            b: Math.round(start.b + (end.b - start.b) * factor)
        };
        return `rgb(${result.r}, ${result.g}, ${result.b})`;
    }

    function calculateGrid(width, height) {
        const columns = Math.ceil(width / charWidth);
        const rows = Math.ceil(height / charHeight);
        return { columns, rows };
    }

    function initializeLetters(columns, rows) {
        grid = { columns, rows };
        const totalLetters = columns * rows;
        letters = Array.from({ length: totalLetters }, () => ({
            char: getRandomChar(),
            color: getRandomColor(),
            targetColor: getRandomColor(),
            colorProgress: 1
        }));
    }

    function resizeCanvas() {
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        if (context) {
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const { columns, rows } = calculateGrid(rect.width, rect.height);
        initializeLetters(columns, rows);

        drawLetters();
    }

    function drawLetters() {
        if (!context || letters.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        context.clearRect(0, 0, rect.width, rect.height);
        context.font = `${fontSize}px monospace`;
        context.textBaseline = 'top';

        letters.forEach((letter, index) => {
            const x = (index % grid.columns) * charWidth;
            const y = Math.floor(index / grid.columns) * charHeight;
            context.fillStyle = letter.color;
            context.fillText(letter.char, x, y);
        });
    }

    function updateLetters() {
        if (!letters || letters.length === 0) return;

        const updateCount = Math.max(1, Math.floor(letters.length * 0.05));

        for (let i = 0; i < updateCount; i++) {
            const index = Math.floor(Math.random() * letters.length);
            if (!letters[index]) continue;

            letters[index].char = getRandomChar();
            letters[index].targetColor = getRandomColor();

            if (!config.smooth) {
                letters[index].color = letters[index].targetColor;
                letters[index].colorProgress = 1;
            } else {
                letters[index].colorProgress = 0;
            }
        }
    }

    function handleSmoothTransitions() {
        let needsRedraw = false;
        letters.forEach(letter => {
            if (letter.colorProgress < 1) {
                letter.colorProgress += 0.05;
                if (letter.colorProgress > 1) letter.colorProgress = 1;

                const startRgb = hexToRgb(letter.color);
                const endRgb = hexToRgb(letter.targetColor);
                if (startRgb && endRgb) {
                    letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
                    needsRedraw = true;
                }
            }
        });

        if (needsRedraw) {
            drawLetters();
        }
    }

    function animate() {
        const now = Date.now();
        if (now - lastGlitchTime >= config.glitchSpeed) {
            updateLetters();
            drawLetters();
            lastGlitchTime = now;
        }

        if (config.smooth) {
            handleSmoothTransitions();
        }

        animationRef = requestAnimationFrame(animate);
    }

    function init() {
        const container = document.getElementById('letter-glitch-bg');
        if (!container) return;

        // Create canvas
        canvas = document.createElement('canvas');
        canvas.className = 'letter-glitch-canvas';
        container.appendChild(canvas);

        // Create outer vignette
        if (config.outerVignette) {
            const outerVignette = document.createElement('div');
            outerVignette.className = 'letter-glitch-outer-vignette';
            container.appendChild(outerVignette);
        }

        // Create center vignette
        if (config.centerVignette) {
            const centerVignette = document.createElement('div');
            centerVignette.className = 'letter-glitch-center-vignette';
            container.appendChild(centerVignette);
        }

        context = canvas.getContext('2d');
        resizeCanvas();
        animate();

        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                cancelAnimationFrame(animationRef);
                resizeCanvas();
                animate();
            }, 100);
        };

        window.addEventListener('resize', handleResize);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
