# 🚀 WordPress Starter Theme with Gulp (HTML Mode Included)

A ready-to-use starter theme for WordPress that also supports a static HTML development mode.
Perfect for building fast, modular, and scalable themes.

**Author:** Yurii Vlasenko-Lutskyi – [vlasinfo.com](https://vlasinfo.com/)

This package includes:

- ⚙️ Gulp build pipeline (Sass, JS bundling, HTML includes)

- 🧩 WordPress theme structure (core setup, blocks, CPTs, AJAX)

- 🗂️ src/ folder for development

- 📦 assets/ folder for compiled output (CSS/JS/images/fonts)


## 🔧 Quick Start

1. Install dependencies
 ```shell
   npm i
   ```
2. Start development (WordPress mode)
 ```shell
   npm run dev
   ```
3. Start development (static HTML mode)
 ```shell
   npm run dev:html
   ```

To use as a WordPress theme, place this folder into:
 ```shell
   wp-content/themes/vlasinfo-theme
   ```

## 📝 WordPress Installation Guide

1. Make sure you have a local WordPress setup running (e.g., Local by Flywheel, XAMPP, MAMP).

2. Copy the folder vi-theme to:
   ```shell
   wp-content/themes/
   ```
3. Activate the theme from the WordPress admin panel (Appearance → Themes).

4. Start the Gulp watcher for development:   
   ```shell
   npm run dev
   ```

5. Your assets/ folder will be automatically compiled and updated with changes.   

## 📁 Folder Structure Overview

```
📁 vi-theme/
│
├── 📁 src/                  # Development source files
│   ├── 📁 html/             # Static HTML mode (dev:html)
│   │   ├── partials/
│   │   └── index.html
│   ├── 📁 scss/             # Sass files (base, components, mixins, WooCommerce)
│   ├── 📁 js/               # JS files (modules + main)
│   ├── 📁 img/
│   └── 📁 fonts/
│
├── 📁 assets/               # Compiled output (CSS, JS, images, fonts)
├── 📁 dist/                 # Static HTML build output (HTML mode)
├── 📁 template-parts/       # WordPress template partials
├── functions.php
├── index.php
├── header.php
├── footer.php
├── style.css                # WP theme metadata
├── gulpfile.js
├── package.json
└── .gitignore
```

## ⚙️ How it Works (Gulp Tasks)

| Task               | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `npm run dev`      | Runs Gulp in **WordPress mode**, watches Sass/JS changes, and reloads the browser. |
| `npm run dev:html` | Runs Gulp in **HTML mode**, compiles HTML includes, Sass, JS, and watches changes. |
| `npm run build`    | Compiles and minifies all assets for production.                                   |
| Sass               | Compiles `src/scss/**/*.scss` → `assets/css/`                                      |
| JS                 | Bundles and minifies `src/js/**/*.js` → `assets/js/`                               |
| Images             | Optimizes images from `src/img/` → `assets/img/`                                   |