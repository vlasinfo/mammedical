<?php
// Autoload core theme files
foreach (glob(get_template_directory() . '/inc/core/*.php') as $file) {
    require_once $file;
}
foreach (glob(get_template_directory() . '/inc/post-types/*.php') as $file) {
    require_once $file;
}
foreach (glob(get_template_directory() . '/inc/taxonomies/*.php') as $file) {
    require_once $file;
}
foreach (glob(get_template_directory() . '/inc/ajax/*.php') as $file) {
    require_once $file;
}
// Register blocks (simple)
if (function_exists('register_block_type')) {
    foreach (glob(get_template_directory() . '/inc/blocks/*/block.json') as $block) {
        register_block_type(dirname($block));
    }
}
