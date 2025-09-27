// Intégration des smartphones Luxio
class SmartphoneManager {
    constructor() {
        this.smartphones = [];
        this.loadSmartphones();
    }

    async loadSmartphones() {
        try {
            const response = await fetch('./smartphones.json');
            this.smartphones = await response.json();
            this.displaySmartphones();
        } catch (error) {
            console.error('Erreur lors du chargement des smartphones:', error);
            // Utiliser des données de fallback
            this.smartphones = this.getFallbackData();
            this.displaySmartphones();
        }
    }

    getFallbackData() {
        return [
            {
                title: "iPhone 15 Pro 128 GB Titanium Blue",
                brand: "Apple",
                model: "15 Pro",
                storage: "128 GB",
                price: "1 229,00 €",
                url: "https://www.fnac.com",
                image_url: "img/product-1.png",
                source: "Fallback"
            },
            {
                title: "Samsung Galaxy S24 Ultra 256 GB Phantom Black",
                brand: "Samsung",
                model: "Galaxy S24 Ultra",
                storage: "256 GB",
                price: "1 069,00 €",
                url: "https://www.fnac.com",
                image_url: "img/product-2.png",
                source: "Fallback"
            },
            {
                title: "Google Pixel 8 Pro 128 GB Obsidian",
                brand: "Google",
                model: "Pixel 8 Pro",
                storage: "128 GB",
                price: "799,00 €",
                url: "https://www.fnac.com",
                image_url: "img/product-3.png",
                source: "Fallback"
            }
        ];
    }

    displaySmartphones() {
        this.displayFeaturedSmartphones();
        this.displaySmartphoneGrid();
        this.displaySmartphoneCarousel();
    }

