/**
 * LUXIO - Système de filtres pour les pages catégories
 * Logique de filtrage réutilisable pour toutes les catégories
 */

class FiltersManager {
    constructor(category) {
        this.category = category;
        this.currentFilters = {
            search: '',
            brand: '',
            minPrice: null,
            maxPrice: null,
            storage: '',
            inStock: undefined // Ne pas filtrer par défaut sur la disponibilité
        };
        this.currentSort = 'featured';
        
        // Debug: Log the initialization
        console.log('FiltersManager initialized for category:', category);
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentProducts = [];
        this.allProducts = [];
        
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.bindEvents();
        this.updateFilters();
    }

    // Charger les produits de la catégorie
    async loadProducts() {
        try {
            if (window.productsManager) {
                console.log('Loading products for category:', this.category);
                await window.productsManager.waitForLoad(); // S'assurer que les données sont chargées
                this.allProducts = await window.productsManager.getProductsByCategory(this.category);
                console.log('Loaded products:', this.allProducts.length);
                this.currentProducts = [...this.allProducts];
                
                await this.populateFilterOptions();
                this.applyFiltersAndSort();
            } else {
                console.error('ProductsManager not available');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
        }
    }

    // Populer les options des filtres
    async populateFilterOptions() {
        await this.populateBrandFilter();
        await this.populateStorageFilter();
    }

    // Populer le filtre des marques
    async populateBrandFilter() {
        const brandSelect = document.getElementById('brand-filter');
        if (!brandSelect || !window.productsManager) return;

        try {
            const brands = await window.productsManager.getBrandsByCategory(this.category);
            
            brandSelect.innerHTML = '<option value="">Toutes les marques</option>';
            brands.forEach(brand => {
                brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
            });
        } catch (error) {
            console.error('Erreur lors de la population des marques:', error);
        }
    }

    // Populer le filtre des capacités de stockage
    async populateStorageFilter() {
        const storageSelect = document.getElementById('storage-filter');
        if (!storageSelect || !window.productsManager) return;

        try {
            const storages = await window.productsManager.getStorageByCategory(this.category);
            
            storageSelect.innerHTML = '<option value="">Toutes les capacités</option>';
            storages.forEach(storage => {
                storageSelect.innerHTML += `<option value="${storage}">${storage}</option>`;
            });
        } catch (error) {
            console.error('Erreur lors de la population des capacités:', error);
        }
    }

    // Rechercher des produits
    searchProducts(query) {
        this.currentFilters.search = query;
        this.currentPage = 1;
        this.applyFiltersAndSort();
    }

    // Filtrer par marque
    filterByBrand(brand) {
        this.currentFilters.brand = brand;
        this.currentPage = 1;
        this.applyFiltersAndSort();
    }

    // Filtrer par prix
    filterByPrice(minPrice, maxPrice) {
        this.currentFilters.minPrice = minPrice ? parseFloat(minPrice) : null;
        this.currentFilters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
        this.currentPage = 1;
        this.applyFiltersAndSort();
    }

    // Filtrer par capacité
    filterByStorage(storage) {
        this.currentFilters.storage = storage;
        this.currentPage = 1;
        this.applyFiltersAndSort();
    }

    // Trier les produits
    sortProducts(sortBy) {
        this.currentSort = sortBy;
        this.applyFiltersAndSort();
    }

    // Appliquer tous les filtres et le tri
    async applyFiltersAndSort() {
        try {
            if (!window.productsManager) return;

            // Appliquer les filtres
            this.currentProducts = await window.productsManager.filterProducts(
                this.currentFilters, 
                this.category
            );

            // Appliquer le tri
            this.currentProducts = window.productsManager.sortProducts(
                this.currentProducts, 
                this.currentSort
            );

            // Rendre les produits
            this.renderProducts();
            this.updateUI();

        } catch (error) {
            console.error('Erreur lors de l\'application des filtres:', error);
        }
    }

    // Rendre les produits
    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        // Calculer la pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.currentProducts.slice(0, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <div class="no-products-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                    <button class="btn-primary" onclick="filtersManager.clearFilters()">
                        Effacer les filtres
                    </button>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToShow.map(product => this.renderProductCard(product)).join('');
        
        // Mettre à jour le bouton "Charger plus"
        this.updateLoadMoreButton();
    }

