import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    // Configurer CORS pour permettre les appels depuis le frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;
    
    // URL par défaut si non fournie
    const targetUrl = url || 'https://www.fnac.com/Tous-les-telephones/shi59030/w-4';
    
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        console.log(`Extraction des données depuis: ${targetUrl}`);
        
        // Configuration axios similaire au scraper Python
        const axiosConfig = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Referer': 'https://www.fnac.com/',
                'Cache-Control': 'no-cache'
            },
            timeout: 10000
        };

        const { data } = await axios.get(targetUrl, axiosConfig);
        const $ = cheerio.load(data);
        
        const products = [];
        const baseUrl = 'https://www.fnac.com';
        
        // Sélecteurs adaptés du scraper Python pour Fnac
        const productSelectors = [
            'article[class*="Article"], div[class*="Article"]',
            'div[class*="product"], div[class*="item"]',
            'div[data-testid*="product"], div[data-testid*="item"]'
        ];
        
        let foundProducts = $();
        
        // Essayer chaque sélecteur jusqu'à trouver des produits
        for (const selector of productSelectors) {
            foundProducts = $(selector);
            if (foundProducts.length > 0) {
                console.log(`Trouvé ${foundProducts.length} éléments avec sélecteur: ${selector}`);
                break;
            }
        }
        
        // Limiter à 20 produits maximum pour éviter les timeouts
        foundProducts.slice(0, 20).each((index, element) => {
            const $el = $(element);
            const productData = extractProductData($, $el, baseUrl);
            
            if (productData && isSmartphone(productData.title)) {
                products.push(productData);
                console.log(`Produit ${index + 1}: ${productData.title.substring(0, 50)}...`);
            }
        });
        
        if (products.length === 0) {
            console.log('Aucun produit trouvé, utilisation des données de test');
            return res.status(200).json({ 
                products: getTestData(),
                source: 'test_data',
                message: 'Aucun produit trouvé sur la page, données de test retournées'
            });
        }
        
        res.status(200).json({ 
            products,
            total: products.length,
            source: 'scraped',
            url: targetUrl
        });
        
    } catch (error) {
        console.error('Erreur lors du scraping:', error.message);
        
        // En cas d'erreur, retourner les données de test
        res.status(200).json({ 
            products: getTestData(),
            source: 'test_data',
            error: error.message,
            message: 'Erreur lors du scraping, données de test retournées'
        });
    }
}

