# API Scraper Serverless - Node.js

API serverless pour extraire des données produits depuis des sites e-commerce, optimisée pour Vercel.

## 📋 Fonctionnalités

- ✅ **Extraction automatique** : titre, prix, image, lien produit
- ✅ **Fallback intelligent** : données de test en cas d'erreur
- ✅ **Filtrage smartphones** : ne retourne que les produits smartphones
- ✅ **Headers réalistes** : User-Agent et headers pour éviter la détection
- ✅ **Timeout configuré** : évite les blocages prolongés
- ✅ **CORS activé** : utilisable depuis n'importe quel frontend

## 🚀 Utilisation

### Endpoint principal
```
GET /api/scraper
```

### Paramètres

| Paramètre | Type | Obligatoire | Description | Défaut |
|-----------|------|-------------|-------------|---------|
| `url` | string | Non | URL de la page à scraper | Page smartphones Fnac |

### Exemples d'appel

#### 1. Scraper avec URL par défaut (Fnac smartphones)
```bash
curl "https://votre-site.vercel.app/api/scraper"
```

#### 2. Scraper avec URL personnalisée
```bash
curl "https://votre-site.vercel.app/api/scraper?url=https://www.fnac.com/Tous-les-telephones/shi59030/w-4"
```

#### 3. Depuis JavaScript (frontend)
```javascript
// Avec URL par défaut
const response = await fetch('/api/scraper');
const data = await response.json();

// Avec URL personnalisée
const response = await fetch('/api/scraper?url=https://site-ecommerce.com/smartphones');
const data = await response.json();
```

## 📄 Réponse API

### Succès
```json
{
  "products": [
    {
      "title": "iPhone 15 Pro 128 GB Titanium Blue",
      "brand": "Apple",
      "model": "15 Pro",
      "storage": "128 GB",
      "price": "1 229,00 €",
      "image": "https://static.fnac-static.com/...",
      "link": "https://www.fnac.com/...",
      "source": "Fnac"
    }
  ],
  "total": 5,
  "source": "scraped",
  "url": "https://www.fnac.com/Tous-les-telephones/shi59030/w-4"
}
```

### Fallback (données de test)
```json
{
  "products": [
    {
      "title": "iPhone 15 Pro 128 GB Titanium Blue",
      "brand": "Apple",
      "model": "15 Pro",
      "storage": "128 GB",
      "price": "1 229,00 €",
      "image": "https://static.fnac-static.com/...",
      "link": "https://www.fnac.com",
      "source": "Test Data"
    }
  ],
  "source": "test_data",
  "message": "Erreur lors du scraping, données de test retournées"
}
```

### Erreur
```json
{
  "error": "Message d'erreur détaillé"
}
```

## 🔧 Configuration technique

### Sélecteurs utilisés (Fnac.com)

L'API utilise des sélecteurs CSS adaptatifs pour extraire les données :

- **Produits** : `article[class*="Article"]`, `div[class*="product"]`, `div[data-testid*="product"]`
- **Titre** : `h3`, `h4`, `.Article-desc`, `.product-title`, `[data-testid*="title"]`
- **Prix** : `.price`, `.Article-price`, `[data-testid*="price"]`, `.f-priceBox-price`
- **Image** : `img[src]`, `img[data-src]`, `img[data-lazy]`

### Headers HTTP utilisés
```javascript
{
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
  'Referer': 'https://www.fnac.com/',
  'Cache-Control': 'no-cache'
}
```

### Limites

- **Timeout** : 10 secondes maximum
- **Produits** : 20 maximum par requête
- **Filtrage** : ne retourne que les smartphones (mots-clés : iPhone, Samsung, Galaxy, Pixel, etc.)

## 🔄 Intégration avec votre application

### Dans votre frontend LUXIO
```javascript
// Dans js/smartphones.js
async function loadSmartphones() {
    try {
        const response = await fetch('/api/scraper');
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Erreur chargement produits:', error);
        // Fallback vers smartphones.json local
        loadLocalProducts();
    }
}
```

### Mise à jour automatique
```javascript
// Rafraîchir les données toutes les heures
setInterval(loadSmartphones, 3600000);
```

## 📦 Déploiement Vercel

### 1. Structure des fichiers
```
/
├── api/
│   └── scraper.js          # API serverless
├── package.json            # Dépendances avec "cheerio" et "axios"
└── README-scraper.md       # Cette documentation
```

### 2. Variables d'environnement (optionnelles)
```bash
# Pas de variables requises pour la version de base
# Possibilité d'ajouter des tokens/proxies si nécessaire
```

### 3. Commandes de déploiement
```bash
# Installation des dépendances
npm install

# Test local
vercel dev

# Déploiement production
vercel --prod
```

## 🛠️ Adaptation à d'autres sites

Pour adapter l'API à d'autres sites e-commerce, modifiez les sélecteurs dans `/api/scraper.js` :

```javascript
// Exemple pour un autre site
const productSelectors = [
    '.product-item',           // Sélecteur produit principal
    '.product-card',           // Sélecteur alternatif
];

const titleSelectors = [
    '.product-name',           // Titre produit
    'h2.title',               // Titre alternatif
];

const priceSelectors = [
    '.price-current',          // Prix principal
    '.price .amount',          // Prix alternatif
];
```

## ⚠️ Notes importantes

- **Respect des robots.txt** : vérifiez les conditions d'utilisation des sites cibles
- **Rate limiting** : l'API limite automatiquement à 20 produits par requête
- **Fallback automatique** : en cas d'erreur, l'API retourne toujours des données de test
- **CORS** : configuré pour accepter toutes les origines (`*`)

## 🔗 Liens utiles

- [Documentation Vercel Serverless](https://vercel.com/docs/serverless-functions)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Axios Documentation](https://axios-http.com/)