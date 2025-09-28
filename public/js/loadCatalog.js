/**
 * LUXIO Dynamic Catalog Loader
 * Handles loading hundreds of products across multiple JSON files
 * Auto-detects available part files and loads them progressively
 */

class CatalogLoader {
    constructor() {
        this.allProducts = [];
        this.displayedProducts = [];
        this.currentPage = 0;
        this.productsPerPage = 20;
        this.category = '';
        this.isLoading = false;
        this.maxRetries = 1000; // Very high limit for part files (virtually unlimited)
    }

    /**
     * Initialize catalog for a specific category
     * @param {string} category - The product category (smartphones, watches, accessories)
     */
    async loadAll(category) {
        this.category = category;
        this.allProducts = [];
        this.displayedProducts = [];
        this.currentPage = 0;

        console.log(`🚀 Loading catalog for category: ${category}`);
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // First try to load from existing products.json if available
            await this.loadFromMainFile();
            
            // Then load from part files
            await this.loadPartFiles();
            
            if (this.allProducts.length === 0) {
                this.showNoProducts();
                return;
            }

            console.log(`✅ Loaded ${this.allProducts.length} products for ${category}`);
            
            // Initialize the display
            this.renderInitialProducts();
            this.setupLoadMoreButton();
            
        } catch (error) {
            console.error('❌ Error loading catalog:', error);
            this.showError();
        }
    }

    /**
     * Load products from main products.json file
     */
    async loadFromMainFile() {
        try {
            const response = await fetch(`/data/products.json?v=${Date.now()}`, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                const categoryKey = this.getCategoryKey();
                
                if (data[categoryKey] && Array.isArray(data[categoryKey])) {
                    this.allProducts.push(...data[categoryKey]);
                    console.log(`📦 Loaded ${data[categoryKey].length} products from main file`);
                }
            }
        } catch (error) {
            console.log('📋 Main products.json not found, loading from part files only');
        }
    }

    /**
     * Auto-detect and load all part files for the category
     */
    async loadPartFiles() {
        const categoryKey = this.getCategoryKey();
        let partNumber = 1;
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 5; // Stop after 5 consecutive missing files

        while (partNumber <= this.maxRetries && consecutiveFailures < maxConsecutiveFailures) {
            try {
                const filename = `/data/${categoryKey}-part${partNumber}.json`;
                console.log(`🔍 Attempting to load: ${filename}`);
                
                const response = await fetch(`${filename}?v=${Date.now()}`, { cache: 'no-store' });
                
                if (response.ok) {
                    const partData = await response.json();
                    
                    if (Array.isArray(partData) && partData.length > 0) {
                        this.allProducts.push(...partData);
                        console.log(`✅ Loaded part ${partNumber}: ${partData.length} products`);
                        consecutiveFailures = 0; // Reset failure counter
                    } else {
                        console.log(`⚠️ Part ${partNumber} is empty or invalid format`);
                        consecutiveFailures++;
                    }
                } else {
                    console.log(`📭 Part ${partNumber} not found (${response.status})`);
                    consecutiveFailures++;
                }
                
                partNumber++;
                
            } catch (error) {
                console.log(`❌ Error loading part ${partNumber}:`, error.message);
                consecutiveFailures++;
                partNumber++;
            }
        }

        console.log(`🔍 Finished scanning. Found ${this.allProducts.length} total products.`);
    }

    /**
     * Get the correct category key for file naming
     */
    getCategoryKey() {
        const categoryMap = {
            'smartphones': 'smartphones',
            'watches': 'watches', 
            'montres': 'watches',
            'accessories': 'accessories',
            'accessoires': 'accessories',
            'mobility': 'mobility',
            'mobilite': 'mobility'
        };
        return categoryMap[this.category] || this.category;
    }

    /**
     * Render the first batch of products
     */
    renderInitialProducts() {
        this.hideLoadingState();
        this.currentPage = 0;
        this.displayedProducts = [];
        this.loadMoreProducts();
    }

    /**
     * Load and display more products (batch loading)
     */
    loadMoreProducts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const startIndex = this.currentPage * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        
        const newProducts = this.allProducts.slice(startIndex, endIndex);
        
        if (newProducts.length === 0) {
            this.hideLoadMoreButton();
            this.isLoading = false;
            return;
        }

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        newProducts.forEach(product => {
            const productElement = this.createProductElement(product);
            fragment.appendChild(productElement);
        });

        const container = document.getElementById('product-grid');
        if (container) {
            container.appendChild(fragment);
        }

        this.displayedProducts.push(...newProducts);
        this.currentPage++;
        
        // Update load more button
        const hasMore = (this.currentPage * this.productsPerPage) < this.allProducts.length;
        this.updateLoadMoreButton(hasMore);
        
        console.log(`📱 Displayed ${this.displayedProducts.length}/${this.allProducts.length} products`);
        
        this.isLoading = false;
    }

    /**
     * Create HTML element for a single product
     */
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.setAttribute('data-id', product.id);
        
        const isOnSale = product.discount && product.discount > 0;
        const displayPrice = product.price || 0;
        const originalPrice = product.originalPrice || displayPrice;
        
        productDiv.innerHTML = `
            <div class="product-image-container">
                ${isOnSale ? `<div class="product-badge">-${product.discount}%</div>` : ''}
                ${product.isNew ? '<div class="product-badge new">Nouveau</div>' : ''}
                <img src="${product.thumbnail || product.images?.[0] || '/img/placeholder.png'}" 
                     alt="${product.title}" 
                     class="product-image"
                     loading="lazy">
                <div class="product-actions">
                    <button class="btn-wishlist" onclick="toggleWishlist('${product.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-quick-view" onclick="quickView('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand || ''}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    ${this.generateStars(product.rating || 4.5)}
                    <span class="rating-count">(${product.reviewCount || 0})</span>
                </div>
                <div class="product-price">
                    ${isOnSale ? `<span class="price-old">${originalPrice.toFixed(2)}€</span>` : ''}
                    <span class="price-current">${displayPrice.toFixed(2)}€</span>
                </div>
                <button class="btn-add-cart" onclick="addToCart('${product.id}')">
                    <i class="fas fa-shopping-bag"></i>
                    <span>Ajouter au panier</span>
                </button>
            </div>
        `;
        
        return productDiv;
    }

    /**
     * Generate star rating HTML
     */
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    /**
     * Setup the "Load More" button functionality
     */
    setupLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.onclick = () => this.loadMoreProducts();
            
            const hasMore = (this.currentPage * this.productsPerPage) < this.allProducts.length;
            this.updateLoadMoreButton(hasMore);
        }
    }

    /**
     * Update load more button state
     */
    updateLoadMoreButton(hasMore) {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Charger plus de produits (${this.allProducts.length - this.displayedProducts.length} restants)
            `;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    /**
     * Hide load more button
     */
    hideLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const container = document.getElementById('product-grid');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <h3>Chargement des produits...</h3>
                    <p>Découverte automatique des fichiers de données</p>
                </div>
            `;
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const container = document.getElementById('product-grid');
        if (container) {
            container.innerHTML = '';
        }
    }

    /**
     * Show no products message
     */
    showNoProducts() {
        const container = document.getElementById('product-grid');
        if (container) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <h3>Aucun produit trouvé</h3>
                    <p>Cette catégorie sera bientôt disponible avec de nouveaux produits.</p>
                </div>
            `;
        }
    }

    /**
     * Show error message
     */
    showError() {
        const container = document.getElementById('product-grid');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erreur de chargement</h3>
                    <p>Impossible de charger les produits. Veuillez réessayer.</p>
                    <button onclick="location.reload()" class="btn-retry">Réessayer</button>
                </div>
            `;
        }
    }
}

// Global instance
const catalogLoader = new CatalogLoader();

/**
 * Global function to load catalog for a category
 * Called from HTML pages: loadAll('smartphones')
 */
async function loadAll(category) {
    await catalogLoader.loadAll(category);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LUXIO Catalog Loader initialized');
});