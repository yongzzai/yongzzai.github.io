// ==================== ANIMATED LIST ====================
class AnimatedList {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            showGradients: options.showGradients !== undefined ? options.showGradients : true,
            enableArrowNavigation: options.enableArrowNavigation !== undefined ? options.enableArrowNavigation : true,
            displayScrollbar: options.displayScrollbar !== undefined ? options.displayScrollbar : true,
            initialSelectedIndex: options.initialSelectedIndex || -1,
            onItemSelect: options.onItemSelect || null,
            animationDelay: options.animationDelay || 0.1
        };
        
        this.selectedIndex = this.options.initialSelectedIndex;
        this.keyboardNav = false;
        this.items = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // Wrap existing content
        this.wrapContent();
        
        // Setup intersection observer for animations
        this.setupObserver();
        
        // Setup gradients
        if (this.options.showGradients) {
            this.createGradients();
        }
        
        // Setup scrollbar visibility
        if (!this.options.displayScrollbar) {
            this.scrollList.classList.add('no-scrollbar');
        }
        
        // Bind events
        this.bindEvents();
    }
    
    wrapContent() {
        // Get all list items (li elements or direct children with class)
        const listItems = this.container.querySelectorAll('ul > li, .project-item, .conference-list > li, .publication-list > li');
        
        if (listItems.length === 0) return;
        
        // Create wrapper structure
        this.container.classList.add('scroll-list-container');
        
        // Find or create scroll list
        let scrollList = this.container.querySelector('.scroll-list');
        if (!scrollList) {
            scrollList = document.createElement('div');
            scrollList.className = 'scroll-list';
            
            // Move all content into scroll list
            while (this.container.firstChild) {
                scrollList.appendChild(this.container.firstChild);
            }
            this.container.appendChild(scrollList);
        }
        this.scrollList = scrollList;
        
        // Wrap each item
        listItems.forEach((item, index) => {
            if (!item.closest('.animated-item')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'animated-item';
                wrapper.dataset.index = index;
                wrapper.style.transitionDelay = `${index * this.options.animationDelay}s`;
                
                item.parentNode.insertBefore(wrapper, item);
                wrapper.appendChild(item);
                
                this.items.push(wrapper);
            }
        });
    }
    
    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            root: this.scrollList,
            threshold: 0.3
        });
        
        this.items.forEach(item => {
            this.observer.observe(item);
        });
    }
    
    createGradients() {
        this.topGradient = document.createElement('div');
        this.topGradient.className = 'top-gradient';
        this.topGradient.style.opacity = '0';
        
        this.bottomGradient = document.createElement('div');
        this.bottomGradient.className = 'bottom-gradient';
        this.bottomGradient.style.opacity = '1';
        
        this.container.appendChild(this.topGradient);
        this.container.appendChild(this.bottomGradient);
        
        // Check initial scroll state
        this.updateGradients();
    }
    
    updateGradients() {
        if (!this.scrollList || !this.options.showGradients) return;
        
        const { scrollTop, scrollHeight, clientHeight } = this.scrollList;
        
        if (this.topGradient) {
            this.topGradient.style.opacity = Math.min(scrollTop / 50, 1);
        }
        
        if (this.bottomGradient) {
            const bottomDistance = scrollHeight - (scrollTop + clientHeight);
            const opacity = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1);
            this.bottomGradient.style.opacity = opacity;
        }
    }
    
    bindEvents() {
        // Scroll event
        if (this.scrollList) {
            this.scrollList.addEventListener('scroll', () => this.updateGradients());
        }
        
        // Item events
        this.items.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.handleItemMouseEnter(index));
            item.addEventListener('click', () => this.handleItemClick(index));
        });
        
        // Keyboard navigation
        if (this.options.enableArrowNavigation) {
            this.keydownHandler = (e) => this.handleKeyDown(e);
            window.addEventListener('keydown', this.keydownHandler);
        }
    }
    
    handleItemMouseEnter(index) {
        this.updateSelection(index);
    }
    
    handleItemClick(index) {
        this.updateSelection(index);
        if (this.options.onItemSelect) {
            this.options.onItemSelect(this.items[index], index);
        }
    }
    
    updateSelection(index) {
        // Remove previous selection
        this.items.forEach(item => {
            const innerItem = item.querySelector('.item, li, .project-item');
            if (innerItem) innerItem.classList.remove('selected');
        });
        
        // Add new selection
        this.selectedIndex = index;
        const selectedItem = this.items[index];
        if (selectedItem) {
            const innerItem = selectedItem.querySelector('.item, li, .project-item');
            if (innerItem) innerItem.classList.add('selected');
        }
    }
    
    handleKeyDown(e) {
        // Only handle if this list is visible/active
        if (!this.container.offsetParent) return;
        
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            this.keyboardNav = true;
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.items.length - 1);
            this.updateSelection(this.selectedIndex);
            this.scrollToSelected();
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            this.keyboardNav = true;
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.updateSelection(this.selectedIndex);
            this.scrollToSelected();
        } else if (e.key === 'Enter') {
            if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
                e.preventDefault();
                if (this.options.onItemSelect) {
                    this.options.onItemSelect(this.items[this.selectedIndex], this.selectedIndex);
                }
            }
        }
    }
    
    scrollToSelected() {
        if (this.selectedIndex < 0 || !this.scrollList) return;
        
        const selectedItem = this.items[this.selectedIndex];
        if (!selectedItem) return;
        
        const extraMargin = 50;
        const containerScrollTop = this.scrollList.scrollTop;
        const containerHeight = this.scrollList.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;
        
        if (itemTop < containerScrollTop + extraMargin) {
            this.scrollList.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
        } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
            this.scrollList.scrollTo({
                top: itemBottom - containerHeight + extraMargin,
                behavior: 'smooth'
            });
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.keydownHandler) {
            window.removeEventListener('keydown', this.keydownHandler);
        }
    }
}

