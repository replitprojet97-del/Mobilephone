# LUXIO E-commerce Backend

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
