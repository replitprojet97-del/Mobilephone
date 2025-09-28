import axios from 'axios';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Configuration CORS sécurisée
    const allowedOrigins = ['https://your-domain.vercel.app', 'http://localhost:5000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Vérifier la méthode HTTP
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Méthode non autorisée. Utilisez GET ou POST.' 
        });
    }

    try {
        const { category, sourceUrl, seed, maxProducts = 20 } = req.method === 'GET' ? req.query : req.body;
        
        // Validation des paramètres
        if (!category) {
            return res.status(400).json({ 
                error: 'Paramètre "category" requis (smartphones, watches, fashion, home, mobility, services)' 
            });
        }

        const validCategories = ['smartphones', 'watches', 'fashion', 'home', 'mobility', 'services'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                error: `Catégorie invalide. Catégories valides: ${validCategories.join(', ')}` 
            });
        }

        // URL par défaut selon la catégorie
        const defaultUrls = {
            smartphones: 'https://www.fnac.com/Tous-les-telephones/shi59030/w-4',
            watches: 'https://www.amazon.fr/s?k=montre+connectée',
            fashion: 'https://www.zalando.fr/vetements-homme/',
            home: 'https://www.ikea.com/fr/fr/',
            mobility: 'https://www.decathlon.fr/browse/c0-sports/c1-velos',
            services: ''
        };

        const targetUrl = sourceUrl || defaultUrls[category];
        
        if (!targetUrl) {
            return res.status(400).json({ 
                error: 'URL source requise pour cette catégorie ou URL par défaut non disponible' 
            });
        }

        // Validation URL pour éviter SSRF
        if (sourceUrl) {
            try {
                const parsedUrl = new URL(sourceUrl);
                const allowedDomains = ['fnac.com', 'amazon.fr', 'zalando.fr', 'ikea.com', 'decathlon.fr'];
                const isAllowed = allowedDomains.some(domain => parsedUrl.hostname.includes(domain));
                
                if (!isAllowed) {
                    return res.status(400).json({
                        error: 'Domaine non autorisé. Domaines acceptés: ' + allowedDomains.join(', ')
                    });
                }
            } catch {
                return res.status(400).json({ error: 'URL invalide' });
            }
        }

        console.log(`Import produits - Catégorie: ${category}, URL: ${targetUrl}`);

        // Configuration axios avec headers réalistes
        const axiosConfig = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'no-cache',
                'DNT': '1'
            },
            timeout: 15000,
            maxRedirects: 5
        };

        let products = [];

        try {
            // Tenter le scraping
            const { data } = await axios.get(targetUrl, axiosConfig);
            const $ = cheerio.load(data);
            
            products = await extractProductsByCategory($, category, targetUrl, maxProducts);
            
            if (products.length === 0) {
                console.log('Aucun produit extrait, utilisation des données de test');
                products = getTestDataByCategory(category);
            }
            
        } catch (scrapingError) {
            console.error('Erreur de scraping:', scrapingError.message);
            
            // Utiliser les données de test en cas d'erreur
            products = getTestDataByCategory(category);
        }

        // Enrichir les données avec des métadonnées
        products = products.map((product, index) => ({
            id: product.id || generateProductId(product.title, category),
            slug: product.slug || generateSlug(product.title),
            ...product,
            category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            source: product.source || 'imported',
            importedAt: new Date().toISOString()
        }));

        // Sauvegarder dans products.json si seed=true
        if (seed === 'true' || seed === true) {
            try {
                await saveToProductsFile(products, category);
                console.log(`${products.length} produits sauvegardés dans data/products.json`);
            } catch (saveError) {
                console.error('Erreur sauvegarde:', saveError.message);
                return res.status(200).json({
                    products,
                    count: products.length,
                    category,
                    message: 'Produits extraits mais impossible de sauvegarder dans le fichier',
                    warning: 'Sauvegarde échouée: ' + saveError.message
                });
            }
        }

        res.status(200).json({
            products,
            count: products.length,
            category,
            sourceUrl: targetUrl,
            timestamp: new Date().toISOString(),
            message: `${products.length} produits importés avec succès`,
            saved: seed === 'true' || seed === true
        });

    } catch (error) {
        console.error('Erreur générale import produits:', error);
        
        res.status(500).json({
            error: 'Erreur lors de l\'import des produits',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            message: 'Impossible d\'importer les produits depuis la source'
        });
    }
}

