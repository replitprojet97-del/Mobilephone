# Backend Maxelpay pour Luxio

Backend serverless Node.js déployé sur Vercel pour l'intégration des paiements cryptocurrency via Maxelpay.

## 🚀 Fonctionnalités

- ✅ Fonction serverless pour création de liens de paiement Maxelpay
- ✅ Support des cryptomonnaies (Bitcoin, Ethereum, Litecoin, etc.)
- ✅ Gestion sécurisée des clés API
- ✅ Validation complète des données d'entrée
- ✅ Gestion d'erreurs robuste
- ✅ Logs détaillés pour le debugging

## 📁 Structure du Projet

```
/
├── api/
│   └── create-payment.js    # Fonction serverless principale
├── package.json             # Dépendances du projet
├── README-maxelpay-backend.md # Documentation backend
└── vercel.json             # Configuration Vercel (optionnel)
```

## 🛠 Déploiement sur Vercel

### 1. Prérequis

- Compte [Vercel](https://vercel.com) 
- Compte [Maxelpay](https://maxelpay.com) avec clés API
- [Vercel CLI](https://vercel.com/docs/cli) installé (optionnel)

### 2. Méthode 1 : Déploiement via Interface Web

1. **Connecter votre repository :**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "New Project"
   - Connectez votre repository GitHub/GitLab/Bitbucket
   - Sélectionnez votre projet

2. **Configuration automatique :**
   - Vercel détecte automatiquement les fonctions serverless dans `/api`
   - Aucune configuration supplémentaire requise

3. **Déployement :**
   - Cliquez sur "Deploy"
   - Votre API sera disponible à `https://votre-projet.vercel.app/api/create-payment`

### 3. Méthode 2 : Déploiement via CLI

```bash
# Installer Vercel CLI globalement
npm i -g vercel

# Dans le dossier de votre projet
vercel login
vercel

# Pour déployer en production
vercel --prod
```

## 🔐 Configuration des Variables d'Environnement

### Sur Vercel (Interface Web)

1. Allez dans votre projet sur vercel.com
2. Cliquez sur l'onglet "Settings"
3. Allez dans "Environment Variables"
4. Ajoutez les variables suivantes :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `MAXELPAY_KEY` | Votre clé publique Maxelpay | Production + Preview + Development |
| `MAXELPAY_SECRET` | Votre clé secrète Maxelpay | Production + Preview + Development |

### Via CLI

```bash
# Ajouter les variables d'environnement
vercel env add MAXELPAY_KEY
# Entrer votre clé Maxelpay quand demandé

vercel env add MAXELPAY_SECRET  
# Entrer votre clé secrète Maxelpay quand demandé

# Redéployer avec les nouvelles variables
vercel --prod
```

### Pour le développement local

Créez un fichier `.env.local` :

```env
MAXELPAY_KEY=your_maxelpay_public_key_here
MAXELPAY_SECRET=your_maxelpay_secret_key_here
```

⚠️ **Important :** Ajoutez `.env.local` à votre `.gitignore`

## 📡 Utilisation de l'API

### Endpoint

```
POST /api/create-payment
```

### Headers requis

```
Content-Type: application/json
```

### Body de la requête

```json
{
  "amount": 99.99,
  "currency": "EUR"
}
```

### Paramètres

- `amount` (number, requis) : Montant du paiement
- `currency` (string, requis) : Devise (EUR, USD, BTC, ETH)

### Réponse de succès (200)

```json
{
  "success": true,
  "paymentUrl": "https://pay.maxelpay.com/payment/abc123",
  "paymentId": "pay_abc123def456",
  "expiresAt": "2025-01-01T12:00:00Z",
  "message": "Lien de paiement généré avec succès"
}
```

### Réponses d'erreur

```json
// 400 - Paramètres invalides
{
  "error": "Paramètres manquants. amount et currency sont requis."
}

// 405 - Méthode non autorisée
{
  "error": "Méthode non autorisée. Utilisez POST uniquement."
}

// 500 - Erreur serveur
{
  "error": "Erreur Maxelpay"
}
```

## 🌐 Intégration Frontend

### Exemple avec fetch (JavaScript)

```javascript
async function createCryptoPayment(amount, currency = 'EUR') {
    try {
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency
            })
        });

        const data = await response.json();

        if (data.success) {
            // Rediriger vers la page de paiement
            window.open(data.paymentUrl, '_blank');
        } else {
            console.error('Erreur:', data.error);
            alert('Erreur lors de la création du paiement');
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion');
    }
}

// Utilisation
createCryptoPayment(99.99, 'EUR');
```

### Exemple avec curl

```bash
curl -X POST https://votre-projet.vercel.app/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "currency": "EUR"
  }'
```

## 🔧 Développement Local

### Installation des dépendances

```bash
npm install
```

### Lancement du serveur de développement

```bash
# Avec Vercel CLI (recommandé)
vercel dev

# Ou avec npm (si configuré)
npm run dev
```

L'API sera disponible à `http://localhost:3000/api/create-payment`

## 🐛 Debugging

### Logs Vercel

```bash
# Voir les logs en temps réel
vercel logs your-deployment-url

# Ou via l'interface web
# Dashboard > Votre Projet > Functions > Logs
```

### Variables d'environnement de debug

Ajoutez `NODE_ENV=development` pour avoir plus de détails d'erreur.

## 🔒 Sécurité

- ✅ Les clés API sont stockées comme variables d'environnement
- ✅ Validation stricte des paramètres d'entrée
- ✅ Gestion des erreurs sans exposition d'informations sensibles
- ✅ CORS configuré automatiquement par Vercel
- ✅ Timeout sur les requêtes externes (30s)

## 📝 Logs et Monitoring

Tous les événements importants sont loggés :

- Créations de paiement réussies
- Erreurs d'API Maxelpay  
- Erreurs de validation
- Problèmes de configuration

## ⚠️ Notes Importantes

1. **URL Maxelpay :** L'URL `https://api.maxelpay.com/v1/payment` est un exemple. Remplacez-la par l'URL réelle fournie par Maxelpay.

2. **Limites de taux :** Respectez les limites de l'API Maxelpay pour éviter les erreurs 429.

3. **Webhooks :** Pour une intégration complète, configurez les webhooks Maxelpay pour recevoir les confirmations de paiement.

4. **HTTPS requis :** Utilisez toujours HTTPS en production pour sécuriser les échanges.

## 📞 Support

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Maxelpay](https://docs.maxelpay.com)
- [Issues GitHub](https://github.com/luxio/backend/issues)

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.