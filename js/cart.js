// Système de panier avancé pour Luxio
class LuxioCart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.initEventListeners();
    }

    // Charger le panier depuis localStorage
    loadCart() {
        const savedCart = localStorage.getItem('luxio_cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateCartDisplay();
    }

    // Sauvegarder le panier dans localStorage
    saveCart() {
        localStorage.setItem('luxio_cart', JSON.stringify(this.items));
    }

    // Ajouter un produit au panier
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id || this.generateId(),
                title: product.title,
                brand: product.brand,
                model: product.model,
                price: this.parsePrice(product.price),
                originalPrice: product.price,
                image: product.image_url || 'img/product-1.png',
                quantity: 1,
                storage: product.storage || 'N/A'
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(product.title);
    }

    // Supprimer un produit du panier
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Mettre à jour la quantité d'un produit
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    // Vider le panier
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Calculer le total du panier
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Obtenir le nombre total d'articles
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Mettre à jour l'affichage du panier
    updateCartDisplay() {
        this.updateCartIcon();
        this.updateCartDropdown();
        this.updateCartPage();
        this.updateCheckoutButton();
    }

    // Mettre à jour l'icône du panier
    updateCartIcon() {
        const cartTotal = document.querySelector('.cart-total');
        const cartCount = document.querySelector('.cart-count');
        
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(this.getTotal());
        }
        
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }

    // Mettre à jour le dropdown du panier
    updateCartDropdown() {
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (!cartDropdown) return;

        if (this.items.length === 0) {
            cartDropdown.innerHTML = `
                <div class="text-center p-3">
                    <p data-translate="cart_empty">${window.LuxioLang ? window.LuxioLang.t('cart_empty') : 'Votre panier est vide'}</p>
                </div>
            `;
        } else {
            let cartHTML = '';
            this.items.slice(0, 3).forEach(item => {
                cartHTML += `
                    <div class="cart-item d-flex align-items-center p-2 border-bottom">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-image me-2" style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">${item.brand} ${item.model}</h6>
                            <small class="text-muted">${item.quantity} x ${this.formatPrice(item.price)}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="luxioCart.removeItem('${item.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
            
            if (this.items.length > 3) {
                const moreItemsText = window.LuxioLang ? 
                    window.LuxioLang.t('and_more_items').replace('${count}', this.items.length - 3) : 
                    `et ${this.items.length - 3} autres articles...`;
                cartHTML += `<div class="text-center p-2"><small>${moreItemsText}</small></div>`;
            }
            
            cartHTML += `
                <div class="cart-footer p-3">
                    <div class="d-flex justify-content-between mb-2">
                        <strong>${window.LuxioLang ? window.LuxioLang.t('total') : 'Total'}: ${this.formatPrice(this.getTotal())}</strong>
                    </div>
                    <div class="d-grid gap-2">
                        <a href="cart.html" class="btn btn-primary btn-sm">${window.LuxioLang ? window.LuxioLang.t('view_cart') : 'Voir Panier'}</a>
                        <a href="checkout.html" class="btn btn-success btn-sm">${window.LuxioLang ? window.LuxioLang.t('order') : 'Commander'}</a>
                    </div>
                </div>
            `;
            
            cartDropdown.innerHTML = cartHTML;
        }
    }

    // Mettre à jour la page panier complète
    updateCartPage() {
        const cartTableBody = document.querySelector('#cart-table-body');
        if (!cartTableBody) return;

        if (this.items.length === 0) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <p data-translate="cart_empty">${window.LuxioLang ? window.LuxioLang.t('cart_empty') : 'Votre panier est vide'}</p>
                        <a href="shop.html" class="btn btn-primary">${window.LuxioLang ? window.LuxioLang.t('continue_shopping') : 'Continuer vos achats'}</a>
                    </td>
                </tr>
            `;
        } else {
            let cartHTML = '';
            this.items.forEach(item => {
                cartHTML += `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover;" class="me-3">
                                <div>
                                    <h6 class="mb-0">${item.brand} ${item.model}</h6>
                                    <small class="text-muted">${item.storage}</small>
                                </div>
                            </div>
                        </td>
                        <td>${this.formatPrice(item.price)}</td>
                        <td>
                            <div class="input-group" style="width: 120px;">
                                <button class="btn btn-outline-secondary btn-sm" onclick="luxioCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <input type="number" class="form-control text-center" value="${item.quantity}" min="0" 
                                       onchange="luxioCart.updateQuantity('${item.id}', parseInt(this.value))">
                                <button class="btn btn-outline-secondary btn-sm" onclick="luxioCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </td>
                        <td>${this.formatPrice(item.price * item.quantity)}</td>
                        <td>
                            <button class="btn btn-outline-danger btn-sm" onclick="luxioCart.removeItem('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            cartTableBody.innerHTML = cartHTML;
        }

        // Mettre à jour le résumé du panier
        this.updateCartSummary();
    }

    // Mettre à jour le résumé du panier
    updateCartSummary() {
        const subtotalElement = document.querySelector('#cart-subtotal');
        const totalElement = document.querySelector('#cart-total');
        
        if (subtotalElement) {
            subtotalElement.textContent = this.formatPrice(this.getTotal());
        }
        
        if (totalElement) {
            totalElement.textContent = this.formatPrice(this.getTotal());
        }
    }

    // Afficher une notification d'ajout au panier
    showAddToCartNotification(productName) {
        // Créer une notification toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        const addedText = window.LuxioLang ? window.LuxioLang.t('added_to_cart') : 'ajouté au panier!';
        toast.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                <strong>${productName}</strong> ${addedText}
                <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Supprimer automatiquement après 3 secondes
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

    // Initialiser les écouteurs d'événements
    initEventListeners() {
        // Écouteur pour les boutons "Ajouter au panier"
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn, .add-to-cart-btn *')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-cart-btn');
                const productData = JSON.parse(button.getAttribute('data-product'));
                this.addItem(productData);
            }
        });
    }

    // Utilitaires
    parsePrice(priceString) {
        if (typeof priceString === 'number') return priceString;
        
        // Extraire le prix numérique de la chaîne
        const match = priceString.match(/[\d,]+\.?\d*/);
        if (match) {
            return parseFloat(match[0].replace(',', ''));
        }
        return 0;
    }

    formatPrice(price) {
        const currentLang = window.LuxioLang ? window.LuxioLang.getCurrentLanguage() : 'fr';
        const config = window.LuxioLang ? window.LuxioLang.languageConfig[currentLang] : { currency: 'EUR' };
        
        if (config.currency === 'EUR') {
            return price.toFixed(2) + ' €';
        } else if (config.currency === 'USD') {
            return '$' + price.toFixed(2);
        } else if (config.currency === 'PLN') {
            return price.toFixed(2) + ' zł';
        } else if (config.currency === 'BRL') {
            return 'R$ ' + price.toFixed(2);
        }
        
        return price.toFixed(2) + ' €';
    }

    generateId() {
        return 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Mettre à jour l'état du bouton checkout
    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            const hasItems = this.items.length > 0;
            checkoutBtn.disabled = !hasItems;
            
            if (hasItems) {
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.cursor = 'pointer';
                checkoutBtn.classList.remove('disabled');
            } else {
                checkoutBtn.style.opacity = '0.6';
                checkoutBtn.style.cursor = 'not-allowed';
                checkoutBtn.classList.add('disabled');
            }
        }
    }
}

// Initialiser le panier global
const luxioCart = new LuxioCart();

// Export pour utilisation globale
window.LuxioCart = LuxioCart;
window.luxioCart = luxioCart;

// Fonction globale pour le checkout
window.goToCheckout = function() {
    if (luxioCart.items.length === 0) {
        alert('Votre panier est vide. Ajoutez des produits avant de procéder au paiement.');
        return;
    }
    
    // Sauvegarder les données pour checkout
    localStorage.setItem('checkout_data', JSON.stringify({
        items: luxioCart.items,
        total: luxioCart.getTotal(),
        timestamp: Date.now()
    }));
    
    // Rediriger vers checkout
    window.location.href = 'checkout.html';
};