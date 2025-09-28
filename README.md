# LUXIO - Boutique E-commerce Premium

## 🚀 Aperçu du Projet

LUXIO est une boutique e-commerce moderne et complète spécialisée dans la technologie premium. Le site propose une expérience d'achat fluide avec une interface utilisateur sophistiquée, un système de gestion des produits avancé et des fonctionnalités e-commerce complètes.

## ✨ Fonctionnalités Principales

### 🛒 **E-commerce Complet**
- **Catalogue produits** avec filtres avancés (marque, prix, stockage)
- **Pages catégories** : Smartphones, Montres, Mode, Maison, Mobilité, Services
- **Pages produits détaillées** avec galerie d'images, variantes et spécifications
- **Panier intelligent** avec persistance localStorage
- **Système de wishlist** avec icônes cœur interactives
- **Processus de commande** avec formulaire de livraison et moyens de paiement

### 🌐 **Multi-langue**
- Support de 5 langues : Français, Anglais, Espagnol, Portugais, Polonais
- Interface de commutation rapide avec drapeaux
- Traductions dynamiques via JavaScript

### 🔧 **Administration**
- **Interface d'administration** complète (`/admin/upload.html`)
- **Import automatique** de produits via API serverless
- **Ajout manuel** de produits avec formulaire complet
- **Statistiques** en temps réel
- **Upload d'images** par drag & drop

### 🌟 **Fonctionnalités Avancées**
- **Design responsive** avec système de design moderne
- **Thème sombre** avec palette noir/or
- **Animations fluides** et transitions
- **Accessibilité** optimisée
- **SEO-friendly** avec métadonnées

## 🏗️ Architecture Technique

### **Frontend**
- **HTML5/CSS3/JavaScript** pur (pas de framework lourd)
- **CSS Variables** pour le système de design
- **Grid et Flexbox** pour la mise en page responsive
- **LocalStorage** pour la persistance des données

### **Backend**
- **Node.js Express** pour le serveur principal
- **API Serverless** compatible Vercel (`/api/import-products.js`)
- **Web scraping** avec Axios et Cheerio
- **Gestion des données** via JSON

### **Déploiement**
- **Compatible Vercel** et Replit
- **Serverless functions** pour l'import de produits
- **Configuration autoscale** pour la production

## 📁 Structure du Projet

```
luxio/
├── 📄 index.html              # Page d'accueil
├── 📄 cart.html              # Panier d'achat
├── 📄 checkout.html          # Finalisation commande
├── 📄 server.js              # Serveur Express principal
├── 📄 package.json           # Dépendances Node.js
├── 📄 replit.md              # Documentation Replit
└── 📄 README.md              # Documentation complète

📁 categories/                 # Pages catégories
├── 📄 smartphones.html       # Catégorie smartphones
├── 📄 watches.html           # Catégorie montres
├── 📄 fashion.html           # Catégorie mode
├── 📄 home.html              # Catégorie maison
├── 📄 mobility.html          # Catégorie mobilité
└── 📄 services.html          # Catégorie services

📁 product/                    # Pages produits détaillées
└── 📄 iphone-17-pro-max-512gb-titanium-blue.html

📁 admin/                      # Interface d'administration
└── 📄 upload.html            # Gestion des produits

📁 api/                        # API Serverless
├── 📄 import-products.js     # Import automatique produits
├── 📄 create-payment.js      # Traitement paiements
└── 📄 submit-order.js        # Soumission commandes

📁 css/                        # Styles
└── 📄 modern.css             # Styles principaux

📁 js/                         # Scripts JavaScript
├── 📄 modern.js              # Fonctions principales
├── 📄 cart.js                # Gestion du panier
├── 📄 languages.js           # Système multi-langue
├── 📄 wishlist.js            # Gestion de la wishlist
└── 📄 category.js            # Logique des pages catégories

📁 data/                       # Données
└── 📄 products.json          # Base de données produits

📁 assets/                     # Ressources
└── 📁 products/              # Images produits

📁 img/                        # Images du site
```

## 🛠️ Installation et Configuration

### **Prérequis**
- Node.js 18+ 
- NPM ou équivalent

### **Installation Locale (Replit)**
```bash
# Les dépendances sont automatiquement installées
npm install

# Démarrer le serveur
npm start
# ou
node server.js
```

### **Déploiement Vercel**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configuration automatique des serverless functions
```

### **Variables d'Environnement Requises**
```env
# Paiement Maxelpay
MAXELPAY_KEY=your_maxelpay_key
MAXELPAY_SECRET=your_maxelpay_secret