function extractProductData($, element, baseUrl) {
    try {
        const $el = $(element);
        
        // Extraction du titre avec plusieurs sélecteurs possibles
        const titleSelectors = [
            'h3', 'h4', '.Article-desc', '.product-title',
            '[data-testid*="title"]', 'a[title]'
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
        
        // Extraction du prix
        const priceSelectors = [
            '.price', '.Article-price', '[data-testid*="price"]',
            '.f-priceBox-price', '.priceBox-price'
        ];
        
        let price = '';
        for (const selector of priceSelectors) {
            const priceEl = $el.find(selector);
            if (priceEl.length > 0) {
                price = priceEl.first().text().trim();
                if (price) break;
            }
        }
        
        // Extraction de l'image
        const imgSelectors = ['img[src]', 'img[data-src]', 'img[data-lazy]'];
        let imageUrl = '';
        
        for (const selector of imgSelectors) {
            const imgEl = $el.find(selector);
            if (imgEl.length > 0) {
                imageUrl = imgEl.first().attr('data-src') || 
                          imgEl.first().attr('src') || 
                          imgEl.first().attr('data-lazy') || '';
                if (imageUrl) {
                    // Construire l'URL complète si nécessaire
                    if (imageUrl.startsWith('//')) {
                        imageUrl = 'https:' + imageUrl;
                    } else if (imageUrl.startsWith('/')) {
                        imageUrl = baseUrl + imageUrl;
                    }
                    break;
                }
            }
        }
        
        // Extraction du lien produit
        const linkEl = $el.find('a[href]');
        let productUrl = '';
        if (linkEl.length > 0) {
            const href = linkEl.first().attr('href');
            if (href) {
                productUrl = href.startsWith('/') ? baseUrl + href : href;
            }
        }
        
        // Extraction des métadonnées (marque, modèle, stockage)
        const brand = extractBrand(title);
        const storage = extractStorage(title);
        const model = extractModel(title, brand);
        
        return {
            title: title.trim(),
            brand,
            model,
            storage,
            price: price || 'Prix non disponible',
            image: imageUrl,
            link: productUrl,
            source: 'Fnac'
        };
        
    } catch (error) {
        console.error('Erreur extraction produit:', error);
        return null;
    }
}

function isSmartphone(title) {
    const smartphoneKeywords = [
        'iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 
        'huawei', 'oneplus', 'oppo', 'smartphone', 'mobile'
    ];
    
    return smartphoneKeywords.some(keyword => 
        title.toLowerCase().includes(keyword)
    );
}

function extractBrand(title) {
    const brands = {
        'Apple': ['apple', 'iphone'],
        'Samsung': ['samsung', 'galaxy'],
        'Google': ['google', 'pixel'],
        'Xiaomi': ['xiaomi', 'redmi', 'poco'],
        'OnePlus': ['oneplus', 'one plus'],
        'Huawei': ['huawei'],
        'Oppo': ['oppo'],
        'Vivo': ['vivo'],
        'Sony': ['sony', 'xperia'],
        'Nokia': ['nokia'],
        'Motorola': ['motorola', 'moto'],
        'Realme': ['realme'],
        'Honor': ['honor']
    };
    
    const titleLower = title.toLowerCase();
    for (const [brand, keywords] of Object.entries(brands)) {
        if (keywords.some(keyword => titleLower.includes(keyword))) {
            return brand;
        }
    }
    return 'Autre';
}

function extractStorage(title) {
    const storageMatch = title.match(/(\d+)\s*(Go|GB)/i);
    return storageMatch ? `${storageMatch[1]} GB` : 'Capacité non spécifiée';
}

function extractModel(title, brand) {
    let model = title;
    if (brand && brand !== 'Autre') {
        // Supprimer la marque du titre
        model = title.replace(new RegExp(`\\b${brand}\\b`, 'gi'), '').trim();
    }
    
    // Nettoyer le modèle
    model = model.replace(/\([^)]*\)/g, ''); // Supprimer les parenthèses
    model = model.replace(/\d+\s*(Go|GB)/g, ''); // Supprimer les capacités
    model = model.replace(/\s+/g, ' ').trim(); // Nettoyer les espaces
    
    return model.substring(0, 50) || 'Modèle non spécifié';
}

function getTestData() {
    return [
        {
            title: 'iPhone 15 Pro 128 GB Titanium Blue',
            brand: 'Apple',
            model: '15 Pro',
            storage: '128 GB',
            price: '1 229,00 €',
            link: 'https://www.fnac.com',
            image: 'https://static.fnac-static.com/multimedia/Images/FR/NR/iphone15pro.jpg',
            source: 'Test Data'
        },
        {
            title: 'Samsung Galaxy S24 Ultra 256 GB Phantom Black',
            brand: 'Samsung',
            model: 'Galaxy S24 Ultra',
            storage: '256 GB',
            price: '1 069,00 €',
            link: 'https://www.fnac.com',
            image: 'https://static.fnac-static.com/multimedia/Images/FR/NR/galaxys24.jpg',
            source: 'Test Data'
        },
        {
            title: 'Google Pixel 8 Pro 128 GB Obsidian',
            brand: 'Google',
            model: 'Pixel 8 Pro',
            storage: '128 GB',
            price: '799,00 €',
            link: 'https://www.fnac.com',
            image: 'https://static.fnac-static.com/multimedia/Images/FR/NR/pixel8.jpg',
            source: 'Test Data'
        },
        {
            title: 'Xiaomi 14 Ultra 512 GB Black',
            brand: 'Xiaomi',
            model: '14 Ultra',
            storage: '512 GB',
            price: '1 299,00 €',
            link: 'https://www.fnac.com',
            image: 'https://static.fnac-static.com/multimedia/Images/FR/NR/xiaomi14.jpg',
            source: 'Test Data'
        },
        {
            title: 'OnePlus 12 256 GB Flowy Emerald',
            brand: 'OnePlus',
            model: '12',
            storage: '256 GB',
            price: '949,00 €',
            link: 'https://www.fnac.com',
            image: 'https://static.fnac-static.com/multimedia/Images/FR/NR/oneplus12.jpg',
            source: 'Test Data'
        }
    ];
}