    displayFeaturedSmartphones() {
        const featuredContainer = document.querySelector('#featured-smartphones');
        if (!featuredContainer) return;

        const featured = this.smartphones.slice(0, 4); // Display 4 products for 2x2 grid
        let html = '';

        // Add section title
        html += `
            <div class="col-12 mb-4">
                <div class="section-title">
                    <h2>Smartphones Haut de Gamme</h2>
                    <p>Réduction 15-22% • Livraison express incluse</p>
                </div>
            </div>
        `;

        featured.forEach((phone, index) => {
            const productData = JSON.stringify(phone);
            const discountPercentage = this.getRandomDiscount();
            const originalPrice = this.calculateOriginalPrice(phone.price, discountPercentage);
            
            html += `
                <div class="col-lg-6 col-md-6 col-12 mb-4">
                    <div class="modern-product-card">
                        <div class="product-badge">-${discountPercentage}%</div>
                        <div class="row g-0">
                            <div class="col-6">
                                <div class="product-image-container">
                                    <img src="${phone.image_url || 'img/product-' + (index + 1) + '.png'}" 
                                         alt="${phone.title}" class="img-fluid">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="product-info">
                                    <div class="product-brand">${phone.brand}</div>
                                    <div class="product-title">${phone.model}</div>
                                    <div class="product-specs">${this.getProductSpecs(phone)}</div>
                                    
                                    <div class="product-pricing">
                                        <span class="product-price-old">${originalPrice}€</span>
                                        <span class="product-price-new">${this.extractPrice(phone.price)}€</span>
                                    </div>
                                    
                                    <div class="color-options">
                                        <div class="color-dot black"></div>
                                        <div class="color-dot white"></div>
                                        <div class="color-dot gold"></div>
                                        <div class="color-dot blue"></div>
                                    </div>
                                    
                                    <button class="btn-add-cart add-to-cart-btn" data-product='${productData}'>
                                        <span data-translate="add_to_cart">Ajouter au panier</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        featuredContainer.innerHTML = html;
        
        // Appliquer les traductions après génération du contenu
        if (window.LuxioLang) {
            window.LuxioLang.updatePageContent();
        }
    }

    getRandomDiscount() {
        const discounts = [15, 18, 20, 22, 25];
        return discounts[Math.floor(Math.random() * discounts.length)];
    }

    calculateOriginalPrice(currentPrice, discountPercent) {
        const price = this.extractPrice(currentPrice);
        const originalPrice = Math.round(price / (1 - discountPercent / 100));
        return originalPrice;
    }

    extractPrice(priceString) {
        const match = priceString.match(/[\d\s,]+/);
        if (match) {
            return parseInt(match[0].replace(/\s/g, '').replace(',', ''));
        }
        return 999;
    }

    getProductSpecs(phone) {
        const specs = [];
        if (phone.storage) specs.push(phone.storage);
        
        // Add some generic specs based on brand
        switch(phone.brand) {
            case 'Apple':
                specs.push('ProRes Camera');
                break;
            case 'Samsung':
                specs.push('200MP Camera');
                break;
            case 'Google':
                specs.push('AI Photography');
                break;
            case 'Xiaomi':
                specs.push('HyperOS');
                break;
            case 'OnePlus':
                specs.push('Hasselblad Camera');
                break;
            default:
                specs.push('Premium Features');
        }
        
        return specs.join(' • ');
    }

    displaySmartphoneGrid() {
        const gridContainer = document.querySelector('#smartphone-grid');
        if (!gridContainer) return;

        let html = '';
        this.smartphones.forEach((phone, index) => {
            const productData = JSON.stringify(phone);
            html += `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="product-item bg-white rounded shadow-sm h-100">
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="${phone.image_url || 'img/product-' + ((index % 18) + 1) + '.png'}" 
                                 alt="${phone.title}" style="height: 200px; object-fit: cover;">
                            <div class="product-action">
                                <button class="btn btn-outline-dark btn-square add-to-cart-btn" data-product='${productData}'>
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                                <a class="btn btn-outline-dark btn-square" href="single.html?id=${index}">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <a class="btn btn-outline-dark btn-square" href="#">
                                    <i class="fas fa-heart"></i>
                                </a>
                            </div>
                        </div>
                        <div class="p-3">
                            <div class="d-flex justify-content-between mb-2">
                                <small class="text-muted">${phone.brand}</small>
                                <small class="text-muted">${phone.storage}</small>
                            </div>
                            <h6 class="mb-2 text-truncate">${phone.model}</h6>
                            <div class="d-flex justify-content-between">
                                <span class="text-primary fw-bold">${phone.price}</span>
                                <div class="rating-stars">
                                    ${'★'.repeat(4)}${'☆'.repeat(1)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        gridContainer.innerHTML = html;
    }

    displaySmartphoneCarousel() {
        const carouselContainer = document.querySelector('#smartphone-carousel');
        if (!carouselContainer) return;

        let html = '';
        this.smartphones.forEach((phone, index) => {
            const productData = JSON.stringify(phone);
            const activeClass = index === 0 ? 'active' : '';
            
            html += `
                <div class="carousel-item ${activeClass}">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-6">
                                <img src="${phone.image_url || 'img/product-' + ((index % 18) + 1) + '.png'}" 
                                     class="img-fluid" alt="${phone.title}" style="max-height: 400px; object-fit: contain;">
                            </div>
                            <div class="col-lg-6">
                                <div class="carousel-caption-custom">
                                    <h2 class="display-4 text-primary mb-3">${phone.brand}</h2>
                                    <h3 class="mb-3">${phone.model}</h3>
                                    <p class="mb-4">Capacité: ${phone.storage}</p>
                                    <div class="d-flex align-items-center mb-4">
                                        <span class="h2 text-success me-3">${phone.price}</span>
                                        <div class="rating">
                                            ${'★'.repeat(4)}${'☆'.repeat(1)} (4.0/5)
                                        </div>
                                    </div>
                                    <div class="d-flex gap-3">
                                        <button class="btn btn-primary btn-lg add-to-cart-btn" data-product='${productData}'>
                                            <i class="fas fa-shopping-cart me-2"></i>
                                            <span data-translate="add_to_cart">Ajouter au Panier</span>
                                        </button>
                                        <a href="single.html?id=${index}" class="btn btn-outline-secondary btn-lg">
                                            <span data-translate="view_details">Voir Détails</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        carouselContainer.innerHTML = html;
    }

    getSmartphoneById(id) {
        return this.smartphones[id] || null;
    }

    searchSmartphones(query) {
        if (!query) return this.smartphones;
        
        query = query.toLowerCase();
        return this.smartphones.filter(phone => 
            phone.title.toLowerCase().includes(query) ||
            phone.brand.toLowerCase().includes(query) ||
            phone.model.toLowerCase().includes(query)
        );
    }

    filterByBrand(brand) {
        if (!brand || brand === 'all') return this.smartphones;
        return this.smartphones.filter(phone => 
            phone.brand.toLowerCase() === brand.toLowerCase()
        );
    }

    sortBy(criteria) {
        let sorted = [...this.smartphones];
        
        switch(criteria) {
            case 'price-low':
                sorted.sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price));
                break;
            case 'price-high':
                sorted.sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price));
                break;
            case 'name':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'brand':
                sorted.sort((a, b) => a.brand.localeCompare(b.brand));
                break;
        }
        
        return sorted;
    }

    parsePrice(priceString) {
        const match = priceString.match(/[\d,]+\.?\d*/);
        return match ? parseFloat(match[0].replace(',', '')) : 0;
    }
}

// Initialiser le gestionnaire de smartphones
document.addEventListener('DOMContentLoaded', function() {
    window.smartphoneManager = new SmartphoneManager();
});

// Export pour utilisation globale
window.SmartphoneManager = SmartphoneManager;