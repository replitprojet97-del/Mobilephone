#!/usr/bin/env node
/**
 * Script Node.js pour extraire les données de smartphones depuis Fnac.com
 * Conversion du script Python scrape_fnac.py en JavaScript
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class FnacSmartphoneScraper {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.fnac.com/',
        'Cache-Control': 'no-cache'
      }
    });
    this.baseUrl = "https://www.fnac.com";
  }

  async getSmartphones(maxPages = 3, options = {}) {
    console.log('🚀 Début de l\'extraction des smartphones depuis Fnac...');
    let smartphones = [];
    
    const searchUrl = "https://www.fnac.com/Tous-les-telephones/shi59030/w-4";
    
    try {
      console.log(`📡 Extraction des données depuis: ${searchUrl}`);
      const response = await this.axiosInstance.get(searchUrl);
      
      const $ = cheerio.load(response.data);
      
      // Chercher les produits avec plusieurs sélecteurs
      let products = $('article').toArray();
      
      if (products.length === 0) {
        products = $('div').filter((i, el) => {
          const className = $(el).attr('class') || '';
          return /Article|product|item/i.test(className);
        }).toArray();
      }
      
      if (products.length === 0) {
        products = $('div[data-testid*="product"], div[data-testid*="item"]').toArray();
      }
      
      console.log(`📦 Trouvé ${products.length} éléments de produits`);
      
      // Configuration par défaut pour CLI vs API
      const maxItems = options.maxItems || 20;
      const delay = options.delay !== undefined ? options.delay : 1000;
      const fastMode = options.fastMode || false;
      
      const productSlice = products.slice(0, maxItems);
      
      for (let i = 0; i < productSlice.length; i++) {
        const product = productSlice[i];
        const smartphoneData = this.extractProductData($, product);
        
        if (smartphoneData) {
          smartphones.push(smartphoneData);
          console.log(`✅ Produit ${i + 1}: ${smartphoneData.title.substring(0, 50)}...`);
        }
        
        // Délai respectueux (configurable)
        if (delay > 0 && !fastMode) {
          await this.delay(delay + Math.random() * delay);
        }
      }
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'extraction: ${error.message}`);
      console.log('🔄 Utilisation des données de test en cas d\'échec...');
      smartphones = this.createTestData();
    }
    
    return smartphones;
  }
  
  extractProductData($, productElement) {
    try {
      const $product = $(productElement);
      
      // Titre du produit
      const titleSelectors = [
        'h3', 'h4', '.Article-desc', '.product-title',
        '[data-testid*="title"]', 'a[title]'
      ];
      
      const title = this.extractTextBySelectors($product, titleSelectors);
      
      if (!title || title.length < 3) {
        return null;
      }
      
      // Vérifier si c'est un smartphone
      const smartphoneKeywords = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'huawei', 'oneplus', 'oppo', 'smartphone', 'mobile'];
      if (!smartphoneKeywords.some(keyword => title.toLowerCase().includes(keyword))) {
        return null;
      }
      
      // Prix
      const priceSelectors = [
        '.price', '.Article-price', '[data-testid*="price"]',
        '.f-priceBox-price', '.priceBox-price'
      ];
      const price = this.extractTextBySelectors($product, priceSelectors);
      
      // URL du produit
      const linkElem = $product.find('a[href]').first();
      let productUrl = "";
      if (linkElem.length) {
        const href = linkElem.attr('href');
        if (href) {
          productUrl = new URL(href, this.baseUrl).href;
        }
      }
      
      // Image
      const imgSelectors = ['img[src]', 'img[data-src]', 'img[data-lazy]'];
      const imageUrl = this.extractImageBySelectors($product, imgSelectors);
      
      // Extraction de la marque depuis le titre
      const brand = this.extractBrand(title);
      
      // Extraction de la capacité de stockage
      const storage = this.extractStorage(title);
      
      return {
        title: title.trim(),
        brand: brand,
        model: this.extractModel(title, brand),
        storage: storage,
        price: price.trim() || "Prix non disponible",
        url: productUrl,
        image_url: imageUrl,
        source: 'Fnac'
      };
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'extraction des données du produit: ${error.message}`);
      return null;
    }
  }
  
  extractTextBySelectors($element, selectors) {
    for (const selector of selectors) {
      const found = $element.find(selector).first();
      if (found.length && found.text().trim()) {
        return found.text().trim();
      }
    }
    return "";
  }
  
  extractImageBySelectors($element, selectors) {
    for (const selector of selectors) {
      const img = $element.find(selector).first();
      if (img.length) {
        const src = img.attr('data-src') || img.attr('src') || img.attr('data-lazy');
        if (src) {
          try {
            return new URL(src, this.baseUrl).href;
          } catch (e) {
            // Continue si l'URL n'est pas valide
          }
        }
      }
    }
    return "";
  }
  
  extractBrand(title) {
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
    return "Autre";
  }
  
  extractModel(title, brand) {
    let model = title;
    if (brand && brand !== "Autre") {
      const brandRegex = new RegExp(`\\b${brand}\\b`, 'gi');
      model = title.replace(brandRegex, '').trim();
    }
    
    // Nettoyer et raccourcir
    model = model.replace(/\([^)]*\)/g, ''); // Supprimer les parenthèses
    model = model.replace(/\d+\s*Go|\d+\s*GB/g, ''); // Supprimer les capacités
    model = model.replace(/\s+/g, ' ').trim(); // Nettoyer les espaces
    
    return model.substring(0, 50) || "Modèle non spécifié";
  }
  
  extractStorage(title) {
    const storageMatch = title.match(/(\d+)\s*(Go|GB)/i);
    if (storageMatch) {
      return `${storageMatch[1]} GB`;
    }
    return "Capacité non spécifiée";
  }
  
  createTestData() {
    const testSmartphones = [
      {
        title: 'iPhone 15 Pro 128 GB Titanium Blue',
        brand: 'Apple',
        model: '15 Pro',
        storage: '128 GB',
        price: '1 229,00 €',
        url: 'https://www.fnac.com',
        image_url: 'https://static.fnac-static.com/multimedia/Images/FR/NR/iphone15pro.jpg',
        source: 'Test Data'
      },
      {
        title: 'Samsung Galaxy S24 Ultra 256 GB Phantom Black',
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        storage: '256 GB',
        price: '1 069,00 €',
        url: 'https://www.fnac.com',
        image_url: 'https://static.fnac-static.com/multimedia/Images/FR/NR/galaxys24.jpg',
        source: 'Test Data'
      },
      {
        title: 'Google Pixel 8 Pro 128 GB Obsidian',
        brand: 'Google',
        model: 'Pixel 8 Pro',
        storage: '128 GB',
        price: '799,00 €',
        url: 'https://www.fnac.com',
        image_url: 'https://static.fnac-static.com/multimedia/Images/FR/NR/pixel8.jpg',
        source: 'Test Data'
      },
      {
        title: 'Xiaomi 14 Ultra 512 GB Black',
        brand: 'Xiaomi',
        model: '14 Ultra',
        storage: '512 GB',
        price: '1 299,00 €',
        url: 'https://www.fnac.com',
        image_url: 'https://static.fnac-static.com/multimedia/Images/FR/NR/xiaomi14.jpg',
        source: 'Test Data'
      },
      {
        title: 'OnePlus 12 256 GB Flowy Emerald',
        brand: 'OnePlus',
        model: '12',
        storage: '256 GB',
        price: '949,00 €',
        url: 'https://www.fnac.com',
        image_url: 'https://static.fnac-static.com/multimedia/Images/FR/NR/oneplus12.jpg',
        source: 'Test Data'
      }
    ];
    
    console.log('📋 Utilisation des données de test en raison d\'un problème de scraping');
    return testSmartphones;
  }
  
  async saveToJson(smartphones, filename = 'smartphones.json') {
    const filePath = path.join(process.cwd(), filename);
    try {
      await fs.writeFile(filePath, JSON.stringify(smartphones, null, 2), 'utf-8');
      console.log(`💾 Données sauvegardées dans ${filename}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde: ${error.message}`);
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  console.log('🛒 LUXIO - Script de scraping Fnac (Node.js)');
  console.log('================================================');
  
  const scraper = new FnacSmartphoneScraper();
  
  const smartphones = await scraper.getSmartphones();
  
  if (smartphones && smartphones.length > 0) {
    console.log(`\n✅ Extraction terminée! ${smartphones.length} smartphones trouvés.`);
    
    // Sauvegarder en JSON
    await scraper.saveToJson(smartphones);
    
    // Afficher un résumé
    console.log('\n📱 Résumé des smartphones extraits:');
    smartphones.slice(0, 5).forEach((phone, index) => {
      console.log(`${index + 1}. ${phone.brand} ${phone.model} - ${phone.price}`);
    });
    
    if (smartphones.length > 5) {
      console.log(`... et ${smartphones.length - 5} autres`);
    }
  } else {
    console.log('❌ Aucun smartphone trouvé.');
  }
}

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default FnacSmartphoneScraper;
export { main };