// Initialize Animated Lists when tab content is loaded
function initAnimatedListsForTab(tabId) {
    const tabPane = document.getElementById(tabId);
    if (!tabPane || tabPane.dataset.animatedListInitialized) return;
    
    // Find list containers within the tab
    const lists = tabPane.querySelectorAll('ul.project-list, ul.conference-list, ul.publication-list, ul:not(.gooey-nav-container ul)');
    
    lists.forEach(list => {
        if (list.closest('.scroll-list-container')) return; // Already initialized
        
        // Wrap in a container if needed
        let container = list.parentElement;
        if (!container.classList.contains('animated-list-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'animated-list-wrapper';
            list.parentNode.insertBefore(wrapper, list);
            wrapper.appendChild(list);
            container = wrapper;
        }
        
        new AnimatedList(container, {
            showGradients: true,
            enableArrowNavigation: false, // Disable to avoid conflicts
            displayScrollbar: true,
            animationDelay: 0.05
        });
    });
    
    tabPane.dataset.animatedListInitialized = 'true';
}

// Hook into the existing tab loading system
document.addEventListener('DOMContentLoaded', function() {
    // Override or extend the loadTabContent function
    const originalLoadTabContent = window.loadTabContent;
    
    // Watch for tab content changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const tabPane = mutation.target;
                if (tabPane.classList && tabPane.classList.contains('tab-pane')) {
                    setTimeout(() => {
                        initAnimatedListsForTab(tabPane.id);
                    }, 100);
                }
            }
        });
    });
    
    // Observe all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        observer.observe(pane, { childList: true, subtree: true });
    });
    
    // Also init for already loaded content
    setTimeout(() => {
        document.querySelectorAll('.tab-pane').forEach(pane => {
            if (pane.children.length > 0) {
                initAnimatedListsForTab(pane.id);
            }
        });
    }, 500);
});
