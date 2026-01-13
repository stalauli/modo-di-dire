// Italian Sayings App
class ItalianSayingsApp {
    constructor() {
        this.sayings = [];
        this.categoryHistory = new Map();
        this.currentSaying = null;
        
        // Initialize category history for each category
        this.categories = ['warm', 'sarcastic', 'formal', 'humorous', 'wise'];
        this.categories.forEach(category => {
            this.categoryHistory.set(category, []);
        });
        
        this.init();
    }
    
    init() {
        // Load sayings from localStorage or use defaults
        this.loadSayings();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        console.log('Italian Sayings App initialized');
        console.log(`Loaded ${this.sayings.length} sayings across ${this.categories.length} categories`);
    }
    
    // Set up additional app-wide features
    setupAppFeatures() {
        // Add refresh/reset functionality
        this.addResetButton();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Add app info
        this.addAppInfo();
        
        // Set up error handling
        this.setupErrorHandling();
        
        // Handle edge cases
        this.handleEdgeCases();
        
        // Add connection status
        this.addConnectionStatus();
        
        // Set up touch gestures for mobile
        this.setupTouchGestures();
        
        // Monitor performance
        this.measurePerformance();
    }
    
    // Show welcome message on first load
    showWelcomeMessage() {
        const displayArea = document.getElementById('sayingDisplay');
        displayArea.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🇮🇹</div>
                <h2>Benvenuti!</h2>
                <p class="welcome-text">Welcome to Modo di Dire! "Modo di dire" means "way of saying" in Italian - these are the colorful expressions that make the language come alive. Click any category above to discover authentic Italian sayings with their meanings and cultural context.</p>
                <div class="stats-summary">
                    <strong>${this.sayings.length} modi di dire</strong> across <strong>${this.categories.length} categories</strong>
                </div>
            </div>
        `;
    }
    
    // Add reset button for clearing progress
    addResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.innerHTML = '↻ Reset Progress';
        resetBtn.title = 'Reset all category progress and start over';
        resetBtn.setAttribute('aria-label', 'Reset all category progress');
        
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all progress? This will clear your history for all categories.')) {
                this.resetAllHistory();
                this.updateButtonProgress();
                this.showWelcomeMessage();
                console.log('All progress reset by user');
            }
        });
        
        document.querySelector('.container').appendChild(resetBtn);
    }
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'r':
                case 'R':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.resetAllHistory();
                        this.updateButtonProgress();
                        this.showWelcomeMessage();
                    }
                    break;
                    
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    e.preventDefault();
                    const categoryIndex = parseInt(e.key) - 1;
                    const buttons = document.querySelectorAll('.category-btn');
                    if (buttons[categoryIndex]) {
                        buttons[categoryIndex].click();
                        buttons[categoryIndex].focus();
                    }
                    break;
                    
                case '?':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        });
    }
    
    // Add app information
    addAppInfo() {
        const infoBtn = document.createElement('button');
        infoBtn.className = 'info-btn';
        infoBtn.innerHTML = '?';
        infoBtn.title = 'Show keyboard shortcuts and app information';
        infoBtn.setAttribute('aria-label', 'Show help and information');
        
        infoBtn.addEventListener('click', () => {
            this.showHelp();
        });
        
        document.querySelector('.container').appendChild(infoBtn);
    }
    
    // Show help dialog
    showHelp() {
        const helpContent = `
            <div class="help-dialog">
                <h3>Keyboard Shortcuts</h3>
                <ul class="shortcuts-list">
                    <li><kbd>1-5</kbd> - Select category buttons</li>
                    <li><kbd>Arrow Keys</kbd> - Navigate between buttons</li>
                    <li><kbd>Enter/Space</kbd> - Activate selected button</li>
                    <li><kbd>Ctrl+R</kbd> - Reset all progress</li>
                    <li><kbd>?</kbd> - Show this help</li>
                </ul>
                <h3>About</h3>
                <p>Discover authentic Italian sayings with their English translations and cultural context. Each category contains carefully curated expressions to help you understand when and how to use them.</p>
                <button onclick="app.closeHelp()" class="close-help-btn">Close</button>
            </div>
        `;
        
        const displayArea = document.getElementById('sayingDisplay');
        displayArea.innerHTML = helpContent;
    }
    
    // Close help dialog
    closeHelp() {
        this.showWelcomeMessage();
    }
    
    // Set up global error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('App error:', e.error);
            this.showError('An unexpected error occurred. Please refresh the page.');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showError('A network or storage error occurred.');
        });
    }
    
    // Show error message to user
    showError(message) {
        const displayArea = document.getElementById('sayingDisplay');
        displayArea.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-text">${message}</div>
                <button onclick="location.reload()" class="reload-btn">Reload App</button>
            </div>
        `;
    }
    
