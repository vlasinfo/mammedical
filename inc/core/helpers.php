<?php
// Simple helper example
function theme_asset($path) {
    return get_template_directory_uri() . '/' . ltrim($path, '/');
}
