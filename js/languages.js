// Système multi-langue pour Luxio
const translations = {
    fr: {
        // Navigation et interface
        'help': 'Aide',
        'support': 'Support',
        'contact': 'Contact',
        'call_us': 'Appelez-nous:',
        'my_dashboard': 'Mon Tableau de Bord',
        'login': 'Connexion',
        'wishlist': 'Liste de Souhaits',
        'my_cart': 'Mon Panier',
        'notifications': 'Notifications',
        'account_settings': 'Paramètres du Compte',
        'my_account': 'Mon Compte',
        'logout': 'Déconnexion',
        'search_placeholder': 'Que cherchez-vous?',
        'all_category': 'Toutes Catégories',
        'home': 'Accueil',
        'shop': 'Boutique',
        'single_page': 'Page Produit',
        'pages': 'Pages',
        'smartphones': 'Smartphones',
        'electronics': 'Électronique',
        'currency': 'EUR',
        'language': 'Français',
        'add_to_cart': 'Ajouter au Panier',
        'buy_now': 'Acheter Maintenant',
        'price': 'Prix',
        'brand': 'Marque',
        'model': 'Modèle',
        'storage': 'Stockage',
        'view_details': 'Voir Détails',
        'cart_total': 'Total Panier',
        'watches': 'Montres',
        'fashion': 'Mode',
        'discover': 'Découvrir',
        'view_collections': 'Voir Collections',
        'satisfied_customers': 'Clients Satisfaits',
        'positive_reviews': 'Avis Positifs',
        'express_delivery': 'Livraison Express',
        'popular_products': 'Produits Populaires',
        'all': 'Tous',
        'accessories': 'Accessoires',
        'new_arrivals': 'Nouveautés',
        'load_more': 'Voir Plus de Produits',
        'discover_excellence': 'Découvrez l\'Excellence',
        'home_living': 'Maison',
        'mobility': 'Mobilité',
        'services': 'Services',
        'more': '+ Plus',
        'free_delivery': 'Livraison Gratuite',
        'premium_warranty': 'Garantie Premium',
        'up_to_discount': 'Jusqu\'à -40%',
        'premium_collection_2025': 'COLLECTION PREMIUM 2025',
        'hero_description': 'Technologie de pointe, design raffiné, expérience exceptionnelle. Découvrez notre sélection exclusive de produits haut de gamme.',
        'delivery_24h': 'Livraison 24h',
        'warranty_2_years': 'Garantie 2 ans',
        'rating_4_9': 'Note 4.9/5',
        'explore_by_category': 'Explorer par Catégorie',
        'latest_tech': 'Dernières technologies',
        'connected_classic': 'Connectées & classiques',
        'premium_sound': 'Son premium',
        'innovation_design': 'Innovation & design',
        '120_products': '120+ produits',
        '80_products': '80+ produits',
        '150_products': '150+ produits',
        '200_products': '200+ produits',
        'audio': 'Audio',
        'tech': 'Tech',
        'stay_connected': 'Restez connecté avec LUXIO',
        'newsletter_description': 'Découvrez en avant-première nos nouveautés et offres exclusives',
        'email_placeholder': 'Votre adresse email',
        'subscribe': 'S\'abonner',
        'product_iphone_15': 'iPhone 15 Pro Max',
        // Footer
        'footer_brand_description': 'Innovation et excellence depuis 2020',
        'footer_products': 'Produits',
        'footer_support': 'Support',
        'footer_company': 'Entreprise',
        'footer_help_center': 'Centre d\'aide',
        'footer_warranty': 'Garantie',
        'footer_returns': 'Retours',
        'footer_about': 'À propos',
        'footer_careers': 'Carrières',
        'footer_press': 'Presse',
        'footer_partners': 'Partenaires',
        'footer_copyright': '© 2025 LUXIO. Tous droits réservés.',
        'footer_terms': 'Conditions',
        'footer_privacy': 'Confidentialité',
        'footer_cookies': 'Cookies'
    },
    en: {
        // Navigation and interface
        'help': 'Help',
        'support': 'Support',
        'contact': 'Contact',
        'call_us': 'Call Us:',
        'my_dashboard': 'My Dashboard',
        'login': 'Login',
        'wishlist': 'Wishlist',
        'my_cart': 'My Cart',
        'notifications': 'Notifications',
        'account_settings': 'Account Settings',
        'my_account': 'My Account',
        'logout': 'Log Out',
        'search_placeholder': 'Search Looking For?',
        'all_category': 'All Category',
        'home': 'Home',
        'shop': 'Shop',
        'single_page': 'Single Page',
        'pages': 'Pages',
        'smartphones': 'Smartphones',
        'electronics': 'Electronics',
        'currency': 'USD',
        'language': 'English',
        'add_to_cart': 'Add to Cart',
        'buy_now': 'Buy Now',
        'price': 'Price',
        'brand': 'Brand',
        'model': 'Model',
        'storage': 'Storage',
        'view_details': 'View Details',
        'cart_total': 'Cart Total',
        'watches': 'Watches',
        'fashion': 'Fashion',
        'discover': 'Discover',
        'view_collections': 'View Collections',
        'satisfied_customers': 'Satisfied Customers',
        'positive_reviews': 'Positive Reviews',
        'express_delivery': 'Express Delivery',
        'popular_products': 'Popular Products',
        'all': 'All',
        'accessories': 'Accessories',
        'new_arrivals': 'New Arrivals',
        'load_more': 'Load More Products',
        'discover_excellence': 'Discover Excellence',
        'home_living': 'Home & Living',
        'mobility': 'Mobility',
        'services': 'Services',
        'more': '+ More',
        'free_delivery': 'Free Delivery',
        'premium_warranty': 'Premium Warranty',
        'up_to_discount': 'Up to -40%',
        'premium_collection_2025': 'PREMIUM COLLECTION 2025',
        'hero_description': 'Cutting-edge technology, refined design, exceptional experience. Discover our exclusive selection of premium products.',
        'delivery_24h': '24h Delivery',
        'warranty_2_years': '2-Year Warranty',
        'rating_4_9': 'Rating 4.9/5',
        'explore_by_category': 'Explore by Category',
        'latest_tech': 'Latest Technologies',
        'connected_classic': 'Smart & Classic',
        'premium_sound': 'Premium Sound',
        'innovation_design': 'Innovation & Design',
        '120_products': '120+ products',
        '80_products': '80+ products',
        '150_products': '150+ products',
        '200_products': '200+ products',
        'audio': 'Audio',
        'tech': 'Tech',
        'stay_connected': 'Stay Connected with LUXIO',
        'newsletter_description': 'Discover our latest products and exclusive offers first',
        'email_placeholder': 'Your email address',
        'subscribe': 'Subscribe',
        'product_iphone_15': 'iPhone 15 Pro Max',
        // Footer
        'footer_brand_description': 'Innovation and excellence since 2020',
        'footer_products': 'Products',
        'footer_support': 'Support',
        'footer_company': 'Company',
        'footer_help_center': 'Help Center',
        'footer_warranty': 'Warranty',
        'footer_returns': 'Returns',
        'footer_about': 'About',
        'footer_careers': 'Careers',
        'footer_press': 'Press',
        'footer_partners': 'Partners',
        'footer_copyright': '© 2025 LUXIO. All rights reserved.',
        'footer_terms': 'Terms',
        'footer_privacy': 'Privacy',
        'footer_cookies': 'Cookies'
    },
    pl: {
        // Nawigacja i interfejs
        'help': 'Pomoc',
        'support': 'Wsparcie',
        'contact': 'Kontakt',
        'call_us': 'Zadzwoń do nas:',
        'my_dashboard': 'Mój Panel',
        'login': 'Zaloguj się',
        'wishlist': 'Lista Życzeń',
        'my_cart': 'Mój Koszyk',
        'notifications': 'Powiadomienia',
        'account_settings': 'Ustawienia Konta',
        'my_account': 'Moje Konto',
        'logout': 'Wyloguj się',
        'search_placeholder': 'Czego szukasz?',
        'all_category': 'Wszystkie Kategorie',
        'home': 'Strona Główna',
        'shop': 'Sklep',
        'single_page': 'Strona Produktu',
        'pages': 'Strony',
        'smartphones': 'Smartfony',
        'electronics': 'Elektronika',
        'currency': 'PLN',
        'language': 'Polski',
        'add_to_cart': 'Dodaj do Koszyka',
        'buy_now': 'Kup Teraz',
        'price': 'Cena',
        'brand': 'Marka',
        'model': 'Model',
        'storage': 'Pamięć',
        'view_details': 'Zobacz Szczegóły',
        'cart_total': 'Suma Koszyka',
        'watches': 'Zegarki',
        'fashion': 'Moda',
        'discover': 'Odkryj',
        'view_collections': 'Zobacz Kolekcje',
        'satisfied_customers': 'Zadowoleni Klienci',
        'positive_reviews': 'Pozytywne Opinie',
        'express_delivery': 'Dostawa Ekspresowa',
        'popular_products': 'Popularne Produkty',
        'all': 'Wszystkie',
        'accessories': 'Akcesoria',
        'new_arrivals': 'Nowości',
        'load_more': 'Zobacz Więcej Produktów',
        'discover_excellence': 'Odkryj Doskonałość',
        'home_living': 'Dom i Mieszkanie',
        'mobility': 'Mobilność',
        'services': 'Usługi',
        'more': '+ Więcej',
        'free_delivery': 'Darmowa Dostawa',
        'premium_warranty': 'Gwarancja Premium',
        'up_to_discount': 'Do -40%',
        'premium_collection_2025': 'KOLEKCJA PREMIUM 2025',
        'hero_description': 'Najnowsza technologia, wyrafinowany design, wyjątkowe doświadczenie. Odkryj naszą ekskluzywną selekcję produktów premium.',
        'delivery_24h': 'Dostawa 24h',
        'warranty_2_years': 'Gwarancja 2 lata',
        'rating_4_9': 'Ocena 4.9/5',
        'explore_by_category': 'Przeglądaj według Kategorii',
        'latest_tech': 'Najnowsze Technologie',
        'connected_classic': 'Inteligentne i Klasyczne',
        'premium_sound': 'Dźwięk Premium',
        'innovation_design': 'Innowacja i Design',
        '120_products': '120+ produktów',
        '80_products': '80+ produktów',
        '150_products': '150+ produktów',
        '200_products': '200+ produktów',
        'audio': 'Audio',
        'tech': 'Technologie',
        'stay_connected': 'Pozostań w kontakcie z LUXIO',
        'newsletter_description': 'Odkryj nasze najnowsze produkty i ekskluzywne oferty jako pierwszy',
        'email_placeholder': 'Twój adres email',
        'subscribe': 'Subskrybuj',
        'product_iphone_15': 'iPhone 15 Pro Max',
        // Footer
        'footer_brand_description': 'Innowacja i doskonałość od 2020',
        'footer_products': 'Produkty',
        'footer_support': 'Wsparcie',
        'footer_company': 'Firma',
        'footer_help_center': 'Centrum Pomocy',
        'footer_warranty': 'Gwarancja',
        'footer_returns': 'Zwroty',
        'footer_about': 'O nas',
        'footer_careers': 'Kariera',
        'footer_press': 'Prasa',
        'footer_partners': 'Partnerzy',
        'footer_copyright': '© 2025 LUXIO. Wszystkie prawa zastrzeżone.',
        'footer_terms': 'Warunki',
        'footer_privacy': 'Prywatność',
        'footer_cookies': 'Ciasteczka'
    },
    pt: {
        // Navegação e interface
        'help': 'Ajuda',
        'support': 'Suporte',
        'contact': 'Contato',
        'call_us': 'Ligue para nós:',
        'my_dashboard': 'Meu Painel',
        'login': 'Entrar',
        'wishlist': 'Lista de Desejos',
        'my_cart': 'Meu Carrinho',
        'notifications': 'Notificações',
        'account_settings': 'Configurações da Conta',
        'my_account': 'Minha Conta',
        'logout': 'Sair',
        'search_placeholder': 'O que você está procurando?',
        'all_category': 'Todas Categorias',
        'home': 'Início',
        'shop': 'Loja',
        'single_page': 'Página do Produto',
        'pages': 'Páginas',
        'smartphones': 'Smartphones',
        'electronics': 'Eletrônicos',
        'currency': 'BRL',
        'language': 'Português',
        'add_to_cart': 'Adicionar ao Carrinho',
        'buy_now': 'Comprar Agora',
        'price': 'Preço',
        'brand': 'Marca',
        'model': 'Modelo',
        'storage': 'Armazenamento',
        'view_details': 'Ver Detalhes',
        'cart_total': 'Total do Carrinho',
        'watches': 'Relógios',
        'fashion': 'Moda',
        'discover': 'Descobrir',
        'view_collections': 'Ver Coleções',
        'satisfied_customers': 'Clientes Satisfeitos',
        'positive_reviews': 'Avaliações Positivas',
        'express_delivery': 'Entrega Expressa',
        'popular_products': 'Produtos Populares',
        'all': 'Todos',
        'accessories': 'Acessórios',
        'new_arrivals': 'Novidades',
        'load_more': 'Ver Mais Produtos',
        'discover_excellence': 'Descubra a Excelência',
        'home_living': 'Casa e Habitação',
        'mobility': 'Mobilidade',
        'services': 'Serviços',
        'more': '+ Mais',
        'free_delivery': 'Entrega Grátis',
        'premium_warranty': 'Garantia Premium',
        'up_to_discount': 'Até -40%',
        'premium_collection_2025': 'COLEÇÃO PREMIUM 2025',
        'hero_description': 'Tecnologia de ponta, design refinado, experiência excepcional. Descubra nossa seleção exclusiva de produtos premium.',
        'delivery_24h': 'Entrega 24h',
        'warranty_2_years': 'Garantia 2 anos',
        'rating_4_9': 'Avaliação 4.9/5',
        'explore_by_category': 'Explorar por Categoria',
        'latest_tech': 'Tecnologias Mais Recentes',
        'connected_classic': 'Conectados e Clássicos',
        'premium_sound': 'Som Premium',
        'innovation_design': 'Inovação e Design',
        '120_products': '120+ produtos',
        '80_products': '80+ produtos',
        '150_products': '150+ produtos',
        '200_products': '200+ produtos',
        'audio': 'Áudio',
        'tech': 'Tecnologia',
        'stay_connected': 'Fique Conectado com LUXIO',
        'newsletter_description': 'Descubra nossos produtos mais recentes e ofertas exclusivas primeiro',
        'email_placeholder': 'Seu endereço de email',
        'subscribe': 'Inscrever-se',
        'product_iphone_15': 'iPhone 15 Pro Max',
        // Footer
        'footer_brand_description': 'Inovação e excelência desde 2020',
        'footer_products': 'Produtos',
        'footer_support': 'Suporte',
        'footer_company': 'Empresa',
        'footer_help_center': 'Centro de Ajuda',
        'footer_warranty': 'Garantia',
        'footer_returns': 'Devoluções',
        'footer_about': 'Sobre',
        'footer_careers': 'Carreiras',
        'footer_press': 'Imprensa',
        'footer_partners': 'Parceiros',
        'footer_copyright': '© 2025 LUXIO. Todos os direitos reservados.',
        'footer_terms': 'Termos',
        'footer_privacy': 'Privacidade',
        'footer_cookies': 'Cookies'
    },
    es: {
        // Navegación e interfaz
        'help': 'Ayuda',
        'support': 'Soporte',
        'contact': 'Contacto',
        'call_us': 'Llámanos:',
        'my_dashboard': 'Mi Panel',
        'login': 'Iniciar Sesión',
        'wishlist': 'Lista de Deseos',
        'my_cart': 'Mi Carrito',
        'notifications': 'Notificaciones',
        'account_settings': 'Configuración de Cuenta',
        'my_account': 'Mi Cuenta',
        'logout': 'Cerrar Sesión',
        'search_placeholder': '¿Qué estás buscando?',
        'all_category': 'Todas las Categorías',
        'home': 'Inicio',
        'shop': 'Tienda',
        'single_page': 'Página del Producto',
        'pages': 'Páginas',
        'smartphones': 'Smartphones',
        'electronics': 'Electrónicos',
        'currency': 'EUR',
        'language': 'Español',
        'add_to_cart': 'Añadir al Carrito',
        'buy_now': 'Comprar Ahora',
        'price': 'Precio',
        'brand': 'Marca',
        'model': 'Modelo',
        'storage': 'Almacenamiento',
        'view_details': 'Ver Detalles',
        'cart_total': 'Total del Carrito',
        'watches': 'Relojes',
        'fashion': 'Moda',
        'discover': 'Descubrir',
        'view_collections': 'Ver Colecciones',
        'satisfied_customers': 'Clientes Satisfechos',
        'positive_reviews': 'Reseñas Positivas',
        'express_delivery': 'Entrega Exprés',
        'popular_products': 'Productos Populares',
        'all': 'Todos',
        'accessories': 'Accesorios',
        'new_arrivals': 'Novedades',
        'load_more': 'Ver Más Productos',
        'discover_excellence': 'Descubre la Excelencia',
        'home_living': 'Hogar y Vida',
        'mobility': 'Movilidad',
        'services': 'Servicios',
        'more': '+ Más',
        'free_delivery': 'Entrega Gratuita',
        'premium_warranty': 'Garantía Premium',
        'up_to_discount': 'Hasta -40%',
        'premium_collection_2025': 'COLECCIÓN PREMIUM 2025',
        'hero_description': 'Tecnología de vanguardia, diseño refinado, experiencia excepcional. Descubre nuestra selección exclusiva de productos premium.',
        'delivery_24h': 'Entrega 24h',
        'warranty_2_years': 'Garantía 2 años',
        'rating_4_9': 'Puntuación 4.9/5',
        'explore_by_category': 'Explorar por Categoría',
        'latest_tech': 'Tecnologías Más Recientes',
        'connected_classic': 'Conectados y Clásicos',
        'premium_sound': 'Sonido Premium',
        'innovation_design': 'Innovación y Diseño',
        '120_products': '120+ productos',
        '80_products': '80+ productos',
        '150_products': '150+ productos',
        '200_products': '200+ productos',
        'audio': 'Audio',
        'tech': 'Tecnología',
        'stay_connected': 'Mantente Conectado con LUXIO',
        'newsletter_description': 'Descubre nuestros productos más recientes y ofertas exclusivas primero',
        'email_placeholder': 'Tu dirección de email',
        'subscribe': 'Suscribirse',
        'product_iphone_15': 'iPhone 15 Pro Max',
        // Footer
        'footer_brand_description': 'Innovación y excelencia desde 2020',
        'footer_products': 'Productos',
        'footer_support': 'Soporte',
        'footer_company': 'Empresa',
        'footer_help_center': 'Centro de Ayuda',
        'footer_warranty': 'Garantía',
        'footer_returns': 'Devoluciones',
        'footer_about': 'Acerca de',
        'footer_careers': 'Carreras',
        'footer_press': 'Prensa',
        'footer_partners': 'Socios',
        'footer_copyright': '© 2025 LUXIO. Todos los derechos reservados.',
        'footer_terms': 'Términos',
        'footer_privacy': 'Privacidad',
        'footer_cookies': 'Cookies'
    }
};