    // Get app statistics
    getAppStats() {
        const totalSayings = this.sayings.length;
        const totalShown = Array.from(this.categoryHistory.values())
            .reduce((sum, history) => sum + history.length, 0);
        
        return {
            totalSayings,
            totalShown,
            percentageExplored: totalSayings > 0 ? Math.round((totalShown / totalSayings) * 100) : 0,
            categoriesWithProgress: this.categories.filter(cat => 
                this.categoryHistory.get(cat).length > 0
            ).length
        };
    }
    
    // Handle edge cases and improve UX
    handleEdgeCases() {
        // Handle empty categories gracefully
        this.categories.forEach(category => {
            const sayings = this.getSayingsByCategory(category);
            if (sayings.length === 0) {
                console.warn(`Category "${category}" has no sayings`);
            }
        });
        
        // Handle corrupted data
        this.sayings = this.sayings.filter(saying => this.validateSaying(saying));
        
        // Ensure at least one saying per category for demo
        this.ensureMinimumSayings();
    }
    
    // Ensure each category has at least one saying
    ensureMinimumSayings() {
        const categoryCounts = {};
        this.categories.forEach(cat => categoryCounts[cat] = 0);
        
        this.sayings.forEach(saying => {
            if (categoryCounts[saying.category] !== undefined) {
                categoryCounts[saying.category]++;
            }
        });
        
        // Log categories that need sayings
        Object.entries(categoryCounts).forEach(([category, count]) => {
            if (count === 0) {
                console.warn(`Category "${category}" is empty - consider adding sayings`);
            }
        });
    }
    
