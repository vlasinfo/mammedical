<?php
add_action('wp_enqueue_scripts', function () {
    $theme_uri = get_template_directory_uri();
    wp_enqueue_style('main-css', $theme_uri . '/assets/css/main.css', [], null);
    wp_enqueue_script('vendors', $theme_uri . '/assets/js/vendors.js', [], null, true);
    wp_enqueue_script('main-js', $theme_uri . '/assets/js/main.js', [], null, true);
    wp_localize_script('main-js', 'ajax_obj', ['ajax_url' => admin_url('admin-ajax.php')]);
});
