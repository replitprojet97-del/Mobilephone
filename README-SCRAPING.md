# 🛒 LUXIO - Scripts de Scraping Node.js

## Vue d'ensemble

Ce projet utilise maintenant un système de scraping **100% Node.js** pour la collecte de données de smartphones depuis Fnac.com. Le système Python précédent a été complètement converti pour une compatibilité totale avec Vercel et un déploiement serverless.

## 🚀 Fonctionnalités

- **Scraping automatique** des smartphones depuis Fnac.com
- **Données de test** de fallback en cas d'échec du scraping
- **API intégrée** pour l'utilisation depuis le frontend
- **Scripts manuels** pour la mise à jour des données
- **Compatible Vercel** - pas de dépendances serveur persistant

## 📋 Scripts disponibles

### Scraping manuel
```bash
# Lancer le scraping et sauvegarder dans smartphones.json
npm run scrape

# Alternative (même commande)
npm run scrape:phones
```

### API de scraping
L'endpoint `/api/scraper` est automatiquement disponible et utilise la même logique :
```bash
# Test via curl
curl http://localhost:5000/api/scraper

# Réponse JSON avec les smartphones trouvés
```

## 🏗️ Architecture technique

### Fichiers créés
- `scripts/fnac-scraper.js` - Script principal de scraping
- `api/scraper.js` - Endpoint API pour l'usage frontend
- `smartphones.json` - Fichier de données généré automatiquement

### Dépendances Node.js utilisées
- **axios** - Requêtes HTTP (remplace `requests` Python)
- **cheerio** - Parsing HTML (remplace `BeautifulSoup` Python)
- **fs** - Gestion des fichiers JSON

### Logique de scraping
1. **Extraction** depuis la page Fnac des smartphones
2. **Parsing HTML** avec des sélecteurs CSS robustes
3. **Extraction de métadonnées** : marque, modèle, prix, stockage, image
4. **Fallback automatique** vers des données de test en cas d'erreur
5. **Sauvegarde** au format JSON

## 🔧 Utilisation avant déploiement

### Développement local
```bash
# 1. Lancer le scraping pour mettre à jour les données
npm run scrape

# 2. Lancer le serveur de développement
npm start

# 3. Tester l'API
curl http://localhost:5000/api/scraper
```

### Workflow de déploiement Vercel
```bash
# 1. Scraping des dernières données avant déploiement
npm run scrape

# 2. Commit des nouvelles données
git add smartphones.json
git commit -m "Update smartphones data"

# 3. Déploiement
npm run deploy
```

## 🛡️ Gestion d'erreurs

Le système inclut une gestion robuste des erreurs :
- **Erreurs réseau** → Utilisation des données de test
- **Erreurs de parsing** → Log des erreurs + fallback
- **Site inaccessible** → Données de test automatiques
- **Timeout** → Limite de 10 secondes + fallback

## 📊 Format des données

```json
{
  "title": "iPhone 15 Pro 128 GB Titanium Blue",
  "brand": "Apple",
  "model": "15 Pro", 
  "storage": "128 GB",
  "price": "1 229,00 €",
  "url": "https://www.fnac.com/...",
  "image_url": "https://static.fnac-static.com/...",
  "source": "Fnac" // ou "Test Data"
}
```

## ⚙️ Configuration

### Headers HTTP
Le scraper utilise des headers réalistes pour éviter les blocages :
- User-Agent moderne Chrome
- Accept-Language français
- Referer Fnac.com
- Cache-Control approprié

### Limites et performances

#### API (serverless/Vercel)
- **8 produits maximum** par appel (éviter les timeouts serverless)
- **Pas de délai** artificiel (mode rapide)
- **Timeout** de 10 secondes par requête
- **Fallback immédiat** aux données de test

#### CLI (npm run scrape)
- **20 produits maximum** par scraping
- **Délais respectueux** entre les requêtes (1-2 secondes)  
- **Sauvegarde** dans smartphones.json
- **Fallback automatique** si aucun produit trouvé

## 🚀 Compatibilité Vercel

Le système est entièrement compatible Vercel :
- ✅ **Pas de serveur persistant** requis
- ✅ **Functions serverless** uniquement
- ✅ **Scripts manuels** pour mise à jour des données
- ✅ **Pas de dépendances système** (Python, pip, etc.)
- ✅ **Node.js natif** seulement

## 🔄 Migration depuis Python

La conversion Python → Node.js conserve :
- ✅ **Même logique** de scraping
- ✅ **Mêmes sélecteurs** CSS
- ✅ **Même format** de données de sortie
- ✅ **Même gestion** d'erreurs
- ✅ **Mêmes données** de test de fallback

## 📝 Logs et debugging

```bash
# Voir les logs détaillés du scraping
npm run scrape

# Test de l'API avec logs
curl -v http://localhost:5000/api/scraper
```

Les logs incluent :
- Nombre de produits trouvés
- Titre de chaque smartphone extrait
- Source des données (scraped/test_data)
- Erreurs de scraping avec détails