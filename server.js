import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static('./', {
    setHeaders: (res, path) => {
        // Disable caching for development
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Payment creation endpoint (adapted from api/create-payment.js)
app.post('/api/create-payment', async (req, res) => {
    // Vérifier que la méthode est POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Méthode non autorisée. Utilisez POST uniquement.' 
        });
    }

    try {
        // Extraire les données du body
        const { amount, currency } = req.body;

        // Validation des paramètres requis
        if (!amount || !currency) {
            return res.status(400).json({ 
                error: 'Paramètres manquants. amount et currency sont requis.' 
            });
        }

        // Validation du montant
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ 
                error: 'Le montant doit être un nombre positif.' 
            });
        }

        // Validation de la devise
        const validCurrencies = ['EUR', 'USD', 'BTC', 'ETH'];
        if (!validCurrencies.includes(currency.toUpperCase())) {
            return res.status(400).json({ 
                error: `Devise non supportée. Devises acceptées: ${validCurrencies.join(', ')}` 
            });
        }

        // Récupérer les clés API depuis les variables d'environnement
        const MAXELPAY_KEY = process.env.MAXELPAY_KEY;
        const MAXELPAY_SECRET = process.env.MAXELPAY_SECRET;

        if (!MAXELPAY_KEY || !MAXELPAY_SECRET) {
            console.error('Variables d\'environnement manquantes:', { 
                hasKey: !!MAXELPAY_KEY, 
                hasSecret: !!MAXELPAY_SECRET 
            });
            return res.status(500).json({ 
                error: 'Configuration serveur manquante. Contactez l\'administrateur.' 
            });
        }

        // Générer un code de référence unique pour ce paiement
        const timestamp = Date.now().toString().slice(-6);
        const randomStr = Math.random().toString(36).substr(2, 6).toUpperCase();
        const referenceCode = `LX-${timestamp}-${randomStr}-CRYPTO`;

        // Préparer les données pour l'API Maxelpay
        const paymentData = {
            amount: numAmount,
            currency: currency.toUpperCase(),
            reference: referenceCode,
            callback_url: `${req.get('Origin') || 'https://luxio.com'}/payment-callback`,
            success_url: `${req.get('Origin') || 'https://luxio.com'}/payment-success`,
            cancel_url: `${req.get('Origin') || 'https://luxio.com'}/payment-cancel`,
            description: `Paiement Luxio - ${referenceCode}`,
            customer_email: req.body.customer_email || '',
            customer_name: req.body.customer_name || ''
        };

        console.log('Données de paiement préparées:', {
            ...paymentData,
            amount: numAmount,
            currency: currency.toUpperCase()
        });

        // Configuration axios pour l'API Maxelpay
        const maxelpayConfig = {
            method: 'POST',
            url: 'https://api.maxelpay.com/v1/payments',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAXELPAY_KEY}`,
                'X-Secret': MAXELPAY_SECRET,
                'User-Agent': 'Luxio-Integration/1.0'
            },
            data: paymentData,
            timeout: 30000
        };

        // Appel à l'API Maxelpay
        const response = await axios(maxelpayConfig);

        console.log('Réponse Maxelpay reçue:', {
            status: response.status,
            hasData: !!response.data
        });

        // Retourner la réponse de succès
        return res.status(200).json({
            success: true,
            payment: response.data,
            reference: referenceCode,
            amount: numAmount,
            currency: currency.toUpperCase(),
            message: 'Paiement créé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la création du paiement:', error);

        // Gestion spécifique des erreurs Maxelpay
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (status === 401) {
                return res.status(500).json({ 
                    error: 'Erreur d\'authentification avec Maxelpay' 
                });
            }

            if (status === 400) {
                return res.status(400).json({ 
                    error: 'Données de paiement invalides',
                    details: errorData?.message || 'Vérifiez les paramètres'
                });
            }

            if (status >= 500) {
                return res.status(502).json({ 
                    error: 'Service Maxelpay temporairement indisponible' 
                });
            }

            return res.status(502).json({ 
                error: 'Erreur API Maxelpay',
                status: status
            });
        }

        // Erreur de réseau
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
            return res.status(502).json({ 
                error: 'Service de paiement temporairement indisponible' 
            });
        }

        // Erreur générique
        return res.status(500).json({ 
            error: 'Erreur Maxelpay',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Order submission endpoint (adapted from api/submit-order.js)
app.post('/api/submit-order', async (req, res) => {
    // Autoriser uniquement les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // Vérification du JSON reçu
        const { ref, customer, items, total, currency } = req.body;

        // Validation des données obligatoires
        if (!ref || !customer || !items || !total || !currency) {
            return res.status(400).json({ 
                error: 'Missing required fields: ref, customer, items, total, currency' 
            });
        }

        if (!customer.name || !customer.email) {
            return res.status(400).json({ 
                error: 'Customer name and email are required' 
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                error: 'Items must be a non-empty array' 
            });
        }

        // Vérification des variables d'environnement
        const { SHOP_EMAIL, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;
        
        if (!SHOP_EMAIL || !MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
            return res.status(500).json({ 
                error: 'Missing email configuration. Check environment variables.' 
            });
        }

        // Configuration du transporteur nodemailer
        const transporter = nodemailer.createTransporter({
            host: MAIL_HOST,
            port: parseInt(MAIL_PORT),
            secure: parseInt(MAIL_PORT) === 465, // true pour 465, false pour les autres ports
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS,
            },
        });

        // Génération du contenu de l'e-mail
        const itemsList = items.map(item => 
            `• ${item.name} - Quantité: ${item.qty} - Prix: ${item.price}€`
        ).join('\n');

        const emailSubject = `Confirmation commande – REF ${ref}`;
        
        const customerEmailContent = `
Cher/Chère ${customer.name},

Merci pour votre commande ! Voici le récapitulatif :

RÉFÉRENCE DE COMMANDE: ${ref}

ARTICLES COMMANDÉS:
${itemsList}

MONTANT TOTAL: ${total} ${currency}

ADRESSE DE LIVRAISON:
${customer.name}
${customer.address}
${customer.zip} ${customer.city}
${customer.country}

Téléphone: ${customer.phone || 'Non renseigné'}

Votre commande sera traitée dans les plus brefs délais.

Cordialement,
L'équipe LUXIO
`;

        const shopEmailContent = `
NOUVELLE COMMANDE REÇUE

RÉFÉRENCE: ${ref}

CLIENT:
Nom: ${customer.name}
Email: ${customer.email}
Téléphone: ${customer.phone || 'Non renseigné'}

ADRESSE:
${customer.address}
${customer.zip} ${customer.city}
${customer.country}

ARTICLES:
${itemsList}

TOTAL: ${total} ${currency}

---
Système automatisé LUXIO
`;

        // Envoi de l'e-mail au client
        await transporter.sendMail({
            from: MAIL_USER,
            to: customer.email,
            subject: emailSubject,
            text: customerEmailContent,
        });

        // Envoi de l'e-mail au propriétaire
        await transporter.sendMail({
            from: MAIL_USER,
            to: SHOP_EMAIL,
            subject: `[LUXIO] ${emailSubject}`,
            text: shopEmailContent,
        });

        // Réponse de succès
        res.status(200).json({ 
            success: true,
            message: 'Order confirmation emails sent successfully',
            ref: ref
        });

    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to process order and send emails',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LUXIO server running on http://0.0.0.0:${PORT}`);
    console.log(`Frontend: http://0.0.0.0:${PORT}`);
    console.log(`Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`Payment API: http://0.0.0.0:${PORT}/api/create-payment`);
});

export default app;