<?php
require_once('blog/wp-blog-header.php');
require_once('blog/wp-load.php');

$args = array(
	'post_type' => 'site_pages',
	'orderby' => 'date',
	'order' => 'DESC',
	'post_status' => 'publish',
	'name' => 'home'
);
$wp_query = new WP_Query($args);

$phrases = array();
while ($wp_query->have_posts()) : $wp_query->the_post();
	$phrases = get_field('home_phrases');
endwhile;
wp_reset_postdata();

require_once(VIEWS_PATH."/home/home.php");
?>