# Email (notifications commandes)
SHOP_EMAIL=boutique@luxio.com
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_password
```

## 📊 Gestion des Produits

### **Structure des Données Produit**
```json
{
  "id": "iphone-17-pro-max-512gb",
  "slug": "iphone-17-pro-max-512gb-titanium-blue",
  "title": "iPhone 17 Pro Max 512 GB Titanium Blue",
  "brand": "Apple",
  "model": "iPhone 17 Pro Max",
  "category": "smartphones",
  "price": 1599.00,
  "originalPrice": 1799.00,
  "currency": "EUR",
  "discount": 11,
  "isNew": true,
  "isFeatured": true,
  "inStock": true,
  "stock": 15,
  "rating": 4.9,
  "reviewCount": 127,
  "shortDescription": "Description courte...",
  "description": "Description complète...",
  "features": ["Feature 1", "Feature 2"],
  "specifications": {
    "screen": "6,7\" Super Retina XDR",
    "processor": "Puce A18 Pro"
  },
  "images": ["/assets/products/image1.jpg"],
  "thumbnail": "/assets/products/thumb.jpg",
  "variants": [],
  "colors": [],
  "tags": ["nouveau", "premium"],
  "seo": {
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description"
  }
}
```

### **Import Automatique de Produits**

#### **Via Interface d'Administration**
1. Accéder à `/admin/upload.html`
2. Onglet "Import Automatique"
3. Sélectionner la catégorie
4. Optionnel : URL source personnalisée
5. Cocher "Sauvegarder directement" pour mise à jour automatique

#### **Via API**
```bash
# Import smartphones avec sauvegarde automatique
GET /api/import-products?category=smartphones&seed=true

# Import avec URL personnalisée
GET /api/import-products?category=watches&sourceUrl=https://example.com&seed=true

