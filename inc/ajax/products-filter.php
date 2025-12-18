<?php
add_action('wp_ajax_filter_products', 'filter_products');
add_action('wp_ajax_nopriv_filter_products', 'filter_products');
function filter_products(){
    $category = sanitize_text_field($_POST['cat'] ?? '');
    $q = new WP_Query(['post_type'=>'product','posts_per_page'=>10]);
    ob_start();
    if ($q->have_posts()):
        while ($q->have_posts()): $q->the_post();
            echo '<div class="product-item">' . get_the_title() . '</div>';
        endwhile;
    else:
        echo '<p>No products found</p>';
    endif;
    wp_reset_postdata();
    wp_send_json_success(ob_get_clean());
}
