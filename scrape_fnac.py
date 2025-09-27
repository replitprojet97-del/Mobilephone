#!/usr/bin/env python3
"""
Script pour extraire les données de smartphones depuis Fnac.com
"""

import requests
from bs4 import BeautifulSoup
import time
import random
import json
import re
from urllib.parse import urljoin, urlparse

class FnacSmartphoneScraper:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Referer': 'https://www.fnac.com/',
            'Cache-Control': 'no-cache'
        }
        self.session.headers.update(self.headers)
        self.base_url = "https://www.fnac.com"
        
    def get_smartphones(self, max_pages=3):
        """Extraire les smartphones depuis Fnac"""
        smartphones = []
        
        # URL pour la recherche smartphones
        search_url = "https://www.fnac.com/Tous-les-telephones/shi59030/w-4"
        
        try:
            print(f"Extraction des données depuis: {search_url}")
            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Chercher les produits
            products = soup.find_all(['article', 'div'], class_=re.compile(r'Article|product|item'))
            
            if not products:
                # Alternative selectors
                products = soup.find_all('div', {'data-testid': re.compile(r'product|item')})
            
            print(f"Trouvé {len(products)} éléments de produits")
            
            for i, product in enumerate(products[:20]):  # Limiter à 20 produits pour le test
                smartphone_data = self.extract_product_data(product)
                if smartphone_data:
                    smartphones.append(smartphone_data)
                    print(f"Produit {i+1}: {smartphone_data['title'][:50]}...")
                
                # Délai respectueux
                time.sleep(random.uniform(1, 2))
                
        except requests.RequestException as e:
            print(f"Erreur lors de l'extraction: {e}")
            # Créer des données de test en cas d'échec
            smartphones = self.create_test_data()
            
        return smartphones
    
    def extract_product_data(self, product_element):
        """Extraire les données d'un produit smartphone"""
        try:
            # Titre du produit
            title_selectors = [
                'h3', 'h4', '.Article-desc', '.product-title',
                '[data-testid*="title"]', 'a[title]'
            ]
            title = self.extract_text_by_selectors(product_element, title_selectors)
            
            if not title or len(title) < 3:
                return None
                
            # Vérifier si c'est un smartphone
            smartphone_keywords = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'huawei', 'oneplus', 'oppo', 'smartphone', 'mobile']
            if not any(keyword in title.lower() for keyword in smartphone_keywords):
                return None
            
            # Prix
            price_selectors = [
                '.price', '.Article-price', '[data-testid*="price"]',
                '.f-priceBox-price', '.priceBox-price'
            ]
            price = self.extract_text_by_selectors(product_element, price_selectors)
            
            # URL du produit
            link_elem = product_element.find('a', href=True)
            product_url = ""
            if link_elem:
                href = link_elem.get('href')
                if href:
                    product_url = urljoin(self.base_url, href)
            
            # Image
            img_selectors = [
                'img[src]', 'img[data-src]', 'img[data-lazy]'
            ]
            image_url = self.extract_image_by_selectors(product_element, img_selectors)
            
            # Extraction de la marque depuis le titre
            brand = self.extract_brand(title)
            
            # Extraction de la capacité de stockage
            storage = self.extract_storage(title)
            
            return {
                'title': title.strip(),
                'brand': brand,
                'model': self.extract_model(title, brand),
                'storage': storage,
                'price': price.strip() if price else "Prix non disponible",
                'url': product_url,
                'image_url': image_url,
                'source': 'Fnac'
            }
            
        except Exception as e:
            print(f"Erreur lors de l'extraction des données du produit: {e}")
            return None
    
    def extract_text_by_selectors(self, element, selectors):
        """Extraire du texte en essayant plusieurs sélecteurs"""
        for selector in selectors:
            found = element.select_one(selector)
            if found and found.get_text(strip=True):
                return found.get_text(strip=True)
        return ""
    
    def extract_image_by_selectors(self, element, selectors):
        """Extraire une URL d'image en essayant plusieurs sélecteurs"""
        for selector in selectors:
            img = element.select_one(selector)
            if img:
                src = img.get('data-src') or img.get('src') or img.get('data-lazy')
                if src:
                    return urljoin(self.base_url, src)
        return ""
    
    def extract_brand(self, title):
        """Extraire la marque depuis le titre"""
        brands = {
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
        }
        
        title_lower = title.lower()
        for brand, keywords in brands.items():
            if any(keyword in title_lower for keyword in keywords):
                return brand
        return "Autre"
    
    def extract_model(self, title, brand):
        """Extraire le modèle depuis le titre"""
        # Nettoyer le titre en supprimant la marque
        model = title
        if brand and brand != "Autre":
            model = re.sub(rf'\b{re.escape(brand)}\b', '', title, flags=re.IGNORECASE).strip()
        
        # Nettoyer et raccourcir
        model = re.sub(r'\([^)]*\)', '', model)  # Supprimer les parenthèses
        model = re.sub(r'\d+\s*Go|\d+\s*GB', '', model)  # Supprimer les capacités
        model = re.sub(r'\s+', ' ', model).strip()  # Nettoyer les espaces
        
        return model[:50] if model else "Modèle non spécifié"
    
    def extract_storage(self, title):
        """Extraire la capacité de stockage depuis le titre"""
        storage_match = re.search(r'(\d+)\s*(Go|GB)', title, re.IGNORECASE)
        if storage_match:
            return f"{storage_match.group(1)} GB"
        return "Capacité non spécifiée"
    
    def create_test_data(self):
        """Créer des données de test en cas d'échec du scraping"""
        test_smartphones = [
            {
                'title': 'iPhone 15 Pro 128 GB Titanium Blue',
                'brand': 'Apple',
                'model': '15 Pro',
                'storage': '128 GB',
                'price': '1 229,00 €',
                'url': 'https://www.fnac.com',
                'image_url': 'https://static.fnac-static.com/multimedia/Images/FR/NR/iphone15pro.jpg',
                'source': 'Test Data'
            },
            {
                'title': 'Samsung Galaxy S24 Ultra 256 GB Phantom Black',
                'brand': 'Samsung',
                'model': 'Galaxy S24 Ultra',
                'storage': '256 GB',
                'price': '1 069,00 €',
                'url': 'https://www.fnac.com',
                'image_url': 'https://static.fnac-static.com/multimedia/Images/FR/NR/galaxys24.jpg',
                'source': 'Test Data'
            },
            {
                'title': 'Google Pixel 8 Pro 128 GB Obsidian',
                'brand': 'Google',
                'model': 'Pixel 8 Pro',
                'storage': '128 GB',
                'price': '799,00 €',
                'url': 'https://www.fnac.com',
                'image_url': 'https://static.fnac-static.com/multimedia/Images/FR/NR/pixel8.jpg',
                'source': 'Test Data'
            },
            {
                'title': 'Xiaomi 14 Ultra 512 GB Black',
                'brand': 'Xiaomi',
                'model': '14 Ultra',
                'storage': '512 GB',
                'price': '1 299,00 €',
                'url': 'https://www.fnac.com',
                'image_url': 'https://static.fnac-static.com/multimedia/Images/FR/NR/xiaomi14.jpg',
                'source': 'Test Data'
            },
            {
                'title': 'OnePlus 12 256 GB Flowy Emerald',
                'brand': 'OnePlus',
                'model': '12',
                'storage': '256 GB',
                'price': '949,00 €',
                'url': 'https://www.fnac.com',
                'image_url': 'https://static.fnac-static.com/multimedia/Images/FR/NR/oneplus12.jpg',
                'source': 'Test Data'
            }
        ]
        
        print("Utilisation des données de test en raison d'un problème de scraping")
        return test_smartphones
    
    def save_to_json(self, smartphones, filename='smartphones.json'):
        """Sauvegarder les données en JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(smartphones, f, ensure_ascii=False, indent=2)
        print(f"Données sauvegardées dans {filename}")

def main():
    """Fonction principale"""
    scraper = FnacSmartphoneScraper()
    
    print("Début de l'extraction des smartphones depuis Fnac...")
    smartphones = scraper.get_smartphones()
    
    if smartphones:
        print(f"\nExtraction terminée! {len(smartphones)} smartphones trouvés.")
        
        # Sauvegarder en JSON
        scraper.save_to_json(smartphones)
        
        # Afficher un résumé
        print("\nRésumé des smartphones extraits:")
        for i, phone in enumerate(smartphones[:5], 1):
            print(f"{i}. {phone['brand']} {phone['model']} - {phone['price']}")
        
        if len(smartphones) > 5:
            print(f"... et {len(smartphones) - 5} autres")
            
    else:
        print("Aucun smartphone trouvé.")

if __name__ == "__main__":
    main()