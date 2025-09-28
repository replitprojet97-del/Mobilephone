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

        // Category navigation links
        document.querySelectorAll('.category-item').forEach(link => {
            link.addEventListener('click', this.handleCategoryFilter.bind(this));
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleFilter.bind(this));
        });

        // Hero section buttons
        document.querySelector('.btn-primary')?.addEventListener('click', this.handleDiscover.bind(this));
        document.querySelector('.btn-secondary')?.addEventListener('click', this.handleViewCollections.bind(this));

        // Load more products
        document.querySelector('.btn-load-more')?.addEventListener('click', this.loadMoreProducts.bind(this));

        // Newsletter subscription
        document.querySelector('.newsletter-form')?.addEventListener('submit', this.handleNewsletter.bind(this));
        
        // Hero add to cart button (not handled by cart.js)
        document.querySelector('.hero .add-to-cart')?.addEventListener('click', this.handleHeroAddToCart.bind(this));
        
        // Bind filter buttons in featured products section
        this.bindFilterButtons();
        
        // Bind category cards in "Explorer par catégorie" section
        this.bindCategoryCards();
    }

    handleSearch() {
        const query = document.querySelector('.search-input')?.value.trim();
        const category = document.querySelector('.search-category')?.value;
        
        if (query) {
            this.products.searchProducts(query, category);
        }
    }

    handleCategoryFilter(e) {
        e.preventDefault();
        const categoryKey = e.currentTarget.getAttribute('data-translate') || 'home';
        
        // Update active category
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Reset filter buttons to "Tous" 
        document.querySelectorAll('.section-filters .filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().trim() === 'tous') {
                btn.classList.add('active');
            }
        });
        
        // Filter products by category
        this.products.filterByCategory(categoryKey);
        
        // Show products section and scroll to it
        const productsSection = document.querySelector('.featured-products');
        if (productsSection) {
            productsSection.style.display = 'block';
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Masquer les squelettes si ils existent
        document.querySelectorAll('.product-skeleton').forEach(skeleton => {
            skeleton.style.display = 'none';
        });
    }

    handleFilter(e) {
        e.preventDefault();
        const filterValue = e.currentTarget.textContent.toLowerCase().trim();
        
        console.log('🔍 Filter button clicked:', filterValue);
        
        // Filter products through ProductManager (which will handle button states)
        if (this.products) {
            this.products.filterProducts(filterValue);
        }
    }

    handleDiscover(e) {
        e.preventDefault();
        
        console.log('🔍 Découvrir button clicked');
        
        // Reset to show all products from all categories
        if (this.products) {
            this.products.products = this.products.allProducts; // Show all products
            this.products.currentFilter = 'tous';
            this.products.displayedProducts = 8;
            this.products.updateFilterButtons('tous');
            this.products.renderProducts();
        }
        
        // Reset category navigation
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-translate') === 'home') {
                item.classList.add('active');
            }
        });
        
        // Scroll to featured products section
        const featuredSection = document.querySelector('.featured-products');
        if (featuredSection) {
            featuredSection.style.display = 'block';
            featuredSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Masquer les squelettes
        document.querySelectorAll('.product-skeleton').forEach(skeleton => {
            skeleton.style.display = 'none';
        });
    }

    handleViewCollections(e) {
        e.preventDefault();
        
        console.log('🔍 Voir Collections button clicked');
        
        // Reset to show all products from all categories
        if (this.products) {
            this.products.products = this.products.allProducts; // Show all products
            this.products.currentFilter = 'tous';
            this.products.displayedProducts = 8;
            this.products.updateFilterButtons('tous');
            this.products.renderProducts();
        }
        
        // Reset category navigation
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-translate') === 'home') {
                item.classList.add('active');
            }
        });
        
        // Scroll to categories section first, then products
        const categoriesSection = document.querySelector('.categories-showcase');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Masquer les squelettes
        document.querySelectorAll('.product-skeleton').forEach(skeleton => {
            skeleton.style.display = 'none';
        });
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

    handleHeroAddToCart(e) {
        e.preventDefault();
        this.addHeroProduct(e.currentTarget);
    }

    bindFilterButtons() {
        // Bind filter buttons in featured products section
        document.querySelectorAll('.section-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active filter
                document.querySelectorAll('.section-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                const filterText = e.currentTarget.textContent.toLowerCase().trim();
                
                // Map filter button text to appropriate filter values
                let filterValue = filterText;
                if (filterText === 'tous') {
                    filterValue = 'tous';
                } else if (filterText === 'smartphones') {
                    filterValue = 'phone';
                } else if (filterText === 'accessoires') {
                    filterValue = 'accessoire';
                } else if (filterText === 'nouveautés') {
                    filterValue = 'nouveau';
                }
                
                // Ensure we show products when filtering
                this.products.filterProducts(filterValue);
                
                // Show products section if hidden
                const productsSection = document.querySelector('.featured-products');
                if (productsSection) {
                    productsSection.style.display = 'block';
                }
                
                // Hide skeletons
                document.querySelectorAll('.product-skeleton').forEach(skeleton => {
                    skeleton.style.display = 'none';
                });
            });
        });
    }
    
    bindCategoryCards() {
        // Bind category cards in "Explorer par catégorie" section
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get category from h3 text content
                const categoryTitle = card.querySelector('h3').textContent.toLowerCase().trim();
                let categoryKey = 'tous';
                
                // Map category title to filter key
                if (categoryTitle === 'smartphones') {
                    categoryKey = 'smartphones';
                } else if (categoryTitle === 'montres') {
                    categoryKey = 'watches';
                } else if (categoryTitle === 'audio') {
                    categoryKey = 'audio';
                } else if (categoryTitle === 'tech') {
                    categoryKey = 'tech';
                }
                
                // Update navigation state
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-translate') === categoryKey) {
                        item.classList.add('active');
                    }
                });
                
                // Reset filter buttons to "Tous"
                document.querySelectorAll('.section-filters .filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.textContent.toLowerCase().trim() === 'tous') {
                        btn.classList.add('active');
                    }
                });
                
                // Filter products by category
                this.products.filterByCategory(categoryKey);
                
                // Show and scroll to products section
                const productsSection = document.querySelector('.featured-products');
                if (productsSection) {
                    productsSection.style.display = 'block';
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Hide skeletons
                document.querySelectorAll('.product-skeleton').forEach(skeleton => {
                    skeleton.style.display = 'none';
                });
                
                // Add visual feedback
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
            
            // Add hover cursor
            card.style.cursor = 'pointer';
        });
    }


    addHeroProduct(button) {
        const heroProduct = {
            id: 'hero-iphone-15',
            nom: 'iPhone 15 Pro Max',
            marque: 'Apple',
            prix: 849,
            image: 'img/product-1.png',
            specs: '256GB • A17 Pro • 5G'
        };
        
        if (this.cart) {
            this.cart.addItem(heroProduct);
            this.showAddToCartFeedback(button);
        }
    }

    showAddToCartFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
        button.style.background = '#28a745';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
        
        // Notification handled by cart.js showAddToCartNotification
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
            // Load from the correct data file
            const response = await fetch('/data/products.json');
            if (response.ok) {
                const data = await response.json();
                this.allProductsData = data; // Store all data
                
                // Combine all products from all categories for "Tous" filter
                this.allProducts = [
                    ...(data.smartphones || []),
                    ...(data.watches || []),
                    ...(data.accessories || [])
                ];
                
                // Start with all products for "Tous" filter
                this.products = this.allProducts;
                console.log('✅ Loaded', this.allProducts.length, 'total products from data/products.json');
                console.log('📱 Smartphones:', (data.smartphones || []).length);
                console.log('⌚ Watches:', (data.watches || []).length);
                console.log('🔌 Accessories:', (data.accessories || []).length);
            } else {
                throw new Error('Failed to load products data');
            }
            
            // If no products, create demo products
            if (this.allProducts.length === 0) {
                console.log('⚠️ No products found, creating demo products');
                this.products = this.createDemoProducts();
                this.allProducts = this.products;
            }
            
            this.renderProducts();
        } catch (error) {
            console.error('❌ Error loading products:', error);
            console.log('📦 Loading demo products as fallback');
            this.products = this.createDemoProducts();
            this.allProducts = this.products;
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
        
        // Appliquer les traductions après génération du contenu
        if (window.LuxioLang) {
            window.LuxioLang.updatePageContent();
        }
    }

    createProductCard(product) {
        // Use real discount from data or default
        const discount = product.discount || Math.floor(Math.random() * 30) + 10;
        const originalPrice = product.originalPrice || Math.round(product.price / (1 - discount/100));
        const price = product.price || product.prix || 0;
        const productName = product.title || product.nom || 'Produit';
        const brand = product.brand || product.marque || '';
        const image = product.thumbnail || product.image || '/img/product-1.png';
        const specs = product.shortDescription || product.specs || '';
        const rating = product.rating || 4.5;
        const inStock = product.inStock !== false;
        
        return `
            <div class="product-card" data-product='${JSON.stringify(product)}' data-product-id="${product.id || productName}">
                ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ''}
                <div class="product-image-container">
                    <img src="${image}" alt="${productName}" class="product-image" loading="lazy">
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
                    <div class="product-brand">${brand}</div>
                    <h3 class="product-title">${productName}</h3>
                    <div class="product-specs">${specs}</div>
                    <div class="product-colors">
                        ${product.colors ? product.colors.map(color => 
                            `<span class="color-dot" style="background-color: ${color.code || color}"></span>`
                        ).join('') : ''}
                    </div>
                    <div class="product-rating">
                        ${this.renderStars(rating)}
                        <span class="rating-text">${rating}/5</span>
                    </div>
                    <div class="product-pricing">
                        ${originalPrice !== price ? `<span class="price-old">${originalPrice}€</span>` : ''}
                        <span class="price-new">${price}€</span>
                    </div>
                    <button class="add-to-cart-btn ${!inStock ? 'disabled' : ''}" data-product-id="${product.id || productName}" ${!inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        <span data-translate="add_to_cart">${inStock ? 'Ajouter au panier' : 'Indisponible'}</span>
                    </button>
                </div>
                <div class="product-overlay">
                    <button class="quick-view-btn">Aperçu rapide</button>
                </div>
            </div>
        `;
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return `<div class="stars">${stars}</div>`;
    }

    getFilteredProducts() {
        if (this.currentFilter === 'tous' || this.currentFilter === 'all') {
            // Show all products from current category
            return this.products;
        }
        
        const searchTerm = this.currentFilter.toLowerCase();
        
        return this.products.filter(product => {
            // Get product properties with fallback to different naming conventions
            const title = (product.title || product.nom || '').toLowerCase();
            const brand = (product.brand || product.marque || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            const specs = (product.specs || product.shortDescription || '').toLowerCase();
            
            // Filter mapping for better categorization
            switch (searchTerm) {
                case 'smartphones':
                case 'smartphone':
                case 'phone':
                    return category === 'smartphones' || 
                           title.includes('iphone') || title.includes('galaxy') || 
                           title.includes('pixel') || title.includes('oneplus') ||
                           brand.includes('apple') || brand.includes('samsung') || brand.includes('google');
                           
                case 'accessoires':
                case 'accessoire':
                    return category === 'accessories' || category === 'accessoire' ||
                           title.includes('case') || title.includes('coque') || 
                           title.includes('chargeur') || title.includes('airpods') ||
                           title.includes('casque') || title.includes('écouteurs');
                           
                case 'nouveautés':
                case 'nouveauté':
                case 'new':
                    return product.isNew === true || product.isFeatured === true;
                    
                case 'montres':
                case 'watches':
                    return category === 'watches' || title.includes('watch') || title.includes('montre');
                    
                default:
                    // General search
                    return title.includes(searchTerm) || brand.includes(searchTerm) || 
                           category.includes(searchTerm) || specs.includes(searchTerm);
            }
        });
    }

    filterProducts(filter) {
        console.log('🔍 Filtering products with filter:', filter);
        this.currentFilter = filter;
        this.displayedProducts = 4;
        
        // Update filter button states
        this.updateFilterButtons(filter);
        
        this.renderProducts();
        console.log('📦 Products displayed after filter:', this.getFilteredProducts().length);
    }

    updateFilterButtons(activeFilter) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to the correct button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const btnText = btn.textContent.toLowerCase().trim();
            const filterText = activeFilter.toLowerCase();
            
            if ((btnText === 'tous' && filterText === 'tous') ||
                (btnText === 'smartphones' && filterText === 'smartphones') ||
                (btnText === 'accessoires' && filterText === 'accessoires') ||
                (btnText === 'nouveautés' && filterText === 'nouveautés')) {
                btn.classList.add('active');
            }
        });
    }

    filterByCategory(categoryKey) {
        console.log('🔍 Filtering by category:', categoryKey);
        
        // Reset to show all products for home, otherwise filter by category
        if (categoryKey === 'home') {
            this.currentFilter = 'tous';
            this.products = this.allProducts; // Show all products from all categories
        } else {
            // Load products from the appropriate category
            if (this.allProductsData) {
                switch(categoryKey) {
                    case 'smartphones':
                        this.products = this.allProductsData.smartphones || [];
                        this.currentFilter = 'tous';
                        break;
                    case 'watches':
                        this.products = this.allProductsData.watches || [];
                        this.currentFilter = 'tous';
                        break;
                    case 'audio':
                        this.products = this.allProductsData.accessories?.filter(item => 
                            item.category?.toLowerCase().includes('audio') || 
                            item.title?.toLowerCase().includes('audio') ||
                            item.title?.toLowerCase().includes('airpods') ||
                            item.title?.toLowerCase().includes('casque')
                        ) || [];
                        this.currentFilter = 'tous';
                        break;
                    case 'tech':
                        this.products = this.allProductsData.accessories?.filter(item => 
                            item.category?.toLowerCase().includes('tech') ||
                            item.title?.toLowerCase().includes('macbook') ||
                            item.title?.toLowerCase().includes('ordinateur')
                        ) || [];
                        this.currentFilter = 'tous';
                        break;
                    case 'mobility':
                        this.products = this.allProductsData.accessories?.filter(item => 
                            item.category?.toLowerCase().includes('mobility') ||
                            item.title?.toLowerCase().includes('mobilité')
                        ) || [];
                        this.currentFilter = 'tous';
                        break;
                    default:
                        // Fallback to all products
                        this.products = this.allProducts;
                        this.currentFilter = 'tous';
                }
            }
        }
        
        console.log('📦 Products after category filter:', this.products.length);
        this.displayedProducts = 8; // Show more products for categories
        
        // Update filter buttons to show "Tous" as active
        this.updateFilterButtons('tous');
        this.renderProducts();
        
        // Ensure products section is visible
        const productsSection = document.querySelector('.featured-products');
        if (productsSection) {
            productsSection.style.display = 'block';
        }
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
            
            // Appliquer les traductions après génération du contenu
            if (window.LuxioLang) {
                window.LuxioLang.updatePageContent();
            }
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