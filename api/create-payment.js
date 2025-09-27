import axios from 'axios';

export default async function handler(req, res) {
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
            callback_url: `${req.headers.origin || 'https://luxio.com'}/payment-callback`,
            success_url: `${req.headers.origin || 'https://luxio.com'}/payment-success`,
            cancel_url: `${req.headers.origin || 'https://luxio.com'}/payment-cancel`,
            metadata: {
                source: 'luxio-website',
                reference: referenceCode,
                timestamp: new Date().toISOString(),
                user_agent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }
        };

        console.log('Tentative de création de paiement Maxelpay:', {
            amount: paymentData.amount,
            currency: paymentData.currency,
            timestamp: new Date().toISOString()
        });

        // Appel vers l'API Maxelpay
        const maxelpayResponse = await axios.post(
            'https://api.maxelpay.com/v1/payment',
            paymentData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MAXELPAY_KEY}`,
                    'X-API-Secret': MAXELPAY_SECRET,
                    'Accept': 'application/json',
                    'User-Agent': 'Luxio-Backend/1.0'
                },
                timeout: 30000 // 30 secondes de timeout
            }
        );

        // Vérifier la réponse de Maxelpay
        if (!maxelpayResponse.data || !maxelpayResponse.data.paymentUrl) {
            console.error('Réponse Maxelpay invalide:', maxelpayResponse.data);
            throw new Error('Réponse API invalide');
        }

        console.log('Paiement Maxelpay créé avec succès:', {
            paymentId: maxelpayResponse.data.id,
            paymentUrl: maxelpayResponse.data.paymentUrl
        });

        // Retourner l'URL de paiement avec le code de référence
        return res.status(200).json({
            success: true,
            paymentUrl: maxelpayResponse.data.paymentUrl,
            paymentId: maxelpayResponse.data.id,
            referenceCode: referenceCode,
            expiresAt: maxelpayResponse.data.expiresAt || null,
            message: 'Lien de paiement généré avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la création du paiement:', error);

        // Gestion des erreurs spécifiques
        if (error.response) {
            // Erreur de l'API Maxelpay
            console.error('Erreur API Maxelpay:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });

            // Retourner une erreur plus spécifique selon le code de statut
            if (error.response.status === 401) {
                return res.status(500).json({ 
                    error: 'Erreur d\'authentification avec le service de paiement.' 
                });
            } else if (error.response.status === 400) {
                return res.status(400).json({ 
                    error: 'Données de paiement invalides.' 
                });
            } else if (error.response.status === 429) {
                return res.status(429).json({ 
                    error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' 
                });
            }
        } else if (error.request) {
            // Erreur réseau
            console.error('Erreur réseau:', error.request);
            return res.status(503).json({ 
                error: 'Service de paiement temporairement indisponible. Veuillez réessayer.' 
            });
        }

        // Erreur générique
        return res.status(500).json({ 
            error: 'Erreur Maxelpay',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Configuration pour Vercel
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};