    // Rendre une carte produit
    renderProductCard(product) {
        const discountBadge = product.discount ? `<div class="product-badge">-${product.discount}%</div>` : '';
        const stockStatus = product.inStock ? '' : 'disabled';
        const addToCartText = product.inStock ? 'Ajouter au panier' : 'Indisponible';
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${discountBadge}
                    <img src="${product.thumbnail || product.images?.[0] || 'img/product-1.png'}" 
                         alt="${product.title}" 
                         loading="lazy">
                    <div class="product-overlay">
                        <button class="btn-quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-wishlist heart-btn" 
                                data-product-id="${product.id}"
                                data-product-title="${product.title}"
                                data-product-brand="${product.brand}"
                                data-product-price="${product.price}"
                                data-product-image="${product.thumbnail || product.images?.[0] || 'img/product-1.png'}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-specs">
                        ${product.storage ? `<span class="spec">${product.storage}</span>` : ''}
                        ${product.color ? `<span class="spec">${product.color}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${this.renderStars(product.rating || 4.0)}
                        <span class="rating-text">${product.rating || 4.0}/5</span>
                        ${product.reviewCount ? `<span class="review-count">(${product.reviewCount})</span>` : ''}
                    </div>
                    <div class="product-price">
                        ${product.originalPrice ? `<span class="price-old">${product.originalPrice}€</span>` : ''}
                        <span class="price-current">${product.price}€</span>
                    </div>
                    <button class="btn-add-to-cart ${stockStatus}" 
                            data-product-id="${product.id}" 
                            ${stockStatus}>
                        <i class="fas fa-shopping-cart"></i>
                        ${addToCartText}
                    </button>
                </div>
            </div>
        `;
    }

    // Rendre les étoiles de notation
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

    // Mettre à jour l'interface utilisateur
    updateUI() {
        this.updateProductCount();
        this.updateActiveFilters();
    }

    // Mettre à jour le compteur de produits
    updateProductCount() {
        const countElement = document.getElementById('products-count');
        if (countElement) {
            const count = this.currentProducts.length;
            countElement.textContent = `${count} produit${count > 1 ? 's' : ''}`;
        }
    }

    // Mettre à jour les filtres actifs
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;

        const activeFilters = [];
        
        if (this.currentFilters.search) {
            activeFilters.push({
                type: 'search',
                label: `Recherche: ${this.currentFilters.search}`,
                value: this.currentFilters.search
            });
        }
        
        if (this.currentFilters.brand) {
            activeFilters.push({
                type: 'brand',
                label: `Marque: ${this.currentFilters.brand}`,
                value: this.currentFilters.brand
            });
        }
        
        if (this.currentFilters.minPrice || this.currentFilters.maxPrice) {
            const min = this.currentFilters.minPrice || 0;
            const max = this.currentFilters.maxPrice || 'infini';
            activeFilters.push({
                type: 'price',
                label: `Prix: ${min}€ - ${max}€`,
                value: 'price'
            });
        }
        
        if (this.currentFilters.storage) {
            activeFilters.push({
                type: 'storage',
                label: `Stockage: ${this.currentFilters.storage}`,
                value: this.currentFilters.storage
            });
        }

        if (activeFilters.length === 0) {
            activeFiltersContainer.style.display = 'none';
            return;
        }

        activeFiltersContainer.style.display = 'block';
        activeFiltersContainer.innerHTML = `
            <div class="active-filters-header">
                <span>Filtres actifs:</span>
                <button class="btn-clear-all" onclick="filtersManager.clearFilters()">
                    Tout effacer
                </button>
            </div>
            <div class="filters-tags">
                ${activeFilters.map(filter => `
                    <span class="filter-tag" data-type="${filter.type}">
                        ${filter.label}
                        <button class="remove-filter" onclick="filtersManager.removeFilter('${filter.type}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </span>
                `).join('')}
            </div>
        `;
    }

    // Mettre à jour le bouton "Charger plus"
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.itemsPerPage;
        const hasMore = totalShown < this.currentProducts.length;

        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Charger plus (${this.currentProducts.length - totalShown} restants)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Charger plus de produits
    loadMore() {
        this.currentPage++;
        this.renderProducts();
    }

    // Effacer tous les filtres
    clearFilters() {
        this.currentFilters = {
            search: '',
            brand: '',
            minPrice: null,
            maxPrice: null,
            storage: '',
            inStock: true
        };
        this.currentPage = 1;
        
        // Réinitialiser les éléments du DOM
        const searchInput = document.getElementById('search-input');
        const brandSelect = document.getElementById('brand-filter');
        const priceMinInput = document.getElementById('price-min');
        const priceMaxInput = document.getElementById('price-max');
        const storageSelect = document.getElementById('storage-filter');
        
        if (searchInput) searchInput.value = '';
        if (brandSelect) brandSelect.value = '';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (storageSelect) storageSelect.value = '';
        
        this.applyFiltersAndSort();
    }