# Réponse JSON
{
  "products": [...],
  "count": 10,
  "category": "smartphones",
  "saved": true,
  "message": "10 produits importés avec succès"
}
```

### **Ajout Manuel de Produits**
1. Interface d'administration `/admin/upload.html`
2. Onglet "Ajout Manuel"
3. Remplir le formulaire complet
4. Upload d'images par drag & drop
5. Génération JSON automatique
6. Copier-coller dans `data/products.json`

## 🎨 Personnalisation du Design

### **Système de Couleurs**
```css
:root {
  --primary: #000000;        /* Noir principal */
  --secondary: #ffd700;      /* Or/Jaune */
  --accent: #1a1a1a;        /* Gris foncé */
  --surface: #0d0d0d;       /* Surface */
  --background: #000000;     /* Arrière-plan */
  --text-primary: #ffffff;   /* Texte principal */
  --text-secondary: #e0e0e0; /* Texte secondaire */
  --success: #00ff88;        /* Succès */
  --warning: #ff9500;        /* Avertissement */
  --error: #ff3b30;          /* Erreur */
}
```

### **Responsive Design**
- **Desktop** : 1200px+
- **Tablet** : 768px - 1199px  
- **Mobile** : < 768px

### **Composants Réutilisables**
- `.btn-primary` : Bouton principal (fond or)
- `.btn-secondary` : Bouton secondaire (contour)
- `.product-card` : Carte produit standard
- `.badge` : Badge (nouveau, promo, rupture)
- `.wishlist-btn` : Bouton favori (cœur)

## 🔌 Intégrations

### **Paiement Maxelpay**
- Support Virement bancaire
- Tickets Transcash/PCS
- Crypto-monnaies
- API sécurisée avec clés d'environnement

### **Email (Nodemailer)**
- Notifications de commande
- Confirmations d'achat
- Configuration SMTP flexible

### **Web Scraping**
- Sites supportés : Fnac, Amazon, Zalando, IKEA, Decathlon
- Sélecteurs adaptatifs selon la source
- Données de test automatiques en cas d'échec

## 📱 Pages et Navigation

### **Pages Principales**
- **Accueil** (`/`) : Vitrine, produits vedettes
- **Catégories** (`/categories/*.html`) : Listing avec filtres
- **Produits** (`/product/*.html`) : Détails complets
- **Panier** (`/cart.html`) : Gestion achats
- **Checkout** (`/checkout.html`) : Finalisation
- **Admin** (`/admin/upload.html`) : Gestion back-office

### **Navigation**
- Menu principal avec catégories
- Breadcrumbs (fil d'Ariane)
- Recherche avec filtres par catégorie
- Sélecteur de langue
- Actions utilisateur (compte, wishlist, panier)

## 🔧 API et Endpoints

### **`/api/import-products`**
```javascript
// GET/POST /api/import-products
// Paramètres :
{
  category: 'smartphones|watches|fashion|home|mobility|services',
  sourceUrl: 'URL optionnelle',
  seed: true|false,  // Sauvegarde automatique
  maxProducts: 20    // Limite produits
}

// Réponse :
{
  products: [...],     // Produits extraits
  count: number,       // Nombre de produits
  category: string,    // Catégorie traitée
  saved: boolean,      // Si sauvegardé
  message: string      // Message de statut
}
```

## 🎯 Performance et SEO

### **Performance**
- **Images optimisées** avec `loading="lazy"`
- **CSS efficient** avec variables et grille
- **JavaScript modulaire** sans frameworks lourds
- **Compression** automatique sur Vercel

### **SEO**
- **Métadonnées** complètes par produit
- **Structure sémantique** HTML5
- **URLs propres** avec slugs
- **Balises Open Graph** prêtes
- **Schema.org** pour produits

### **Accessibilité**
- **ARIA labels** sur les interactions
- **Navigation clavier** complète
- **Contraste** optimisé (noir/or)
- **Textes alternatifs** sur images
- **Focus visible** sur éléments interactifs

## 🚀 Fonctionnalités E-commerce

### **Panier**
- Ajout/suppression produits
- Modification quantités
- Calcul automatique des totaux
- Persistance localStorage
- Badge de comptage dynamique

### **Wishlist (Liste de Souhaits)**
- Boutons cœur sur tous les produits
- Modal dédiée avec gestion complète
- Transfert vers panier
- Persistance localStorage
- Compteur dans l'en-tête

### **Filtres et Tri**
- **Filtres** : Marque, Prix, Stockage, Recherche
- **Tri** : Nouveautés, Prix, Note, Nom, Mis en avant
- **Vues** : Grille et Liste
- Tags de filtres actifs supprimables

### **Checkout**
- Formulaire de livraison complet
- Sélection moyens de paiement par onglets
- Validation JavaScript
- Résumé de commande
- Email de confirmation automatique

---

*Dernière mise à jour : 28 septembre 2025*

## 🔧 API Backend (Configuration précédente)

Backend serverless pour la gestion des commandes et l'envoi d'e-mails de confirmation.

## Configuration

### Variables d'environnement

Pour que la fonction `submit-order` fonctionne, vous devez configurer les variables d'environnement suivantes dans le tableau de bord Vercel :

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SHOP_EMAIL` | Email du propriétaire qui recevra une copie des commandes | `owner@luxio.com` |
| `MAIL_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Port SMTP | `587` ou `465` |
| `MAIL_USER` | Nom d'utilisateur SMTP | `votre-email@gmail.com` |
| `MAIL_PASS` | Mot de passe SMTP ou mot de passe d'application | `votre-mot-de-passe` |

### Configuration SMTP populaires

#### Gmail
- `MAIL_HOST`: `smtp.gmail.com`
- `MAIL_PORT`: `587`
- `MAIL_USER`: `votre-email@gmail.com`
- `MAIL_PASS`: Utilisez un [mot de passe d'application](https://support.google.com/accounts/answer/185833)

#### Outlook/Hotmail
- `MAIL_HOST`: `smtp-mail.outlook.com`
- `MAIL_PORT`: `587`
- `MAIL_USER`: `votre-email@outlook.com`
- `MAIL_PASS`: Votre mot de passe Outlook

## Installation et déploiement

### 1. Installation des dépendances
```bash
npm install
```

### 2. Déploiement sur Vercel
```bash
# Installation de Vercel CLI (si pas déjà fait)
npm i -g vercel

# Déploiement
vercel --prod
```

### 3. Test local (optionnel)
```bash
# Créer un fichier .env.local avec vos variables
vercel dev
```

## Utilisation de l'API

### Endpoint : `/api/submit-order`

**Méthode :** `POST`

**Content-Type :** `application/json`

**Structure des données :**

```json
{
  "ref": "ORD-2025-001",
  "customer": {
    "name": "Jean Dupont",
    "email": "jean.dupont@email.com",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "zip": "75001",
    "country": "France",
    "phone": "+33123456789"
  },
  "items": [
    {
      "name": "iPhone 15 Pro",
      "qty": 1,
      "price": 1199.99
    },
    {
      "name": "Coque iPhone",
      "qty": 2,
      "price": 29.99
    }
  ],
  "total": "1259.97",
  "currency": "EUR"
}
```

**Réponse de succès :**
```json
{
  "success": true,
  "message": "Order confirmation emails sent successfully",
  "ref": "ORD-2025-001"
}
```

**Réponse d'erreur :**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Structure du projet

```
/
├── api/
│   ├── submit-order.js     # Fonction serverless pour les commandes
│   └── create-payment.js   # Fonction existante pour les paiements
├── package.json
└── README.md
```

## Emails envoyés

La fonction envoie automatiquement deux e-mails :

1. **E-mail au client** : Confirmation de commande avec récapitulatif
2. **E-mail au propriétaire** : Notification de nouvelle commande

Les e-mails incluent :
- Référence de commande
- Détails du client
- Liste des articles commandés
- Montant total
- Adresse de livraison

## Sécurité

- Validation des données d'entrée
- Vérification des variables d'environnement
- Gestion des erreurs complète
- Acceptance uniquement des requêtes POST
