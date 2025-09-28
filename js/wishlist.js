/**
 * LUXIO Wishlist Management System
 * Gestion de la liste de souhaits avec localStorage
 */

class WishlistManager {
    constructor() {
        this.storageKey = 'luxio_wishlist';
        this.wishlist = this.loadWishlist();
        this.init();
    }

    init() {
        this.updateWishlistUI();
        this.bindEvents();
        this.updateWishlistCount();
    }

    // Charger la wishlist depuis localStorage
    loadWishlist() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erreur chargement wishlist:', error);
            return [];
        }
    }

    // Sauvegarder la wishlist dans localStorage
    saveWishlist() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
            this.updateWishlistCount();
        } catch (error) {
            console.error('Erreur sauvegarde wishlist:', error);
        }
    }

    // Ajouter un produit à la wishlist
    addToWishlist(product) {
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex === -1) {
            this.wishlist.push({
                id: product.id,
                title: product.title,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.thumbnail || product.images[0],
                slug: product.slug,
                addedAt: new Date().toISOString()
            });
            
            this.saveWishlist();
            this.showToast(`${product.title} ajouté aux favoris`, 'success');
            return true;
        }
        
        return false; // Déjà dans la wishlist
    }

    // Retirer un produit de la wishlist
    removeFromWishlist(productId) {
        const initialLength = this.wishlist.length;
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        
        if (this.wishlist.length < initialLength) {
            this.saveWishlist();
            this.showToast('Produit retiré des favoris', 'info');
            return true;
        }
        
        return false;
    }

    // Basculer l'état d'un produit dans la wishlist
    toggleWishlist(product) {
        if (this.isInWishlist(product.id)) {
            this.removeFromWishlist(product.id);
            return false;
        } else {
            this.addToWishlist(product);
            return true;
        }
    }

    // Vérifier si un produit est dans la wishlist
    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    // Obtenir la wishlist complète
    getWishlist() {
        return this.wishlist;
    }

    // Vider la wishlist
    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
        this.showToast('Liste de souhaits vidée', 'info');
    }

    // Mettre à jour le compteur de la wishlist
    updateWishlistCount() {
        const countElements = document.querySelectorAll('.wishlist-count, .heart-count');
        const count = this.wishlist.length;
        
        countElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });

        // Mettre à jour l'icône cœur dans le header
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.classList.toggle('has-items', count > 0);
        }
    }

    // Mettre à jour l'UI des boutons cœur
    updateWishlistUI() {
        const heartButtons = document.querySelectorAll('.wishlist-btn, .heart-btn');
        
        heartButtons.forEach(button => {
            const productId = button.dataset.productId;
            if (productId) {
                const isInWishlist = this.isInWishlist(productId);
                button.classList.toggle('active', isInWishlist);
                
                const icon = button.querySelector('i');
                if (icon) {
                    icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
                }
            }
        });
    }

    // Lier les événements
    bindEvents() {
        // Boutons cœur sur les produits
        document.addEventListener('click', (e) => {
            const heartBtn = e.target.closest('.wishlist-btn, .heart-btn');
            if (heartBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const productData = this.getProductDataFromElement(heartBtn);
                if (productData) {
                    const isActive = this.toggleWishlist(productData);
                    heartBtn.classList.toggle('active', isActive);
                    
                    const icon = heartBtn.querySelector('i');
                    if (icon) {
                        icon.className = isActive ? 'fas fa-heart' : 'far fa-heart';
                    }
                }
            }
        });

        // Icône cœur dans le header
        const headerHeart = document.querySelector('.heart-icon-link');
        if (headerHeart) {
            headerHeart.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWishlistModal();
            });
        }
    }

    // Extraire les données produit depuis l'élément DOM
    getProductDataFromElement(element) {
        const productCard = element.closest('.product-card, .featured-product, .product-item');
        if (!productCard) return null;

        return {
            id: element.dataset.productId || productCard.dataset.productId,
            title: element.dataset.productTitle || productCard.querySelector('.product-title, h3, h4')?.textContent?.trim(),
            brand: element.dataset.productBrand || productCard.dataset.brand,
            price: parseFloat(element.dataset.productPrice) || this.extractPrice(productCard),
            originalPrice: parseFloat(element.dataset.originalPrice),
            thumbnail: element.dataset.productImage || productCard.querySelector('img')?.src,
            slug: element.dataset.productSlug || productCard.dataset.slug
        };
    }

    // Extraire le prix depuis l'élément DOM
    extractPrice(element) {
        const priceElement = element.querySelector('.price-new, .product-price, .price');
        if (priceElement) {
            const priceText = priceElement.textContent.replace(/[^\d,.-]/g, '').replace(',', '.');
            return parseFloat(priceText) || 0;
        }
        return 0;
    }

    // Ouvrir la modal de wishlist
    openWishlistModal() {
        let modal = document.getElementById('wishlist-modal');
        
        if (!modal) {
            modal = this.createWishlistModal();
            document.body.appendChild(modal);
        }
        
        this.renderWishlistContent();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Fermer la modal de wishlist
    closeWishlistModal() {
        const modal = document.getElementById('wishlist-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Créer la structure de la modal wishlist
    createWishlistModal() {
        const modal = document.createElement('div');
        modal.id = 'wishlist-modal';
        modal.className = 'wishlist-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-heart"></i> Ma Liste de Souhaits</h2>
                    <button class="modal-close" aria-label="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="wishlist-content"></div>
                </div>
            </div>
        `;

        // Événements de fermeture
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeWishlistModal());
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeWishlistModal());
        
        // Fermeture avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeWishlistModal();
            }
        });

        return modal;
    }

    // Rendre le contenu de la wishlist
    renderWishlistContent() {
        const container = document.getElementById('wishlist-content');
        if (!container) return;

        if (this.wishlist.length === 0) {
            container.innerHTML = `
                <div class="wishlist-empty">
                    <div class="empty-icon">
                        <i class="far fa-heart"></i>
                    </div>
                    <h3>Votre liste de souhaits est vide</h3>
                    <p>Ajoutez des produits en cliquant sur le cœur ♡</p>
                    <button class="btn-primary" onclick="wishlistManager.closeWishlistModal()">
                        Continuer vos achats
                    </button>
                </div>
            `;
            return;
        }

        const itemsHTML = this.wishlist.map(item => `
            <div class="wishlist-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="item-details">
                    <h4 class="item-title">${item.title}</h4>
                    <p class="item-brand">${item.brand}</p>
                    <div class="item-price">
                        ${item.originalPrice ? `<span class="price-old">${item.originalPrice}€</span>` : ''}
                        <span class="price-current">${item.price}€</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-add-to-cart" data-product-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Ajouter au panier
                    </button>
                    <button class="btn-remove-wishlist" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="wishlist-header">
                <h3>${this.wishlist.length} produit${this.wishlist.length > 1 ? 's' : ''} dans vos favoris</h3>
                <button class="btn-clear-wishlist">
                    <i class="fas fa-trash"></i>
                    Vider la liste
                </button>
            </div>
            <div class="wishlist-items">
                ${itemsHTML}
            </div>
        `;

        // Lier les événements des boutons
        this.bindWishlistModalEvents();
    }

    // Lier les événements de la modal wishlist
    bindWishlistModalEvents() {
        const container = document.getElementById('wishlist-content');
        if (!container) return;

        // Supprimer un élément
        container.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-wishlist')) {
                const productId = e.target.closest('.btn-remove-wishlist').dataset.productId;
                this.removeFromWishlist(productId);
                this.renderWishlistContent();
                this.updateWishlistUI();
            }
        });

        // Ajouter au panier
        container.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-to-cart')) {
                const productId = e.target.closest('.btn-add-to-cart').dataset.productId;
                const wishlistItem = this.wishlist.find(item => item.id === productId);
                
                if (wishlistItem && window.cartManager) {
                    window.cartManager.addToCart(wishlistItem, 1);
                    this.showToast('Produit ajouté au panier', 'success');
                }
            }
        });

        // Vider la liste
        const clearBtn = container.querySelector('.btn-clear-wishlist');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
                    this.clearWishlist();
                    this.renderWishlistContent();
                    this.updateWishlistUI();
                }
            });
        }
    }

    // Afficher un toast de notification
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`Toast ${type}: ${message}`);
        }
    }
}

// Initialiser le gestionnaire de wishlist
window.wishlistManager = new WishlistManager();

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WishlistManager;
}