// Extraire les produits selon la catégorie
async function extractProductsByCategory($, category, baseUrl, maxProducts) {
    const extractors = {
        smartphones: extractSmartphones,
        watches: extractWatches,
        fashion: extractFashion,
        home: extractHome,
        mobility: extractMobility,
        services: () => [] // Services ne sont pas scrapés
    };

    const extractor = extractors[category];
    if (!extractor) {
        throw new Error(`Extracteur non implémenté pour la catégorie: ${category}`);
    }

    return extractor($, baseUrl, maxProducts);
}

// Extracteur pour smartphones (adapté de scraper.js)
function extractSmartphones($, baseUrl, maxProducts) {
    const products = [];
    const productSelectors = [
        'article[class*="Article"], div[class*="Article"]',
        'div[class*="product"], div[class*="item"]',
        'div[data-testid*="product"], div[data-testid*="item"]'
    ];

    let foundProducts = $();
    
    for (const selector of productSelectors) {
        foundProducts = $(selector);
        if (foundProducts.length > 0) break;
    }

    foundProducts.slice(0, maxProducts).each((index, element) => {
        const $el = $(element);
        const productData = extractProductData($, $el, baseUrl, 'smartphones');
        
        if (productData && isSmartphone(productData.title)) {
            products.push(productData);
        }
    });

    return products;
}

// Extracteur pour montres
function extractWatches($, baseUrl, maxProducts) {
    // TODO: adapter les sélecteurs pour les sites de montres
    const products = [];
    
    $('[data-component-type="s-search-result"], .product-item, .product-card').slice(0, maxProducts).each((index, element) => {
        const $el = $(element);
        const productData = extractProductData($, $el, baseUrl, 'watches');
        
        if (productData && isWatch(productData.title)) {
            products.push(productData);
        }
    });

    return products;
}

// Extracteur pour mode
function extractFashion($, baseUrl, maxProducts) {
    // TODO: adapter les sélecteurs pour les sites de mode
    const products = [];
    
    $('.product-card, .article-card, [data-testid*="product"]').slice(0, maxProducts).each((index, element) => {
        const $el = $(element);
        const productData = extractProductData($, $el, baseUrl, 'fashion');
        
        if (productData) {
            products.push(productData);
        }
    });

    return products;
}

// Extracteur pour maison
function extractHome($, baseUrl, maxProducts) {
    // TODO: adapter les sélecteurs pour les sites de maison
    const products = [];
    
    $('.product, .pip-product, [data-testid*="product"]').slice(0, maxProducts).each((index, element) => {
        const $el = $(element);
        const productData = extractProductData($, $el, baseUrl, 'home');
        
        if (productData) {
            products.push(productData);
        }
    });

    return products;
}

// Extracteur pour mobilité
function extractMobility($, baseUrl, maxProducts) {
    // TODO: adapter les sélecteurs pour les sites de mobilité
    const products = [];
    
    $('.product-card, .vtmn-card, [data-testid*="product"]').slice(0, maxProducts).each((index, element) => {
        const $el = $(element);
        const productData = extractProductData($, $el, baseUrl, 'mobility');
        
        if (productData) {
            products.push(productData);
        }
    });

    return products;
}

