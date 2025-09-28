import FnacSmartphoneScraper from '../scripts/fnac-scraper.js';

export default async function handler(req, res) {
    // Configurer CORS pour permettre les appels depuis le frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🚀 Lancement du scraping via l\'API...');
        
        const scraper = new FnacSmartphoneScraper();
        
        // Configuration optimisée pour l'API (serverless)
        const apiOptions = {
          maxItems: 8,  // Limite basse pour éviter les timeouts
          delay: 0,     // Pas de délai pour l'API
          fastMode: true // Mode rapide pour serverless
        };
        
        const smartphones = await scraper.getSmartphones(3, apiOptions);
        
        if (smartphones && smartphones.length > 0) {
            console.log(`✅ Scraping API réussi: ${smartphones.length} smartphones trouvés`);
            
            res.status(200).json({ 
                success: true,
                products: smartphones,
                total: smartphones.length,
                source: smartphones[0]?.source === 'Test Data' ? 'test_data' : 'scraped',
                message: `${smartphones.length} smartphones extraits avec succès`
            });
        } else {
            console.log('❌ Aucun smartphone trouvé');
            res.status(200).json({ 
                success: false,
                products: [],
                total: 0,
                source: 'empty',
                message: 'Aucun smartphone trouvé'
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur dans l\'API scraper:', error.message);
        
        // En cas d'erreur, utiliser le scraper pour obtenir les données de test
        try {
            const scraper = new FnacSmartphoneScraper();
            const testData = scraper.createTestData();
            
            res.status(200).json({ 
                success: false,
                products: testData,
                total: testData.length,
                source: 'test_data',
                error: error.message,
                message: 'Erreur lors du scraping, données de test retournées'
            });
        } catch (fallbackError) {
            res.status(500).json({ 
                success: false,
                error: error.message,
                fallback_error: fallbackError.message,
                message: 'Erreur critique dans l\'API de scraping'
            });
        }
    }
}