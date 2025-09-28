import nodemailer from 'nodemailer';

export default async function handler(req, res) {
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
}