// Extraction générique des données produit
function extractProductData($, element, baseUrl, category) {
    try {
        const $el = $(element);
        
        // Titre
        const titleSelectors = [
            'h3', 'h4', '.Article-desc', '.product-title', '.product-name',
            '[data-testid*="title"]', 'a[title]', '.s-size-mini .s-link-style',
            '.pip-header-section h1', '.pdp-product-name'
        ];
        
        let title = '';
        for (const selector of titleSelectors) {
            const titleEl = $el.find(selector);
            if (titleEl.length > 0) {
                title = titleEl.first().text().trim() || titleEl.first().attr('title') || '';
                if (title && title.length > 3) break;
            }
        }
        
        if (!title || title.length < 3) return null;
        
        // Prix
        const priceSelectors = [
            '.price', '.Article-price', '[data-testid*="price"]',
            '.f-priceBox-price', '.priceBox-price', '.a-price-whole',
            '.pip-price-current', '.current-price'
        ];
        
        let price = '';
        for (const selector of priceSelectors) {
            const priceEl = $el.find(selector);
            if (priceEl.length > 0) {
                price = priceEl.first().text().trim();
                if (price) break;
            }
        }
        
        // Nettoyer et convertir le prix
        const cleanPrice = extractPriceNumber(price);
        
        // Image
        const imgSelectors = ['img[src]', 'img[data-src]', 'img[data-lazy]', 'img[data-image-src]'];
        let imageUrl = '';
        
        for (const selector of imgSelectors) {
            const imgEl = $el.find(selector);
            if (imgEl.length > 0) {
                imageUrl = imgEl.first().attr('data-src') || 
                          imgEl.first().attr('src') || 
                          imgEl.first().attr('data-lazy') ||
                          imgEl.first().attr('data-image-src') || '';
                if (imageUrl) {
                    imageUrl = normalizeImageUrl(imageUrl, baseUrl);
                    break;
                }
            }
        }
        
        // Lien produit
        const linkEl = $el.find('a[href]');
        let productUrl = '';
        if (linkEl.length > 0) {
            const href = linkEl.first().attr('href');
            if (href) {
                productUrl = href.startsWith('/') ? baseUrl + href : href;
            }
        }
        
        // Marque (extraction basique)
        const brand = extractBrandFromTitle(title, category);
        
        return {
            title: title.trim(),
            brand,
            model: extractModelFromTitle(title, brand),
            category,
            price: cleanPrice,
            originalPrice: cleanPrice * 1.1, // Prix original estimé
            currency: 'EUR',
            shortDescription: title.trim(),
            description: `${title.trim()} - Produit de qualité premium disponible chez LUXIO.`,
            images: [imageUrl].filter(Boolean),
            thumbnail: imageUrl,
            link: productUrl,
            inStock: true,
            stock: Math.floor(Math.random() * 20) + 1,
            rating: 4 + Math.random(),
            reviewCount: Math.floor(Math.random() * 100) + 10,
            isNew: Math.random() < 0.3,
            isFeatured: Math.random() < 0.2
        };
        
    } catch (error) {
        console.error('Erreur extraction produit:', error);
        return null;
    }
}

// Utilitaires de validation
function isSmartphone(title) {
    const keywords = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'smartphone', 'mobile', 'huawei', 'oneplus', 'oppo'];
    return keywords.some(keyword => title.toLowerCase().includes(keyword));
}

function isWatch(title) {
    const keywords = ['watch', 'montre', 'apple watch', 'samsung watch', 'garmin', 'fitbit', 'smartwatch'];
    return keywords.some(keyword => title.toLowerCase().includes(keyword));
}

// Utilitaires de traitement
function extractPriceNumber(priceText) {
    if (!priceText) return 0;
    const numbers = priceText.replace(/[^\d,.-]/g, '').replace(',', '.');
    const price = parseFloat(numbers);
    return isNaN(price) ? 0 : Math.round(price * 100) / 100;
}

function normalizeImageUrl(imageUrl, baseUrl) {
    if (imageUrl.startsWith('//')) {
        return 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
        return baseUrl + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
        return baseUrl + '/' + imageUrl;
    }
    return imageUrl;
}

