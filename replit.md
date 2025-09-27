# Electro - Electronics Website Template

## Overview
This is a Bootstrap-based e-commerce website template called "Electro" for electronics products. It's a static HTML/CSS/JavaScript website with modern responsive design and includes multiple pages for product showcasing, shopping cart, and contact functionality.

## Recent Changes
- **September 27, 2025**: Initial setup and import from GitHub
  - Moved all files from subdirectory to root for cleaner structure
  - Set up Python HTTP server to serve static files
  - Configured workflow for frontend server on port 5000
  - Configured deployment settings for autoscale deployment
  - Verified website functionality with screenshot

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