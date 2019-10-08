<?php
require_once('blog/wp-blog-header.php');
require_once('blog/wp-load.php');

echo "<pre>";

$id = isset($_REQUEST['id']) ? htmlentities($_REQUEST['id']) : 0;

$label = '';
$rnd = rand(0, 25000);
$img = 'https://unsplash.it/1920/1920/?random&v='.$rnd;

$attachment = get_post(458);
var_dump($attachment);

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

foreach ($gallery as $k => $image)
{
	$color = rand(100, 200);
	$color = 'rgba('.$color.','.$color.','.$color.', 1.0)';
	$id = $image['id'];
	$name = $image['title'];
	$thumb = $image["sizes"]["thumbnail"];
}

echo "</pre>";
?>