function extractBrandFromTitle(title, category) {
    const brands = {
        smartphones: {
            'Apple': ['apple', 'iphone'],
            'Samsung': ['samsung', 'galaxy'],
            'Google': ['google', 'pixel'],
            'Xiaomi': ['xiaomi', 'redmi'],
            'OnePlus': ['oneplus'],
            'Huawei': ['huawei'],
            'Oppo': ['oppo']
        },
        watches: {
            'Apple': ['apple watch'],
            'Samsung': ['samsung', 'galaxy watch'],
            'Garmin': ['garmin'],
            'Fitbit': ['fitbit'],
            'Casio': ['casio'],
            'Rolex': ['rolex']
        },
        fashion: {
            'Nike': ['nike'],
            'Adidas': ['adidas'],
            'Zara': ['zara'],
            'H&M': ['h&m'],
            'Uniqlo': ['uniqlo']
        }
    };
    
    const categoryBrands = brands[category] || {};
    const titleLower = title.toLowerCase();
    
    for (const [brand, keywords] of Object.entries(categoryBrands)) {
        if (keywords.some(keyword => titleLower.includes(keyword))) {
            return brand;
        }
    }
    
    return 'Autre';
}

function extractModelFromTitle(title, brand) {
    let model = title;
    if (brand && brand !== 'Autre') {
        model = title.replace(new RegExp(`\\b${brand}\\b`, 'gi'), '').trim();
    }
    
    // Nettoyer
    model = model.replace(/\([^)]*\)/g, ''); // Parenthèses
    model = model.replace(/\d+\s*(Go|GB)/g, ''); // Capacités
    model = model.replace(/\s+/g, ' ').trim(); // Espaces
    
    return model.substring(0, 50) || 'Modèle non spécifié';
}

function generateProductId(title, category) {
    const cleanTitle = title.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `${category}-${cleanTitle}-${Date.now()}`;
}

function generateSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Données de test par catégorie
function getTestDataByCategory(category) {
    const testData = {
        smartphones: [
            {
                title: 'iPhone 15 Pro Max 256 GB Titanium Natural',
                brand: 'Apple',
                model: '15 Pro Max',
                price: 1399.00,
                originalPrice: 1549.00,
                source: 'test_data'
            },
            {
                title: 'Samsung Galaxy S24 Ultra 512 GB Phantom Black',
                brand: 'Samsung', 
                model: 'Galaxy S24 Ultra',
                price: 1499.00,
                originalPrice: 1599.00,
                source: 'test_data'
            }
        ],
        watches: [
            {
                title: 'Apple Watch Series 9 45mm GPS',
                brand: 'Apple',
                model: 'Watch Series 9',
                price: 449.00,
                originalPrice: 499.00,
                source: 'test_data'
            }
        ],
        fashion: [
            {
                title: 'Nike Air Max 270 Sneakers',
                brand: 'Nike',
                model: 'Air Max 270',
                price: 150.00,
                originalPrice: 180.00,
                source: 'test_data'
            }
        ],
        home: [
            {
                title: 'Philips Hue Smart Bulb Starter Kit',
                brand: 'Philips',
                model: 'Hue Starter Kit',
                price: 99.99,
                originalPrice: 129.99,
                source: 'test_data'
            }
        ],
        mobility: [
            {
                title: 'Trottinette électrique Xiaomi Mi Scooter',
                brand: 'Xiaomi',
                model: 'Mi Scooter',
                price: 299.00,
                originalPrice: 399.00,
                source: 'test_data'
            }
        ],
        services: []
    };

    return testData[category] || [];
}

// Sauvegarder dans le fichier products.json
async function saveToProductsFile(products, category) {
    const dataDir = path.join(process.cwd(), 'data');
    const productsFile = path.join(dataDir, 'products.json');
    
    try {
        // Créer le dossier data s'il n'existe pas
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }
        
        // Lire le fichier existant ou créer une structure vide
        let existingData = {};
        try {
            const fileContent = await fs.readFile(productsFile, 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (error) {
            // Fichier n'existe pas, commencer avec une structure vide
            existingData = {
                smartphones: [],
                watches: [],
                fashion: [],
                home: [],
                mobility: [],
                services: []
            };
        }
        
        // Remplacer les produits de la catégorie
        existingData[category] = products;
        
        // Sauvegarder
        await fs.writeFile(productsFile, JSON.stringify(existingData, null, 2), 'utf8');
        
    } catch (error) {
        throw new Error(`Impossible de sauvegarder dans ${productsFile}: ${error.message}`);
    }
}