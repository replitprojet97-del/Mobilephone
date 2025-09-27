/**
 * LUXIO Modern JavaScript
 * Modern, performant e-commerce functionality
 */

class LuxioApp {
    constructor() {
        this.cart = new Cart();
        this.products = new ProductManager();
        this.ui = new UIManager();
        this.init();
    }

    async init() {
        // Initialize app components
        await this.products.loadProducts();
        this.ui.initializeComponents();
        this.bindEvents();
        console.log('🚀 LUXIO App initialized');
    }

    bindEvents() {
        // Search functionality
        document.querySelector('.search-btn')?.addEventListener('click', this.handleSearch.bind(this));
        document.querySelector('.search-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleFilter.bind(this));
        });

        // Load more products
        document.querySelector('.btn-load-more')?.addEventListener('click', this.loadMoreProducts.bind(this));

        // Newsletter subscription
        document.querySelector('.newsletter-form')?.addEventListener('submit', this.handleNewsletter.bind(this));
    }

    handleSearch() {
        const query = document.querySelector('.search-input')?.value.trim();
        const category = document.querySelector('.search-category')?.value;
        
        if (query) {
            this.products.searchProducts(query, category);
        }
    }

    handleFilter(e) {
        e.preventDefault();
        const filterValue = e.target.textContent.toLowerCase();
        
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.products.filterProducts(filterValue);
    }

    async loadMoreProducts() {
        await this.products.loadMoreProducts();
    }

    handleNewsletter(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (this.validateEmail(email)) {
            this.ui.showNotification('Merci ! Vous êtes maintenant abonné à notre newsletter.', 'success');
            e.target.reset();
        } else {
            this.ui.showNotification('Veuillez entrer une adresse email valide.', 'error');
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.displayedProducts = 4;
        this.currentFilter = 'tous';
        this.container = document.getElementById('products-container');
    }

    async loadProducts() {
        try {
            // Try to load from existing JSON first
            const response = await fetch('/smartphones.json');
            if (response.ok) {
                const data = await response.json();
                this.products = data.smartphones || [];
            }
            
            // If no products, create demo products
            if (this.products.length === 0) {
                this.products = this.createDemoProducts();
            }
            
            this.renderProducts();
        } catch (error) {
            console.log('Loading demo products');
            this.products = this.createDemoProducts();
            this.renderProducts();
        }
    }

    createDemoProducts() {
        return [
            {
                nom: "iPhone 15 Pro Max",
                marque: "Apple",
                prix: 1299,
                image: "img/product-1.png",
                specs: "256GB • A17 Pro • 5G",
                colors: ["#000000", "#c9c9c9", "#f5f5dc", "#4169e1"]
            },
            {
                nom: "Galaxy S24 Ultra",
                marque: "Samsung",
                prix: 1199,
                image: "img/product-2.png",
                specs: "512GB • Snapdragon 8 Gen 3 • S Pen",
                colors: ["#2d2d2d", "#8b4513", "#c0c0c0", "#800080"]
            },
            {
                nom: "Google Pixel 8 Pro",
                marque: "Google",
                prix: 899,
                image: "img/product-3.png",
                specs: "256GB • Google Tensor G3 • IA",
                colors: ["#000000", "#ffffff", "#87ceeb"]
            },
            {
                nom: "OnePlus 12",
                marque: "OnePlus",
                prix: 799,
                image: "img/product-4.png",
                specs: "256GB • Snapdragon 8 Gen 3 • 120Hz",
                colors: ["#000000", "#008000", "#ffffff"]
            },
            {
                nom: "MacBook Air M3",
                marque: "Apple",
                prix: 1399,
                image: "img/product-5.png",
                specs: "15\" • Puce M3 • 8GB RAM",
                colors: ["#c0c0c0", "#2f4f4f", "#ffd700", "#000000"]
            },
            {
                nom: "AirPods Pro",
                marque: "Apple",
                prix: 279,
                image: "img/product-6.png",
                specs: "Réduction de bruit • Spatial Audio",
                colors: ["#ffffff"]
            }
        ];
    }

    renderProducts() {
        if (!this.container) return;

        const filteredProducts = this.getFilteredProducts();
        const productsToShow = filteredProducts.slice(0, this.displayedProducts);

        this.container.innerHTML = productsToShow.map(product => 
            this.createProductCard(product)
        ).join('');

        // Update load more button visibility
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 
                filteredProducts.length > this.displayedProducts ? 'block' : 'none';
        }

        // Bind product events
        this.bindProductEvents();
    }

    createProductCard(product) {
        const discount = Math.floor(Math.random() * 30) + 10; // 10-40% discount
        const originalPrice = Math.round(product.prix / (1 - discount/100));
        
        return `
            <div class="product-card" data-product='${JSON.stringify(product)}'>
                <div class="product-badge">-${discount}%</div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.nom}" class="product-image" loading="lazy">
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn" title="Ajouter aux favoris">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn compare-btn" title="Comparer">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.marque}</div>
                    <h3 class="product-title">${product.nom}</h3>
                    <div class="product-specs">${product.specs}</div>
                    <div class="product-colors">
                        ${product.colors ? product.colors.map(color => 
                            `<span class="color-dot" style="background-color: ${color}"></span>`
                        ).join('') : ''}
                    </div>
                    <div class="product-pricing">
                        <span class="price-old">${originalPrice}€</span>
                        <span class="price-new">${product.prix}€</span>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.nom}">
                        <i class="fas fa-shopping-cart"></i>
                        Ajouter au panier
                    </button>
                </div>
                <div class="product-overlay">
                    <button class="quick-view-btn">Aperçu rapide</button>
                </div>
            </div>
        `;
    }

    getFilteredProducts() {
        if (this.currentFilter === 'tous') {
            return this.products;
        }
        
        return this.products.filter(product => 
            product.marque.toLowerCase().includes(this.currentFilter) ||
            product.nom.toLowerCase().includes(this.currentFilter)
        );
    }

    filterProducts(filter) {
        this.currentFilter = filter;
        this.displayedProducts = 4;
        this.renderProducts();
    }

    searchProducts(query, category = 'tous') {
        const filteredProducts = this.products.filter(product => {
            const matchesQuery = product.nom.toLowerCase().includes(query.toLowerCase()) ||
                               product.marque.toLowerCase().includes(query.toLowerCase()) ||
                               product.specs.toLowerCase().includes(query.toLowerCase());
            
            const matchesCategory = category === 'Tous Produits' || 
                                  product.nom.toLowerCase().includes(category.toLowerCase());
            
            return matchesQuery && matchesCategory;
        });

        this.renderSearchResults(filteredProducts, query);
    }

    renderSearchResults(results, query) {
        if (results.length === 0) {
            this.container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>Aucun produit trouvé</h3>
                    <p>Aucun résultat pour "${query}"</p>
                </div>
            `;
        } else {
            this.container.innerHTML = results.map(product => 
                this.createProductCard(product)
            ).join('');
            this.bindProductEvents();
        }
    }

    async loadMoreProducts() {
        this.displayedProducts += 4;
        this.renderProducts();
    }

    bindProductEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productData = JSON.parse(e.target.closest('.product-card').dataset.product);
                app.cart.addItem(productData);
                
                // Visual feedback
                btn.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
                btn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Ajouter au panier';
                    btn.style.background = '';
                }, 2000);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                btn.classList.toggle('active');
                const icon = btn.querySelector('i');
                icon.classList.toggle('fas');
                icon.classList.toggle('far');
                
                app.ui.showNotification(
                    btn.classList.contains('active') ? 
                    'Ajouté aux favoris' : 'Retiré des favoris',
                    'info'
                );
            });
        });
    }
}

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('luxio_cart')) || [];
        this.updateDisplay();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.nom);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.nom,
                name: product.nom,
                brand: product.marque,
                price: product.prix,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.updateDisplay();
        
        app.ui.showNotification(`${product.nom} ajouté au panier`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.saveToStorage();
                this.updateDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateDisplay();
    }

    saveToStorage() {
        localStorage.setItem('luxio_cart', JSON.stringify(this.items));
    }

    updateDisplay() {
        const countElement = document.querySelector('.cart-count');
        const totalElement = document.querySelector('.cart-total');
        
        if (countElement) {
            const count = this.getItemCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'block' : 'none';
        }
        
        if (totalElement) {
            totalElement.textContent = `${this.getTotal().toFixed(2)} €`;
        }
    }
}

class UIManager {
    constructor() {
        this.initializeComponents();
    }

    initializeComponents() {
        // Smooth scrolling for anchor links
        this.initSmoothScrolling();
        
        // Intersection Observer for animations
        this.initScrollAnimations();
        
        // Search input focus handling
        this.initSearchFocus();
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                // Only process valid selectors (not just '#')
                if (href && href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe elements for animation
        document.querySelectorAll('.product-card, .category-card, .section-title').forEach(el => {
            observer.observe(el);
        });
    }

    initSearchFocus() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.style.borderColor = 'var(--secondary)';
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.style.borderColor = 'var(--border)';
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 4 seconds
        setTimeout(() => this.removeNotification(notification), 4000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }
}

// Language Manager (from existing languages.js)
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('luxio_language') || 'fr';
        this.translations = {
            fr: {
                search: 'Recherche avancée...',
                allProducts: 'Tous Produits',
                addToCart: 'Ajouter au panier',
                viewMore: 'Voir Plus de Produits'
            },
            en: {
                search: 'Advanced search...',
                allProducts: 'All Products',
                addToCart: 'Add to Cart',
                viewMore: 'View More Products'
            },
            es: {
                search: 'Búsqueda avanzada...',
                allProducts: 'Todos los Productos',
                addToCart: 'Añadir al Carrito',
                viewMore: 'Ver Más Productos'
            }
        };
        
        this.init();
    }

    init() {
        // Set up language dropdown
        document.querySelectorAll('[data-lang]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setLanguage(e.target.dataset.lang);
            });
        });
        
        this.updateLanguageDisplay();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('luxio_language', lang);
        this.updateLanguageDisplay();
        
        // Update UI text
        this.translatePage();
    }

    translatePage() {
        const translations = this.translations[this.currentLanguage] || this.translations.fr;
        
        // Update placeholder texts
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.placeholder = translations.search;
        }
        
        // Update button texts
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            if (!btn.dataset.originalText) {
                btn.dataset.originalText = btn.innerHTML;
            }
            btn.innerHTML = `<i class="fas fa-shopping-cart"></i> ${translations.addToCart}`;
        });
    }

    updateLanguageDisplay() {
        const flags = {
            fr: '🇫🇷 FR',
            en: '🇬🇧 EN',
            es: '🇪🇸 ES',
            pt: '🇵🇹 PT',
            pl: '🇵🇱 PL'
        };
        
        const currentLangElement = document.querySelector('.current-language');
        if (currentLangElement) {
            currentLangElement.textContent = flags[this.currentLanguage] || flags.fr;
        }
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LuxioApp();
    new LanguageManager();
});

// Add CSS for notifications and animations
const additionalStyles = `
/* Notifications */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    max-width: 350px;
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    box-shadow: var(--shadow-lg);
}

.notification.show {
    transform: translateX(0);
}

.notification.hide {
    transform: translateX(400px);
    opacity: 0;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
}

.notification-success { border-left: 4px solid var(--success); }
.notification-error { border-left: 4px solid var(--error); }
.notification-warning { border-left: 4px solid var(--warning); }
.notification-info { border-left: 4px solid var(--secondary); }

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 18px;
    margin-left: auto;
    padding: 0;
}

