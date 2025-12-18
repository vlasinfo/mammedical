<?php
add_action('init', function () {
    register_post_type('product', [
        'label' => 'Products',
        'public' => true,
        'menu_icon' => 'dashicons-products',
        'supports' => ['title','editor','thumbnail','excerpt'],
        'rewrite' => ['slug' => 'products']
    ]);
});
