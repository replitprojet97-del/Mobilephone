/**
 * LUXIO - Gestionnaire global des produits
 * Centralise l'accès aux données produits pour toutes les catégories
 */

class ProductsManager {
    constructor() {
        this.products = [];
        this.categories = {};
        this.isLoaded = false;
        this.loadPromise = this.loadProducts();
    }

    // Charger tous les produits depuis le fichier JSON
    async loadProducts() {
        try {
            console.log('ProductsManager: Fetching data/products.json...');
            const response = await fetch(`data/products.json?v=${Date.now()}`, { cache: 'no-store' });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('ProductsManager: Raw data loaded:', Object.keys(data));
            
            // Organiser les produits par catégorie
            this.categories = data;
            
            // Créer un tableau plat de tous les produits
            this.products = [];
            Object.keys(data).forEach(category => {
                if (Array.isArray(data[category])) {
                    console.log(`ProductsManager: Category ${category} has ${data[category].length} products`);
                    this.products.push(...data[category]);
                }
            });
            
            this.isLoaded = true;
            console.log(`LUXIO: ${this.products.length} produits chargés dans ${Object.keys(this.categories).length} catégories`);
            
            return this.products;
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            this.loadFallbackData();
            return this.products;
        }
    }

    // Données de fallback en cas d'erreur
    loadFallbackData() {
        this.categories = {
            smartphones: [
                {
                    id: "iphone-15-pro-fallback",
                    title: "iPhone 15 Pro 128GB",
                    brand: "Apple",
                    model: "iPhone 15 Pro",
                    category: "smartphones",
                    storage: "128 GB",
                    price: 1229,
                    originalPrice: 1299,
                    currency: "EUR",
                    discount: 5,
                    thumbnail: "img/product-1.png",
                    inStock: true,
                    rating: 4.8,
                    reviewCount: 124,
                    isNew: true,
                    isFeatured: true
                }
            ]
        };
        this.products = [this.categories.smartphones[0]];
        this.isLoaded = true;
    }

    // Attendre que les produits soient chargés
    async waitForLoad() {
        if (this.isLoaded) return this.products;
        return await this.loadPromise;
    }

    // Obtenir tous les produits
    async getAllProducts() {
        await this.waitForLoad();
        return this.products;
    }

    // Obtenir les produits d'une catégorie
    async getProductsByCategory(category) {
        await this.waitForLoad();
        return this.categories[category] || [];
    }

    // Obtenir un produit par ID
    async getProductById(id) {
        await this.waitForLoad();
        return this.products.find(product => product.id === id) || null;
    }

    // Rechercher des produits
    async searchProducts(query, category = null) {
        await this.waitForLoad();
        
        let searchPool = category ? (this.categories[category] || []) : this.products;
        
        if (!query || query.trim() === '') {
            return searchPool;
        }

        const searchTerm = query.toLowerCase().trim();
        
        return searchPool.filter(product => 
            product.title?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm) ||
            product.model?.toLowerCase().includes(searchTerm) ||
            product.shortDescription?.toLowerCase().includes(searchTerm)
        );
    }

    // Obtenir les marques disponibles pour une catégorie
    async getBrandsByCategory(category) {
        await this.waitForLoad();
        
        const products = category ? (this.categories[category] || []) : this.products;
        const brands = [...new Set(products.map(product => product.brand))];
        
        return brands.sort();
    }

    // Obtenir les capacités de stockage pour une catégorie
    async getStorageByCategory(category) {
        await this.waitForLoad();
        
        const products = category ? (this.categories[category] || []) : this.products;
        const storages = [...new Set(products
            .map(product => product.storage)
            .filter(storage => storage)
        )];
        
        return storages.sort((a, b) => {
            const aNum = parseInt(a);
            const bNum = parseInt(b);
            return aNum - bNum;
        });
    }

    // Filtrer les produits
    async filterProducts(filters = {}, category = null) {
        await this.waitForLoad();
        
        let products = category ? (this.categories[category] || []) : this.products;

        // Filtre par recherche
        if (filters.search) {
            products = await this.searchProducts(filters.search, category);
        }

        // Filtre par marque
        if (filters.brand) {
            products = products.filter(product => 
                product.brand?.toLowerCase() === filters.brand.toLowerCase()
            );
        }

        // Filtre par prix
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            products = products.filter(product => {
                const price = product.price || 0;
                const min = filters.minPrice || 0;
                const max = filters.maxPrice || Infinity;
                return price >= min && price <= max;
            });
        }

        // Filtre par stockage
        if (filters.storage) {
            products = products.filter(product => 
                product.storage === filters.storage
            );
        }

        // Filtre par disponibilité
        if (filters.inStock !== undefined) {
            products = products.filter(product => product.inStock === filters.inStock);
        }

        return products;
    }

    // Trier les produits
    sortProducts(products, sortBy = 'featured') {
        const sorted = [...products];

        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            
            case 'price-desc':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            
            case 'name-asc':
                return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            
            case 'name-desc':
                return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
            
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
            case 'newest':
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0);
                    const dateB = new Date(b.createdAt || 0);
                    return dateB - dateA;
                });
            
            case 'featured':
            default:
                return sorted.sort((a, b) => {
                    // Prioriser les produits vedettes
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    
                    // Ensuite par note
                    const ratingDiff = (b.rating || 0) - (a.rating || 0);
                    if (ratingDiff !== 0) return ratingDiff;
                    
                    // Finalement par nouveauté
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    
                    return 0;
                });
        }
    }

    // Obtenir les catégories disponibles
    async getCategories() {
        await this.waitForLoad();
        return Object.keys(this.categories);
    }

    // Obtenir le nombre de produits par catégorie
    async getCategoryCounts() {
        await this.waitForLoad();
        
        const counts = {};
        Object.keys(this.categories).forEach(category => {
            counts[category] = this.categories[category]?.length || 0;
        });
        
        return counts;
    }
}

// Créer une instance globale
window.productsManager = new ProductsManager();

// Export pour les modules ES6
export default ProductsManager;