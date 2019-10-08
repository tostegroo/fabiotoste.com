<?php
require_once(CLASSES_PATH.'/utils/utils.php');
if(bot_detected() || (isset($internal_load) && $internal_load==true))
{
	require_once('blog/wp-blog-header.php');
	require_once('blog/wp-load.php');

	$args = array(
		'post_type' => 'portfolio',
		'post_status' => 'publish',
		'posts_per_page' => -1
	);
	$wp_query = new WP_Query($args);

	$portfolio = array();
	while ($wp_query->have_posts()) : $wp_query->the_post();
		$thumb = get_field('thumb_image');
		$thumb = ($thumb=='') ? 'https://unsplash.it/800/800/?random&v='.$post->ID : $thumb["sizes"]["portfolio-tumb"];
		$portfolio_item = array
		(
			'id' => $post->ID,
			'p_title' => $post->post_title,
			'title' => get_field('title'),
			'subtitle' => get_field('subtitle'),
			'thumb' => $thumb
		);
		array_push($portfolio, $portfolio_item);
	endwhile;
	wp_reset_postdata();

	require_once(VIEWS_PATH."/portfolio/portfolio.php");
}
else
{
	require(CONTROLLERS_PATH."/home/home.php");
}
?>