# Electro - Electronics Website Template

## Overview
This is a Bootstrap-based e-commerce website template called "Electro" for electronics products. It's a static HTML/CSS/JavaScript website with modern responsive design and includes multiple pages for product showcasing, shopping cart, and contact functionality.

## Recent Changes
- **September 28, 2025**: ✅ **PROJECT SUCCESSFULLY IMPORTED TO REPLIT**
  - ✅ **Dependencies Installed**: All Node.js and Python packages successfully installed
  - ✅ **Server Running**: Express server running perfectly on 0.0.0.0:5000 with proper Replit configuration  
  - ✅ **Frontend Optimized**: Static HTML/CSS/JS serving correctly with cache control disabled for development
  - ✅ **Backend APIs Tested**: All API endpoints (/health, /api/create-payment, /api/submit-order, /api/scraper) responding correctly
  - ✅ **Workflow Configured**: Proper workflow setup with webview output type and port 5000 waiting
  - ✅ **Deployment Ready**: Autoscale deployment configured for production with Node.js server
  - ✅ **Admin Interface**: Password-protected admin panel accessible at /admin/upload.html
  - ✅ **Multi-language Support**: 5-language system (FR/EN/ES/PT/PL) working correctly
  - ✅ **E-commerce Features**: Cart, wishlist, product catalog, and payment integration all functional
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
- Responsive Bootstrap 5 design
- Product carousel and galleries
- Shopping cart functionality (frontend only)
- Multiple page layouts
- Font Awesome icons and Bootstrap icons
- Lightbox image viewer
- Owl Carousel for product displays
- WOW.js animations

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