    // Add loading states for better UX
    showLoadingState() {
        const displayArea = document.getElementById('sayingDisplay');
        displayArea.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner">⏳</div>
                <div class="loading-text">Loading Italian sayings...</div>
            </div>
        `;
    }
    
    // Add connection status indicator
    addConnectionStatus() {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'connection-status';
        statusIndicator.innerHTML = navigator.onLine ? '🟢 Online' : '🔴 Offline';
        
        window.addEventListener('online', () => {
            statusIndicator.innerHTML = '🟢 Online';
            statusIndicator.style.color = '#27ae60';
        });
        
        window.addEventListener('offline', () => {
            statusIndicator.innerHTML = '🔴 Offline';
            statusIndicator.style.color = '#e74c3c';
        });
        
        document.body.appendChild(statusIndicator);
    }
    
    // Add performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            const loadTime = performance.now();
            console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
            
            // Monitor saying display performance
            const originalDisplaySaying = this.displaySaying;
            this.displaySaying = function(saying) {
                const start = performance.now();
                originalDisplaySaying.call(this, saying);
                const end = performance.now();
                console.log(`Saying displayed in ${(end - start).toFixed(2)}ms`);
            };
        }
    }
    
    // Add touch gestures for mobile
    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        const displayArea = document.getElementById('sayingDisplay');
        
        displayArea.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        displayArea.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe detection (minimum 50px movement)
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    // Swipe right - previous category
                    this.navigateCategory(-1);
                } else {
                    // Swipe left - next category
                    this.navigateCategory(1);
                }
            }
        });
    }
    
    // Navigate between categories with touch/keyboard
    navigateCategory(direction) {
        const buttons = Array.from(document.querySelectorAll('.category-btn'));
        const currentButton = document.querySelector('.category-btn.selected');
        
        if (!currentButton) {
            // No category selected, select first one
            buttons[0].click();
            return;
        }
        
        const currentIndex = buttons.indexOf(currentButton);
        let newIndex = currentIndex + direction;
        
        // Wrap around
        if (newIndex < 0) newIndex = buttons.length - 1;
        if (newIndex >= buttons.length) newIndex = 0;
        
        buttons[newIndex].click();
        buttons[newIndex].focus();
    }
    
    // Initialize accessibility features
    initializeAccessibility() {
        // Set up ARIA labels for buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            const category = btn.dataset.category;
            const stats = this.getCategoryStats(category);
            
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('aria-pressed', 'false');
            btn.setAttribute('aria-label', 
                `${category} category, ${stats.totalSayings} sayings available`
            );
        });
        
        // Set up the display area
        const displayArea = document.getElementById('sayingDisplay');
        displayArea.setAttribute('role', 'region');
        displayArea.setAttribute('aria-live', 'polite');
        displayArea.setAttribute('aria-label', 'Italian saying display area');
        
        // Add skip link for keyboard users
        this.addSkipLink();
    }
    
    // Add a skip link for better keyboard navigation
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#sayingDisplay';
        skipLink.textContent = 'Skip to saying display';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupEventListeners() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            // Click event
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.handleCategoryClick(category, e.target);
            });
            
            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const category = e.target.dataset.category;
                    this.handleCategoryClick(category, e.target);
                }
            });
            
            // Hover effects for better UX
            button.addEventListener('mouseenter', (e) => {
                if (!e.target.classList.contains('selected')) {
                    e.target.style.transform = 'translateY(-1px)';
                }
            });
            
            button.addEventListener('mouseleave', (e) => {
                if (!e.target.classList.contains('selected')) {
                    e.target.style.transform = '';
                }
            });
        });
        
        // Add keyboard navigation for the entire app
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    // Handle category button clicks with simple feedback
    handleCategoryClick(category, buttonElement) {
        // Update button states
        this.updateButtonStates(buttonElement);
        
        // Select and display saying
        this.selectCategory(category);
    }
    
    // Keyboard navigation support
    handleKeyboardNavigation(e) {
        const buttons = Array.from(document.querySelectorAll('.category-btn'));
        const currentIndex = buttons.findIndex(btn => btn === document.activeElement);
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                buttons[prevIndex].focus();
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                buttons[nextIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                buttons[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                buttons[buttons.length - 1].focus();
                break;
        }
    }
    
    // Update ARIA labels for accessibility
    updateAriaLabels(selectedCategory) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            const category = btn.dataset.category;
            const stats = this.getCategoryStats(category);
            const isSelected = category === selectedCategory;
            
            btn.setAttribute('aria-pressed', isSelected.toString());
            btn.setAttribute('aria-label', 
                `${category} category, ${stats.totalSayings} sayings available, ` +
                `${stats.shownSayings} already shown${isSelected ? ', currently selected' : ''}`
            );
        });
        
        // Update the display area's aria-live region
        const displayArea = document.getElementById('sayingDisplay');
        if (!displayArea.hasAttribute('aria-live')) {
            displayArea.setAttribute('aria-live', 'polite');
            displayArea.setAttribute('aria-label', 'Italian saying display area');
        }
    }
    
    // Optional: Play a subtle click sound (if audio is enabled)
    playClickSound() {
        // Create a subtle audio feedback using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Audio not supported or blocked, silently continue
        }
    }
    
    updateButtonStates(selectedButton) {
        // Remove selected class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button (just for simple arrow indicator)
        selectedButton.classList.add('selected');
    }
    
    // Update button visual state based on how many sayings have been shown
    updateButtonProgress() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            const category = btn.dataset.category;
            const stats = this.getCategoryStats(category);
            
            // Remove existing progress classes
            btn.classList.remove('category-complete', 'category-partial');
            
            if (stats.percentageComplete === 100) {
                btn.classList.add('category-complete');
                btn.title = `All ${stats.totalSayings} sayings shown in ${category} category`;
            } else if (stats.percentageComplete > 0) {
                btn.classList.add('category-partial');
                btn.title = `${stats.shownSayings}/${stats.totalSayings} sayings shown in ${category} category`;
            } else {
                btn.title = `${stats.totalSayings} sayings available in ${category} category`;
            }
        });
    }
    
    selectCategory(category) {
        console.log(`Selected category: ${category}`);
        
        const categorySayings = this.getSayingsByCategory(category);
        
        if (categorySayings.length === 0) {
            this.displayNoSayings(category);
        } else {
            const randomSaying = this.getRandomSaying(category);
            this.displaySaying(randomSaying);
        }
    }
    
    // Get a random saying from a category with smart selection to avoid repetition
    getRandomSaying(category) {
        const categorySayings = this.getSayingsByCategory(category);
        
        if (categorySayings.length === 0) {
            return null;
        }
        
        // Get the history for this category
        const categoryHistory = this.categoryHistory.get(category) || [];
        
        // If we've shown all sayings in this category, reset the history
        if (categoryHistory.length >= categorySayings.length) {
            console.log(`Resetting history for ${category} category - all sayings have been shown`);
            this.categoryHistory.set(category, []);
            categoryHistory.length = 0;
        }
        
        // Get sayings that haven't been shown recently
        const availableSayings = categorySayings.filter(saying => 
            !categoryHistory.includes(saying.id)
        );
        
        // If no available sayings (shouldn't happen due to reset above), use all sayings
        const sayingsToChooseFrom = availableSayings.length > 0 ? availableSayings : categorySayings;
        
        // Select a random saying
        const randomIndex = Math.floor(Math.random() * sayingsToChooseFrom.length);
        const selectedSaying = sayingsToChooseFrom[randomIndex];
        
        // Add to history
        categoryHistory.push(selectedSaying.id);
        this.categoryHistory.set(category, categoryHistory);
        
        console.log(`Selected saying "${selectedSaying.italian}" from ${category} category (${categoryHistory.length}/${categorySayings.length} shown)`);
        
        return selectedSaying;
    }
    
    // Reset history for a specific category
    resetCategoryHistory(category) {
        this.categoryHistory.set(category, []);
        console.log(`Reset history for ${category} category`);
    }
    
    // Reset history for all categories
    resetAllHistory() {
        this.categories.forEach(category => {
            this.categoryHistory.set(category, []);
        });
        console.log('Reset history for all categories');
    }
    
    // Get statistics about category usage
    getCategoryStats(category) {
        const categorySayings = this.getSayingsByCategory(category);
        const categoryHistory = this.categoryHistory.get(category) || [];
        
        return {
            totalSayings: categorySayings.length,
            shownSayings: categoryHistory.length,
            remainingSayings: Math.max(0, categorySayings.length - categoryHistory.length),
            percentageComplete: categorySayings.length > 0 ? 
                Math.round((categoryHistory.length / categorySayings.length) * 100) : 0
        };
    }
    
    // Check if there are unseen sayings in a category
    hasUnseenSayings(category) {
        const stats = this.getCategoryStats(category);
        return stats.remainingSayings > 0;
    }
    
    displaySaying(saying) {
        const displayArea = document.getElementById('sayingDisplay');
        
        displayArea.innerHTML = `
            <div class="saying-content">
                <div class="italian-text" lang="it">${saying.italian}</div>
                <div class="english-text">${saying.english}</div>
                <div class="usage-context">
                    <span class="usage-label">When to use:</span>
                    ${saying.usageContext}
                </div>
                <div class="category-info">${saying.category.toUpperCase()}</div>
            </div>
        `;
        
        this.currentSaying = saying;
    }
    
    // Format Italian text with proper typography
    formatItalianText(text) {
        // Add proper Italian quotation marks and emphasis
        return text
            .replace(/"/g, '«')
            .replace(/"/g, '»')
            .replace(/'/g, "'");
    }
    
    // Format English text with proper typography
    formatEnglishText(text) {
        // Ensure proper capitalization and punctuation
        let formatted = text.trim();
        if (!formatted.endsWith('.') && !formatted.endsWith('!') && !formatted.endsWith('?')) {
            formatted += '.';
        }
        return formatted;
    }
    
    // Format usage context with better readability
    formatUsageContext(context) {
        // Add proper punctuation and formatting
        let formatted = context.trim();
        if (!formatted.endsWith('.') && !formatted.endsWith('!') && !formatted.endsWith('?')) {
            formatted += '.';
        }
        return formatted;
    }
    
    // Announce saying to screen readers
    announceSaying(saying) {
        const announcement = `New Italian saying: ${saying.italian}. 
                            English translation: ${saying.english}. 
                            Usage: ${saying.usageContext}. 
                            Category: ${saying.category}.`;
        
        // Create a temporary element for screen reader announcement
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'assertive');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        
        document.body.appendChild(announcer);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }
    
    displayNoSayings(category) {
        const displayArea = document.getElementById('sayingDisplay');
        displayArea.innerHTML = `
            <div class="no-sayings">
                <div class="instruction">No sayings available for "${category}" category yet.</div>
                <div class="category-info">${category.toUpperCase()}</div>
            </div>
        `;
    }
    
    // Toggle favorite status (placeholder for future feature)
    toggleFavorite(sayingId) {
        const favoriteBtn = document.querySelector('.favorite-btn');
        const heart = favoriteBtn.querySelector('.heart');
        
        // Simple toggle animation
        favoriteBtn.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            if (heart.textContent === '♡') {
                heart.textContent = '♥';
                heart.style.color = '#e74c3c';
                favoriteBtn.setAttribute('aria-label', 'Remove from favorites');
                favoriteBtn.setAttribute('title', 'Remove from favorites');
            } else {
                heart.textContent = '♡';
                heart.style.color = '';
                favoriteBtn.setAttribute('aria-label', 'Add to favorites');
                favoriteBtn.setAttribute('title', 'Add to favorites');
            }
            
            favoriteBtn.style.transform = 'scale(1)';
        }, 100);
        
        console.log(`Toggled favorite for saying: ${sayingId}`);
    }
    
    loadSayings() {
        // Check if localStorage is available
        if (!this.isStorageAvailable()) {
            console.warn('localStorage not available, using in-memory storage only');
        }
        
        // Define the default sayings (fallback data)
        const defaultSayings = [
            // WARM category sayings
            {
                id: 'warm_1',
                italian: 'Ti voglio bene',
                english: 'I care about you',
                category: 'warm',
                usageContext: 'Use with family and close friends to express deep affection without romantic implications'
            },
            {
                id: 'warm_2',
                italian: 'Casa dolce casa',
                english: 'Home sweet home',
                category: 'warm',
                usageContext: 'Express comfort and happiness about being home or in a familiar place'
            },
            {
                id: 'warm_3',
                italian: 'Il cuore non invecchia mai',
                english: 'The heart never grows old',
                category: 'warm',
                usageContext: 'Remind someone that love and passion can last forever, regardless of age'
            },
            
            // SARCASTIC category sayings
            {
                id: 'sarcastic_1',
                italian: 'Meglio tardi che mai',
                english: 'Better late than never',
                category: 'sarcastic',
                usageContext: 'Use sarcastically when someone arrives very late or does something they should have done long ago'
            },
            {
                id: 'sarcastic_2',
                italian: 'Chi dorme non piglia pesci',
                english: 'Those who sleep don\'t catch fish',
                category: 'sarcastic',
                usageContext: 'Sarcastically tell someone they need to be more active or they\'ll miss opportunities'
            },
            {
                id: 'sarcastic_3',
                italian: 'Tanto va la gatta al lardo che ci lascia lo zampino',
                english: 'The cat goes to the lard so often that it leaves its paw print',
                category: 'sarcastic',
                usageContext: 'Warn someone that their repeated bad behavior will eventually get them caught'
            },
            
            // FORMAL category sayings
            {
                id: 'formal_1',
                italian: 'La cortesia è la chiave che apre tutte le porte',
                english: 'Courtesy is the key that opens all doors',
                category: 'formal',
                usageContext: 'Use in professional settings to emphasize the importance of politeness and good manners'
            },
            {
                id: 'formal_2',
                italian: 'Il rispetto si guadagna con il comportamento',
                english: 'Respect is earned through behavior',
                category: 'formal',
                usageContext: 'Appropriate for business contexts when discussing professional conduct and reputation'
            },
            {
                id: 'formal_3',
                italian: 'La pazienza è la virtù dei forti',
                english: 'Patience is the virtue of the strong',
                category: 'formal',
                usageContext: 'Use in formal situations to encourage perseverance and dignified waiting'
            },
            
            // HUMOROUS category sayings
            {
                id: 'humorous_1',
                italian: 'Avere le mani bucate',
                english: 'To have holes in your hands',
                category: 'humorous',
                usageContext: 'Jokingly describe someone who spends money too easily or can\'t save anything'
            },
            {
                id: 'humorous_2',
                italian: 'Essere al verde',
                english: 'To be in the green',
                category: 'humorous',
                usageContext: 'Humorously say you\'re broke or have no money left (literally "to be in the green")'
            },
            {
                id: 'humorous_3',
                italian: 'Avere grilli per la testa',
                english: 'To have crickets in your head',
                category: 'humorous',
                usageContext: 'Playfully tease someone about having crazy or unrealistic ideas'
            },
            
            // WISE category sayings
            {
                id: 'wise_1',
                italian: 'Chi va piano va sano e va lontano',
                english: 'Who goes slowly goes safely and goes far',
                category: 'wise',
                usageContext: 'Advise someone to be patient and steady in their approach to achieve lasting success'
            },
            {
                id: 'wise_2',
                italian: 'Non è tutto oro quello che luccica',
                english: 'Not everything that glitters is gold',
                category: 'wise',
                usageContext: 'Warn someone not to be deceived by appearances; things aren\'t always what they seem'
            },
            {
                id: 'wise_3',
                italian: 'L\'esperienza è la madre della saggezza',
                english: 'Experience is the mother of wisdom',
                category: 'wise',
                usageContext: 'Remind someone that wisdom comes from living through various situations and learning from them'
            }
        ];
        
        // Try to load from localStorage first
        const savedSayings = this.loadSayingsFromStorage();
        
        if (savedSayings && savedSayings.length > 0) {
            this.sayings = savedSayings;
        } else {
            // Use defaults and save them
            this.sayings = defaultSayings;
            if (this.isStorageAvailable()) {
                this.saveSayings();
                console.log(`Initialized with ${this.sayings.length} default sayings and saved to localStorage`);
            } else {
                console.log(`Initialized with ${this.sayings.length} default sayings (localStorage not available)`);
            }
        }
    }
    
    // Helper method to create a new saying object
    createSaying(italian, english, category, usageContext) {
        return {
            id: this.generateId(),
            italian: italian,
            english: english,
            category: category,
            usageContext: usageContext
        };
    }
    
    // Generate a simple unique ID for sayings
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Save sayings to localStorage with error handling
    saveSayings() {
        try {
            // Validate all sayings before saving
            const validSayings = this.sayings.filter(saying => this.validateSaying(saying));
            
            if (validSayings.length !== this.sayings.length) {
                console.warn(`Filtered out ${this.sayings.length - validSayings.length} invalid sayings before saving`);
            }
            
            localStorage.setItem('italianSayings', JSON.stringify(validSayings));
            localStorage.setItem('italianSayingsVersion', '1.0');
            localStorage.setItem('italianSayingsLastSaved', new Date().toISOString());
            
            console.log(`Successfully saved ${validSayings.length} sayings to localStorage`);
            return true;
        } catch (error) {
            console.error('Error saving sayings to localStorage:', error);
            this.showStorageError('save');
            return false;
        }
    }
    
    // Load sayings with comprehensive error handling and data recovery
    loadSayingsFromStorage() {
        try {
            const savedSayings = localStorage.getItem('italianSayings');
            const version = localStorage.getItem('italianSayingsVersion');
            const lastSaved = localStorage.getItem('italianSayingsLastSaved');
            
            if (savedSayings) {
                const parsedSayings = JSON.parse(savedSayings);
                
                // Validate the loaded data
                if (Array.isArray(parsedSayings)) {
                    const validSayings = parsedSayings.filter(saying => this.validateSaying(saying));
                    
                    if (validSayings.length > 0) {
                        console.log(`Loaded ${validSayings.length} valid sayings from localStorage`);
                        if (lastSaved) {
                            console.log(`Data last saved: ${new Date(lastSaved).toLocaleString()}`);
                        }
                        return validSayings;
                    } else {
                        console.warn('No valid sayings found in localStorage data');
                    }
                } else {
                    console.warn('Invalid data format in localStorage');
                }
            } else {
                console.log('No saved sayings found in localStorage');
            }
        } catch (error) {
            console.error('Error loading sayings from localStorage:', error);
            this.showStorageError('load');
        }
        
        return null;
    }
    
    // Clear localStorage data (useful for reset functionality)
    clearStoredSayings() {
        try {
            localStorage.removeItem('italianSayings');
            localStorage.removeItem('italianSayingsVersion');
            localStorage.removeItem('italianSayingsLastSaved');
            console.log('Cleared all stored sayings data');
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
    
    // Check if localStorage is available and working
    isStorageAvailable() {
        try {
            const testKey = 'italianSayingsTest';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn('localStorage is not available:', error);
            return false;
        }
    }
    
    // Show user-friendly storage error messages
    showStorageError(operation) {
        const displayArea = document.getElementById('sayingDisplay');
        const errorMessage = operation === 'save' 
            ? 'Unable to save data. Your browser storage might be full.'
            : 'Unable to load saved data. Using default sayings.';
            
        displayArea.innerHTML = `
            <div class="instruction" style="color: #e74c3c;">
                ⚠️ Storage Error: ${errorMessage}
            </div>
        `;
        
        // Clear the error message after 3 seconds
        setTimeout(() => {
            if (displayArea.innerHTML.includes('Storage Error')) {
                displayArea.innerHTML = `
                    <p class="instruction">Click a category button to see an Italian saying!</p>
                `;
            }
        }, 3000);
    }
    
    // Get sayings by category
    getSayingsByCategory(category) {
        return this.sayings.filter(saying => saying.category === category);
    }
    
    // Validate saying data
    validateSaying(saying) {
        return saying && 
               typeof saying.italian === 'string' && saying.italian.trim() !== '' &&
               typeof saying.english === 'string' && saying.english.trim() !== '' &&
               typeof saying.category === 'string' && this.categories.includes(saying.category) &&
               typeof saying.usageContext === 'string' && saying.usageContext.trim() !== '';
    }
    
    // Add a new saying and automatically save to localStorage
    addSaying(italian, english, category, usageContext) {
        const newSaying = this.createSaying(italian, english, category, usageContext);
        
        if (this.validateSaying(newSaying)) {
            // Check for duplicates
            const isDuplicate = this.sayings.some(saying => 
                saying.italian.toLowerCase() === italian.toLowerCase() ||
                saying.english.toLowerCase() === english.toLowerCase()
            );
            
            if (isDuplicate) {
                console.warn('Duplicate saying detected, not adding');
                return false;
            }
            
            this.sayings.push(newSaying);
            
            // Automatically save to localStorage
            if (this.saveSayings()) {
                console.log('New saying added and saved successfully');
                return true;
            } else {
                // If save failed, remove the saying from memory
                this.sayings.pop();
                return false;
            }
        } else {
            console.error('Invalid saying data, not adding');
            return false;
        }
    }
    
    // Remove a saying by ID and save changes
    removeSaying(sayingId) {
        const initialLength = this.sayings.length;
        this.sayings = this.sayings.filter(saying => saying.id !== sayingId);
        
        if (this.sayings.length < initialLength) {
            this.saveSayings();
            console.log(`Saying with ID ${sayingId} removed`);
            return true;
        } else {
            console.warn(`Saying with ID ${sayingId} not found`);
            return false;
        }
    }
    
    // Get storage statistics
    getStorageInfo() {
        if (!this.isStorageAvailable()) {
            return { available: false };
        }
        
        try {
            const data = localStorage.getItem('italianSayings');
            const version = localStorage.getItem('italianSayingsVersion');
            const lastSaved = localStorage.getItem('italianSayingsLastSaved');
            
            return {
                available: true,
                sayingsCount: this.sayings.length,
                dataSize: data ? data.length : 0,
                version: version || 'unknown',
                lastSaved: lastSaved ? new Date(lastSaved) : null
            };
        } catch (error) {
            return { available: false, error: error.message };
        }
    }
}

// Initialize the app when the page loads
let app; // Global reference for button callbacks

document.addEventListener('DOMContentLoaded', () => {
    app = new ItalianSayingsApp();
});