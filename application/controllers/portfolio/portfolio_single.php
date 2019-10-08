<?php
require_once('blog/wp-blog-header.php');
require_once('blog/wp-load.php');

$id = isset($_REQUEST['id']) ? htmlentities($_REQUEST['id']) : 0;

$args = array(
	'post_type' => 'portfolio',
	'post_status' => 'publish',
	'p' => $id
);
$wp_query = new WP_Query($args);

$portfolio_item = '';
while ($wp_query->have_posts()) : $wp_query->the_post();
	$portfolio_item = array
	(
		'id' => $post->ID,
		'p_title' => $post->post_title,
		'title' => get_field('internal_title'),
		'description' => get_field('description'),
		'bigletter' => get_field('big_letter'),
		'content' => $post->post_content,
	);
endwhile;
wp_reset_postdata();

require_once(VIEWS_PATH."/portfolio/portfolio_single.php");
?>