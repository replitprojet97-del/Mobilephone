/**
 * LUXIO Category Page Management
 * Gestion des pages catégories avec filtres et tri
 */

class CategoryManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.filters = {
            brand: '',
            price: '',
            storage: '',
            search: ''
        };
        this.sortBy = 'featured';
        this.category = this.detectCategory();
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.updateViewToggle();
    }

    // Détecter la catégorie actuelle basée sur l'URL
    detectCategory() {
        const path = window.location.pathname;
        if (path.includes('smartphones')) return 'smartphones';
        if (path.includes('watches')) return 'watches';
        if (path.includes('fashion')) return 'fashion';
        if (path.includes('home')) return 'home';
        if (path.includes('mobility')) return 'mobility';
        if (path.includes('services')) return 'services';
        return 'smartphones'; // default
    }

    // Charger les produits depuis le fichier JSON
    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            
            this.products = data[this.category] || [];
            this.filteredProducts = [...this.products];
            
            this.renderNewArrivals();
            this.applyFilters();
            this.updateProductCount();
            
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            this.showError('Impossible de charger les produits. Veuillez recharger la page.');
        }
    }

    // Rendre la section "Dernières sorties"
    renderNewArrivals() {
        const container = document.getElementById('new-arrivals-grid');
        if (!container) return;

        const newProducts = this.products.filter(product => product.isNew).slice(0, 3);
        
        if (newProducts.length === 0) {
            document.getElementById('new-arrivals').style.display = 'none';
            return;
        }

        container.innerHTML = newProducts.map(product => `
            <div class="new-arrival-card" data-product-id="${product.id}">
                <div class="card-image">
                    <img src="${product.thumbnail || product.images[0]}" alt="${product.title}" loading="lazy">
                    <div class="card-badges">
                        <span class="badge new">Nouveau</span>
                        ${product.discount ? `<span class="badge discount">-${product.discount}%</span>` : ''}
                    </div>
                    <button class="wishlist-btn heart-btn" data-product-id="${product.id}" 
                            data-product-title="${product.title}" 
                            data-product-brand="${product.brand}"
                            data-product-price="${product.price}"
                            data-product-image="${product.thumbnail || product.images[0]}"
                            data-product-slug="${product.slug}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-brand">${product.brand}</div>
                    <h3 class="card-title">${product.title}</h3>
                    <div class="card-specs">
                        <span class="spec">${product.storage}</span>
                        <span class="spec">${product.color}</span>
                    </div>
                    <div class="card-rating">
                        ${this.renderStars(product.rating)}
                        <span class="rating-text">${product.rating}/5 (${product.reviewCount})</span>
                    </div>
                    <div class="card-price">
                        ${product.originalPrice ? `<span class="price-old">${product.originalPrice}€</span>` : ''}
                        <span class="price-current">${product.price}€</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Ajouter au panier
                        </button>
                        <a href="../product/${product.slug}.html" class="btn-view-product">
                            Voir détails
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
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

    // Appliquer les filtres
    applyFilters() {
        let filtered = [...this.products];

        // Filtre par marque
        if (this.filters.brand) {
            filtered = filtered.filter(product => 
                product.brand.toLowerCase() === this.filters.brand.toLowerCase()
            );
        }

        // Filtre par prix
        if (this.filters.price) {
            const [min, max] = this.filters.price.split('-').map(p => 
                p.includes('+') ? Infinity : parseInt(p)
            );
            filtered = filtered.filter(product => {
                const price = product.price;
                return price >= min && (max === Infinity || price <= max);
            });
        }

        // Filtre par stockage
        if (this.filters.storage) {
            const storageValue = parseInt(this.filters.storage);
            filtered = filtered.filter(product => 
                product.storage && parseInt(product.storage) === storageValue
            );
        }

        // Filtre par recherche
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.model.toLowerCase().includes(searchTerm)
            );
        }

        this.filteredProducts = filtered;
        this.applySorting();
        this.renderProducts();
        this.updateActiveFilters();
        this.updateProductCount();
    }

    // Appliquer le tri
    applySorting() {
        switch (this.sortBy) {
            case 'newest':
                this.filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return b.rating - a.rating;
                });
                break;
        }
    }

    // Rendre les produits
    renderProducts() {
        const container = document.getElementById('products-grid');
        const loading = document.getElementById('loading');
        
        if (!container) return;

        // Masquer le loading
        if (loading) loading.style.display = 'none';

        // Calculer la pagination
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(0, endIndex);

        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <div class="no-products-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos filtres ou votre recherche</p>
                    <button class="btn-primary" onclick="categoryManager.clearAllFilters()">
                        Effacer tous les filtres
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = productsToShow.map(product => {
            if (this.currentView === 'list') {
                return this.renderProductListItem(product);
            } else {
                return this.renderProductGridItem(product);
            }
        }).join('');

        // Mettre à jour le bouton "Charger plus"
        this.updateLoadMoreButton();
    }

    // Rendre un produit en vue grille
    renderProductGridItem(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.thumbnail || product.images[0]}" alt="${product.title}" loading="lazy">
                    <div class="product-badges">
                        ${product.isNew ? '<span class="badge new">Nouveau</span>' : ''}
                        ${product.discount ? `<span class="badge discount">-${product.discount}%</span>` : ''}
                        ${!product.inStock ? '<span class="badge out-of-stock">Rupture</span>' : ''}
                    </div>
                    <button class="wishlist-btn heart-btn" data-product-id="${product.id}" 
                            data-product-title="${product.title}" 
                            data-product-brand="${product.brand}"
                            data-product-price="${product.price}"
                            data-product-image="${product.thumbnail || product.images[0]}"
                            data-product-slug="${product.slug}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-specs">
                        <span class="spec">${product.storage}</span>
                        <span class="spec">${product.color}</span>
                    </div>
                    <div class="product-rating">
                        ${this.renderStars(product.rating)}
                        <span class="rating-text">${product.rating}/5</span>
                    </div>
                    <div class="product-price">
                        ${product.originalPrice ? `<span class="price-old">${product.originalPrice}€</span>` : ''}
                        <span class="price-current">${product.price}€</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.inStock ? 'Ajouter' : 'Indisponible'}
                        </button>
                        <a href="../product/${product.slug}.html" class="btn-view-product">
                            Détails
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Rendre un produit en vue liste
    renderProductListItem(product) {
        return `
            <div class="product-list-item" data-product-id="${product.id}">
                <div class="item-image">
                    <img src="${product.thumbnail || product.images[0]}" alt="${product.title}" loading="lazy">
                    <div class="item-badges">
                        ${product.isNew ? '<span class="badge new">Nouveau</span>' : ''}
                        ${product.discount ? `<span class="badge discount">-${product.discount}%</span>` : ''}
                    </div>
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <div class="item-brand">${product.brand}</div>
                        <button class="wishlist-btn heart-btn" data-product-id="${product.id}" 
                                data-product-title="${product.title}" 
                                data-product-brand="${product.brand}"
                                data-product-price="${product.price}"
                                data-product-image="${product.thumbnail || product.images[0]}"
                                data-product-slug="${product.slug}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    <h3 class="item-title">${product.title}</h3>
                    <p class="item-description">${product.shortDescription}</p>
                    <div class="item-specs">
                        <span class="spec"><i class="fas fa-hdd"></i> ${product.storage}</span>
                        <span class="spec"><i class="fas fa-palette"></i> ${product.color}</span>
                        <span class="spec"><i class="fas fa-star"></i> ${product.rating}/5 (${product.reviewCount})</span>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-price">
                        ${product.originalPrice ? `<span class="price-old">${product.originalPrice}€</span>` : ''}
                        <span class="price-current">${product.price}€</span>
                    </div>
                    <div class="actions-buttons">
                        <button class="btn-add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                        <a href="../product/${product.slug}.html" class="btn-view-product">
                            <i class="fas fa-eye"></i>
                            Voir les détails
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Mettre à jour le bouton "Charger plus"
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.productsPerPage;
        const hasMore = totalShown < this.filteredProducts.length;

        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }

    // Charger plus de produits
    loadMore() {
        this.currentPage++;
        this.renderProducts();
    }

    // Mettre à jour les filtres actifs
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        const filterTagsContainer = document.getElementById('filter-tags');
        
        if (!activeFiltersContainer || !filterTagsContainer) return;

        const activeTags = [];
        
        if (this.filters.brand) {
            activeTags.push({ type: 'brand', label: `Marque: ${this.filters.brand}`, value: this.filters.brand });
        }
        
        if (this.filters.price) {
            const priceLabels = {
                '0-500': 'Moins de 500€',
                '500-1000': '500€ - 1000€',
                '1000-1500': '1000€ - 1500€',
                '1500+': 'Plus de 1500€'
            };
            activeTags.push({ type: 'price', label: `Prix: ${priceLabels[this.filters.price]}`, value: this.filters.price });
        }
        
        if (this.filters.storage) {
            activeTags.push({ type: 'storage', label: `Stockage: ${this.filters.storage} GB`, value: this.filters.storage });
        }

        if (activeTags.length === 0) {
            activeFiltersContainer.style.display = 'none';
            return;
        }

        activeFiltersContainer.style.display = 'flex';
        filterTagsContainer.innerHTML = activeTags.map(tag => `
            <span class="filter-tag" data-type="${tag.type}" data-value="${tag.value}">
                ${tag.label}
                <button class="remove-filter" aria-label="Supprimer le filtre">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');
    }

    // Mettre à jour le compteur de produits
    updateProductCount() {
        const countElement = document.getElementById('results-count');
        const headerCountElement = document.getElementById('products-count');
        
        const count = this.filteredProducts.length;
        
        if (countElement) {
            countElement.textContent = `${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
        }
        
        if (headerCountElement) {
            headerCountElement.textContent = count;
        }
    }

    // Mettre à jour la vue (grille/liste)
    updateViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('products-grid');
        
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });
        
        if (productsGrid) {
            productsGrid.className = `products-grid ${this.currentView}-view`;
        }
    }

    // Effacer tous les filtres
    clearAllFilters() {
        this.filters = {
            brand: '',
            price: '',
            storage: '',
            search: ''
        };
        this.currentPage = 1;
        
        // Réinitialiser les selects
        const brandFilter = document.getElementById('brand-filter');
        const priceFilter = document.getElementById('price-filter');
        const storageFilter = document.getElementById('storage-filter');
        
        if (brandFilter) brandFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (storageFilter) storageFilter.value = '';
        
        this.applyFilters();
    }

    // Supprimer un filtre spécifique
    removeFilter(type, value) {
        this.filters[type] = '';
        this.currentPage = 1;
        
        // Réinitialiser le select correspondant
        const filterElement = document.getElementById(`${type}-filter`);
        if (filterElement) {
            filterElement.value = '';
        }
        
        this.applyFilters();
    }

    // Lier les événements
    bindEvents() {
        // Filtres
        const brandFilter = document.getElementById('brand-filter');
        const priceFilter = document.getElementById('price-filter');
        const storageFilter = document.getElementById('storage-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (brandFilter) {
            brandFilter.addEventListener('change', (e) => {
                this.filters.brand = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.filters.price = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        if (storageFilter) {
            storageFilter.addEventListener('change', (e) => {
                this.filters.storage = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Boutons de vue
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentView = btn.dataset.view;
                this.updateViewToggle();
                this.renderProducts();
            });
        });

        // Bouton charger plus
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        // Effacer tous les filtres
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }

        // Supprimer des filtres individuels
        document.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-filter');
            if (removeBtn) {
                const filterTag = removeBtn.closest('.filter-tag');
                const type = filterTag.dataset.type;
                const value = filterTag.dataset.value;
                this.removeFilter(type, value);
            }
        });

        // Ajouter au panier depuis la catégorie
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.btn-add-to-cart');
            if (addToCartBtn && !addToCartBtn.disabled) {
                const productId = addToCartBtn.dataset.productId;
                const product = this.products.find(p => p.id === productId);
                
                if (product && window.cartManager) {
                    window.cartManager.addToCart(product, 1);
                    this.showToast(`${product.title} ajouté au panier`, 'success');
                }
            }
        });
    }

    // Afficher une erreur
    showError(message) {
        const container = document.getElementById('products-grid');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Une erreur s'est produite</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="location.reload()">
                        Recharger la page
                    </button>
                </div>
            `;
        }
    }

    // Afficher un toast
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`Toast ${type}: ${message}`);
        }
    }
}

// Initialiser le gestionnaire de catégorie
window.categoryManager = new CategoryManager();

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryManager;
}