    // Supprimer un filtre spécifique
    removeFilter(type) {
        switch (type) {
            case 'search':
                this.currentFilters.search = '';
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';
                break;
            case 'brand':
                this.currentFilters.brand = '';
                const brandSelect = document.getElementById('brand-filter');
                if (brandSelect) brandSelect.value = '';
                break;
            case 'price':
                this.currentFilters.minPrice = null;
                this.currentFilters.maxPrice = null;
                const priceMinInput = document.getElementById('price-min');
                const priceMaxInput = document.getElementById('price-max');
                if (priceMinInput) priceMinInput.value = '';
                if (priceMaxInput) priceMaxInput.value = '';
                break;
            case 'storage':
                this.currentFilters.storage = '';
                const storageSelect = document.getElementById('storage-filter');
                if (storageSelect) storageSelect.value = '';
                break;
        }
        
        this.currentPage = 1;
        this.applyFiltersAndSort();
    }

    // Mettre à jour les filtres (appelé depuis les événements)
    updateFilters() {
        const searchInput = document.getElementById('search-input');
        const brandSelect = document.getElementById('brand-filter');
        const priceMinInput = document.getElementById('price-min');
        const priceMaxInput = document.getElementById('price-max');
        const storageSelect = document.getElementById('storage-filter');
        const sortSelect = document.getElementById('sort-filter');

        if (searchInput) {
            this.currentFilters.search = searchInput.value;
        }
        if (brandSelect) {
            this.currentFilters.brand = brandSelect.value;
        }
        if (priceMinInput && priceMaxInput) {
            this.currentFilters.minPrice = priceMinInput.value ? parseFloat(priceMinInput.value) : null;
            this.currentFilters.maxPrice = priceMaxInput.value ? parseFloat(priceMaxInput.value) : null;
        }
        if (storageSelect) {
            this.currentFilters.storage = storageSelect.value;
        }
        if (sortSelect) {
            this.currentSort = sortSelect.value;
        }

        this.currentPage = 1;
        this.applyFiltersAndSort();
    }

    // Lier les événements
    bindEvents() {
        // Recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchProducts(e.target.value);
                }, 300);
            });
        }

        // Filtres
        const brandSelect = document.getElementById('brand-filter');
        const storageSelect = document.getElementById('storage-filter');
        const sortSelect = document.getElementById('sort-filter');
        const priceMinInput = document.getElementById('price-min');
        const priceMaxInput = document.getElementById('price-max');

        if (brandSelect) {
            brandSelect.addEventListener('change', (e) => {
                this.filterByBrand(e.target.value);
            });
        }

        if (storageSelect) {
            storageSelect.addEventListener('change', (e) => {
                this.filterByStorage(e.target.value);
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        if (priceMinInput && priceMaxInput) {
            let priceTimeout;
            const updatePrice = () => {
                clearTimeout(priceTimeout);
                priceTimeout = setTimeout(() => {
                    this.filterByPrice(priceMinInput.value, priceMaxInput.value);
                }, 500);
            };

            priceMinInput.addEventListener('input', updatePrice);
            priceMaxInput.addEventListener('input', updatePrice);
        }

        // Bouton "Charger plus"
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        // Ajouter au panier
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.btn-add-to-cart');
            if (addToCartBtn && !addToCartBtn.disabled) {
                const productId = addToCartBtn.dataset.productId;
                this.addToCart(productId);
            }
        });
    }

    // Ajouter un produit au panier
    async addToCart(productId) {
        try {
            const product = this.currentProducts.find(p => p.id === productId);
            if (product && window.cartManager) {
                window.cartManager.addToCart(product, 1);
                this.showNotification(`${product.title} ajouté au panier`, 'success');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            this.showNotification('Erreur lors de l\'ajout au panier', 'error');
        }
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        // Utiliser le système de notifications existant si disponible
        if (window.showToast) {
            window.showToast(message, type);
            return;
        }

        // Fallback: notification simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            z-index: 10000;
            transition: all 0.3s ease;
        `;

        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            default:
                notification.style.backgroundColor = '#007bff';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Export pour utilisation globale
window.FiltersManager = FiltersManager;