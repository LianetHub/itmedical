<?php
define('COMPONENTS_PATH', dirname(__FILE__) . '/components/');
define('FUNC_PATH', dirname(__FILE__) . '/functionality/');
define('TEMPLATE_PATH', dirname(__FILE__) . '/components/templates-parts/');
define('JS_PATH', get_stylesheet_directory_uri() . '/assets/js');
define('STYLES_PATH', get_stylesheet_directory_uri() . '/assets/styles');
define('FONTS_PATH', get_stylesheet_directory_uri() . '/assets/fonts');
define('IMG_PATH', get_stylesheet_directory_uri() . '/assets/images');



require_once(COMPONENTS_PATH . 'nav.php');
require_once(COMPONENTS_PATH . 'breadcrumbs.php');
require_once(FUNC_PATH . 'carbon-fields.php');
require_once(FUNC_PATH . 'services-taxonomy.php');
require_once(FUNC_PATH . 'solutions-taxonomy.php');
require_once(FUNC_PATH . 'allow_svg.php');
require_once(FUNC_PATH . 'allow_ico.php');




if (!defined('_S_VERSION')) {
    define('_S_VERSION', '0.0.13');
}



add_action('wp_enqueue_scripts', 'r4_themeitmedical_scripts_style');
function r4_themeitmedical_scripts_style()
{
    wp_enqueue_style('theme-reser-style', STYLES_PATH . '/reset.min.css', array(), _S_VERSION);
    // wp_enqueue_script('app-js', JS_PATH . '/app.min.js', array(), _S_VERSION);
    wp_enqueue_script('app-js', JS_PATH . '/app.min.js', array(), rand());
    wp_enqueue_style('fancybox-css', STYLES_PATH . '/libs/fancybox.css', array(), _S_VERSION);
    // wp_enqueue_script('formsubmit-js', JS_PATH . '/formsubmit.js', array(), _S_VERSION);
    wp_enqueue_script('formsubmit-js', JS_PATH . '/formsubmit.js', array(), rand());
    wp_enqueue_script('fancybox-js', JS_PATH . '/libs/fancybox.umd.js', array(), _S_VERSION);
    wp_enqueue_script('swiper-bundle-js', JS_PATH . '/libs/swiper-bundle.min.js', array(), _S_VERSION);
    wp_enqueue_style('swiper-bundle-css', STYLES_PATH . '/libs/swiper-bundle.min.css', array(), _S_VERSION);
    wp_enqueue_script('vanillajs-datepicker-js', JS_PATH . '/libs/vanillajs-datepicker.min.js', array(), _S_VERSION);
    wp_enqueue_style('theme-main-style', STYLES_PATH . '/style.css', array(), rand());
    // wp_enqueue_style('theme-main-style', STYLES_PATH . '/style.css', array(), _S_VERSION);
}

add_filter('wpcf7_autop_or_not', '__return_false');
add_theme_support('post-thumbnails');
add_filter('big_image_size_threshold', '__return_zero');