// Configuration des drapeaux et langues
const languageConfig = {
    fr: {
        name: 'Français',
        flag: '🇫🇷',
        currency: 'EUR',
        code: 'fr'
    },
    en: {
        name: 'English',
        flag: '🇺🇸',
        currency: 'USD',
        code: 'en'
    },
    pl: {
        name: 'Polski',
        flag: '🇵🇱',
        currency: 'PLN',
        code: 'pl'
    },
    pt: {
        name: 'Português',
        flag: '🇵🇹',
        currency: 'BRL',
        code: 'pt'
    },
    es: {
        name: 'Español',
        flag: '🇪🇸',
        currency: 'EUR',
        code: 'es'
    }
};

// Langue par défaut
let currentLanguage = 'fr';

// Fonctions de traduction
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function setLanguage(langCode) {
    if (languageConfig[langCode]) {
        currentLanguage = langCode;
        localStorage.setItem('luxio_language', langCode);
        updatePageContent();
        updateCurrency();
    }
}

function getCurrentLanguage() {
    return currentLanguage;
}

function initLanguage() {
    // Récupérer la langue sauvegardée ou utiliser le français par défaut
    const savedLang = localStorage.getItem('luxio_language') || 'fr';
    setLanguage(savedLang);
}

function updatePageContent() {
    // Mettre à jour tous les éléments avec des attributs data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Mettre à jour le sélecteur de langue actuel
    updateLanguageSelector();
}

function updateLanguageSelector() {
    const currentLangElement = document.querySelector('.current-language');
    if (currentLangElement) {
        const config = languageConfig[currentLanguage];
        currentLangElement.innerHTML = `${config.flag} ${config.name}`;
    }
}

function updateCurrency() {
    const currencyElements = document.querySelectorAll('.currency-display');
    const config = languageConfig[currentLanguage];
    
    currencyElements.forEach(element => {
        element.textContent = config.currency;
    });
}

function initLanguageEvents() {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown) {
        // Ajouter des événements aux liens existants avec data-lang
        dropdown.querySelectorAll('a[data-lang]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const langCode = link.getAttribute('data-lang');
                setLanguage(langCode);
            });
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    initLanguageEvents();
});

// Export pour utilisation globale
window.LuxioLang = {
    t,
    setLanguage,
    getCurrentLanguage,
    updatePageContent,
    languageConfig
};