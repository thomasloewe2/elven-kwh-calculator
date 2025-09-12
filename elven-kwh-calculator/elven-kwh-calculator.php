<?php
/**
 * Plugin Name: Elven kWh calculator
 * Description: Universal kWh-beregner med shortcode [elven_kwh_calc]. Ingen data gemmes. Understøtter flere instanser pr. side.
 * Version: 1.0.0
 * Author: Thomas Løwe Hansen
 * License: GPL-2.0-or-later
 * Text Domain: elven-kwh-calculator
 */

if (!defined('ABSPATH')) { exit; }

define('ELVEN_KWH_CALC_VERSION', '1.0.0');
define('ELVEN_KWH_CALC_URL', plugins_url('', __FILE__));
define('ELVEN_KWH_CALC_PATH', plugin_dir_path(__FILE__));

// Shortcode output (container that JS will hydrate)
add_shortcode('elven_kwh_calc', function($atts){
    $atts = shortcode_atts([
        'price' => '', // optional default price (kr/kWh), e.g. "2,50"
        'watt'  => '', // optional default watt, e.g. "2000"
    ], $atts, 'elven_kwh_calc');

    // Unique ID per instance
    static $i = 0; $i++;
    $id = 'elven-kwh-calculator-' . $i;

    ob_start(); ?>
    <div id="<?php echo esc_attr($id); ?>"
         class="elven-kwh-calculator"
         data-default-price="<?php echo esc_attr($atts['price']); ?>"
         data-default-watt="<?php echo esc_attr($atts['watt']); ?>"></div>
    <?php
    return ob_get_clean();
});

// Enqueue assets only on pages where shortcode is present
add_action('wp_enqueue_scripts', function(){
    if (!is_singular()) return;
    global $post;
    if (!($post instanceof WP_Post)) return;
    if (has_shortcode($post->post_content, 'elven_kwh_calc')) {
        wp_register_style('elven-kwh-css', ELVEN_KWH_CALC_URL . '/elven-kwh.css', [], ELVEN_KWH_CALC_VERSION);
        wp_enqueue_style('elven-kwh-css');

        wp_register_script('elven-kwh-js', ELVEN_KWH_CALC_URL . '/elven-kwh.js', [], ELVEN_KWH_CALC_VERSION, true);
        wp_enqueue_script('elven-kwh-js');
    }
});

// Add defer attribute to our script for better performance
add_filter('script_loader_tag', function($tag, $handle, $src){
    if ($handle === 'elven-kwh-js') {
        // Ensure 'defer' is present and keep type= if any.
        $tag = str_replace(' src=', ' defer src=', $tag);
    }
    return $tag;
}, 10, 3);
