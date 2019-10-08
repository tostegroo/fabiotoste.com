<?php
require_once(CLASSES_PATH.'/utils/utils.php');
if(bot_detected() || (isset($internal_load) && $internal_load==true))
{
	require_once('blog/wp-blog-header.php');
	require_once('blog/wp-load.php');

	$args = array(
		'post_type' => 'site_pages',
		'post_status' => 'publish',
		'name' => 'personal-work'
	);
	$wp_query = new WP_Query($args);

	$gallery = array();
	while ($wp_query->have_posts()) : $wp_query->the_post();
		$gallery = get_field('gallery');
	endwhile;
	wp_reset_postdata();

	require_once(VIEWS_PATH."/work/work.php");
}
else
{
	require(CONTROLLERS_PATH."/home/home.php");
}
?>