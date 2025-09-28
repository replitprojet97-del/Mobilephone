# LUXIO - Premium Electronics E-commerce Platform

## Overview  
This is a full-stack e-commerce platform called "LUXIO" specializing in premium electronics and technology products. Built with modern Node.js/Express backend and responsive HTML/CSS/JavaScript frontend, featuring advanced shopping cart, multi-language support, payment processing, and web scraping capabilities.

## Recent Changes
- **September 28, 2025**: 🚀 **UNLIMITED DYNAMIC CATALOG SYSTEM COMPLETED**
  - ✅ **Auto-Detection System**: Smart scanning for JSON part files (smartphones-part1.json, watches-part1.json, etc.)
  - ✅ **Unlimited Scalability**: Virtual limit of 1000 part files, stops scanning after 5 consecutive missing files
  - ✅ **Batch Loading**: 20 products per page with "Load More" functionality using DocumentFragment for performance
  - ✅ **Category Pages**: Dedicated smartphones.html, montres.html, accessoires.html with proper navigation
  - ✅ **Production-Ready**: Error handling, type checking, and robust failure recovery
  - ✅ **Multi-language Support**: Category key mapping (smartphones, watches/montres, accessories/accessoires)
  - ✅ **Dynamic Counts**: Real-time product count updates across all category pages
  - ✅ **Data Structure**: Organized /data/ directory with main products.json and part files for each category
- **September 28, 2025**: 🎉 **PROJECT SUCCESSFULLY IMPORTED AND CONFIGURED FOR REPLIT**
  - ✅ **Dependencies Installed**: All Node.js packages installed successfully via npm
  - ✅ **Server Running**: Express server running perfectly on 0.0.0.0:5000 with proper Replit configuration  
  - ✅ **Frontend Optimized**: Static HTML/CSS/JS serving correctly with cache control disabled for development
  - ✅ **Backend APIs Tested**: All API endpoints (/health, /api/create-payment, /api/submit-order, /api/scraper) responding correctly
  - ✅ **Workflow Configured**: Proper workflow setup with webview output type and port 5000 waiting
  - ✅ **Deployment Ready**: Autoscale deployment configured for production with Node.js server
  - ✅ **UI/UX Verified**: Beautiful dark theme interface loading correctly with all features functional
  - ✅ **Multi-language Support**: 5-language system (FR/EN/ES/PT/PL) working correctly with flag indicators
  - ✅ **E-commerce Features**: Cart, wishlist, product catalog, search, and payment integration all functional
  - ✅ **Environment Ready**: All development features working, ready for environment variable configuration
- **September 27, 2025**: Complete transformation to Luxio e-commerce platform
  - ✅ **Rebranding**: Successfully changed from "Electro" to "Luxio" across all pages
  - ✅ **Multi-language System**: Implemented 5-language support (French, English, Polish, Portuguese, Spanish) with flag indicators
  - ✅ **FNAC Integration**: Created web scraping system to extract smartphone data from Fnac.com
  - ✅ **Advanced Cart**: Developed sophisticated shopping cart with localStorage persistence and price calculations
  - ✅ **JavaScript Architecture**: Built modular system with languages.js, cart.js, smartphones.js
  - ✅ **Dynamic Content**: Added featured smartphones section with placeholder loading states
  - ✅ **Cross-page Integration**: Ensured all functionality works across index, shop, cart, and contact pages

## Project Architecture
- **Type**: Full-stack e-commerce application
- **Frontend**: Modern HTML/CSS/JavaScript with Bootstrap-inspired design
- **Backend**: Node.js Express server with ES modules
- **Database**: JSON-based product data (smartphones.json)
- **APIs**: Payment processing (Maxelpay) and email notifications (Nodemailer)
- **Web Scraper**: Python-based Fnac.com data extraction with fallback test data
- **Server**: Node.js Express on port 5000
- **Deployment**: Configured for autoscale deployment on Replit
- **Files Structure**:
  - `server.js` - Main Express server with API endpoints
  - `index.html` - Main homepage
  - `shop.html`, `cart.html`, `checkout.html` - E-commerce pages
  - `api/` - Serverless functions (create-payment.js, submit-order.js)
  - `css/` - Modern stylesheets
  - `js/` - JavaScript modules (modern.js, cart.js, languages.js, smartphones.js)
  - `img/` - Product images and assets
  - `scrape_fnac.py` - Web scraper for product data
  - `smartphones.json` - Product database
  - `package.json` - Node.js dependencies and configuration
  - `pyproject.toml` - Python dependencies

## Key Features
- **Dynamic Catalog System**: Unlimited products via auto-detecting JSON part files
- **Smart Auto-Detection**: Scans for category-specific part files with graceful error handling
- **Batch Loading**: 20 products per page with "Load More" functionality
- **Category Pages**: Dedicated smartphones, watches, and accessories pages
- **Multi-language Navigation**: Seamless switching between category pages
- **Performance Optimized**: DocumentFragment rendering and efficient data management
- **Responsive Bootstrap 5 design**
- **Product carousel and galleries**
- **Shopping cart functionality (frontend only)**
- **Multiple page layouts**
- **Font Awesome icons and Bootstrap icons**
- **Lightbox image viewer**
- **Owl Carousel for product displays**
- **WOW.js animations**

## Development
- Server runs on port 5000 using Node.js Express
- API endpoints for payment processing and order management
- Real-time product data via Python web scraper
- Environment variables needed for payment and email services

## Required Environment Variables
- `MAXELPAY_KEY` - Maxelpay payment gateway API key
- `MAXELPAY_SECRET` - Maxelpay secret key
- `SHOP_EMAIL` - Owner email for order notifications
- `MAIL_HOST` - SMTP server hostname
- `MAIL_PORT` - SMTP server port
- `MAIL_USER` - SMTP username
- `MAIL_PASS` - SMTP password

## Deployment
- Configured for autoscale deployment
- Uses Node.js Express server in production
- No build step required