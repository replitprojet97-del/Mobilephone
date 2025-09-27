# Electro - Electronics Website Template

## Overview
This is a Bootstrap-based e-commerce website template called "Electro" for electronics products. It's a static HTML/CSS/JavaScript website with modern responsive design and includes multiple pages for product showcasing, shopping cart, and contact functionality.

## Recent Changes
- **September 27, 2025**: Complete transformation to Luxio e-commerce platform
  - ✅ **Rebranding**: Successfully changed from "Electro" to "Luxio" across all pages
  - ✅ **Multi-language System**: Implemented 5-language support (French, English, Polish, Portuguese, Spanish) with flag indicators
  - ✅ **FNAC Integration**: Created web scraping system to extract smartphone data from Fnac.com
  - ✅ **Advanced Cart**: Developed sophisticated shopping cart with localStorage persistence and price calculations
  - ✅ **JavaScript Architecture**: Built modular system with languages.js, cart.js, smartphones.js
  - ✅ **Dynamic Content**: Added featured smartphones section with placeholder loading states
  - ✅ **Cross-page Integration**: Ensured all functionality works across index, shop, cart, and contact pages

## Project Architecture
- **Type**: Static website template
- **Framework**: Bootstrap 5
- **Server**: Python HTTP server for development
- **Deployment**: Configured for autoscale deployment on Replit
- **Files Structure**:
  - `index.html` - Main homepage
  - `shop.html`, `single.html`, `cart.html`, `checkout.html` - E-commerce pages
  - `contact.html`, `404.html` - Utility pages
  - `css/` - Stylesheets including Bootstrap and custom styles
  - `js/` - JavaScript files
  - `img/` - Product images and assets
  - `lib/` - Third-party libraries (animate, lightbox, owl carousel, etc.)
  - `scss/` - Source SCSS files for Bootstrap

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
- Server runs on port 5000 using Python's built-in HTTP server
- No build process required - pure static files
- All assets are self-contained

## Deployment
- Configured for autoscale deployment (suitable for static sites)
- Uses Python HTTP server in production
- No build step required