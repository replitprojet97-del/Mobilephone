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
        'cart_total': 'Total Panier'
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
        'cart_total': 'Cart Total'
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
        'cart_total': 'Suma Koszyka'
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
        'cart_total': 'Total do Carrinho'
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
        'cart_total': 'Total del Carrito'
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

function createLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown-menu');
    if (dropdown) {
        dropdown.innerHTML = '';
        
        Object.keys(languageConfig).forEach(langCode => {
            const config = languageConfig[langCode];
            const item = document.createElement('a');
            item.href = '#';
            item.className = 'dropdown-item';
            item.innerHTML = `${config.flag} ${config.name}`;
            item.onclick = (e) => {
                e.preventDefault();
                setLanguage(langCode);
            };
            dropdown.appendChild(item);
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    createLanguageDropdown();
});

// Export pour utilisation globale
window.LuxioLang = {
    t,
    setLanguage,
    getCurrentLanguage,
    updatePageContent,
    languageConfig
};