/* Product Cards */
.product-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    opacity: 0;
    transform: translateY(20px);
}

.product-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.product-card:hover {
    transform: translateY(-8px);
    border-color: var(--secondary);
    box-shadow: var(--shadow-glow);
}

.product-badge {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    background: var(--error);
    color: white;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: var(--font-weight-bold);
    z-index: 2;
}

.product-image-container {
    position: relative;
    height: 250px;
    overflow: hidden;
    background: var(--accent);
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.product-actions {
    position: absolute;
    top: var(--space-md);
    left: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
    opacity: 1;
}

.product-info {
    padding: var(--space-lg);
}

.product-brand {
    color: var(--text-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: var(--space-xs);
}

.product-title {
    font-size: 18px;
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-sm);
    color: var(--text-primary);
}

.product-specs {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: var(--space-md);
}

.product-colors {
    display: flex;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
}

.color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--border);
    cursor: pointer;
    transition: var(--transition);
}

.color-dot:hover {
    border-color: var(--secondary);
    transform: scale(1.2);
}

.product-pricing {
    margin-bottom: var(--space-md);
}

.price-old {
    color: var(--text-muted);
    text-decoration: line-through;
    font-size: 14px;
    margin-right: var(--space-sm);
}

.price-new {
    color: var(--secondary);
    font-size: 20px;
    font-weight: var(--font-weight-bold);
}

.add-to-cart-btn {
    width: 100%;
    background: var(--secondary);
    color: var(--primary);
    border: none;
    padding: var(--space-md);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
}

.add-to-cart-btn:hover {
    background: #ffed4a;
    transform: translateY(-2px);
}

.product-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
    opacity: 1;
}

.quick-view-btn {
    background: var(--secondary);
    color: var(--primary);
    border: none;
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-full);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: var(--transition);
}

.no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-xxxl);
    color: var(--text-muted);
}

.no-results i {
    margin-bottom: var(--space-lg);
    opacity: 0.5;
}

/* Wishlist active state */
.wishlist-btn.active {
    background: var(--error);
    color: white;
    border-color: var(--error);
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);