<?php
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
    add_theme_support('editor-styles');
    register_nav_menus([
        'header_menu' => 'Header Menu',
        'footer_menu' => 'Footer Menu',
    ]);
});
