const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

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

// Start server
app.listen(PORT, 'localhost', () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Payment API: http://localhost:${PORT}/api/create-payment`);
});

module.exports = app;