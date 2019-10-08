<?php
require_once('blog/wp-blog-header.php');
require_once('blog/wp-load.php');

$id = isset($_REQUEST['id']) ? htmlentities($_REQUEST['id']) : 0;

$label = '';
$rnd = rand(0, 25000);
$img = 'https://unsplash.it/1920/1920/?random&v='.$rnd;

$attachment = get_post($id);
$name = $attachment->post_title;
$label = $attachment->post_excerpt;
$img = $attachment->guid;
$metadata = wp_get_attachment_metadata($id);
$prop = $metadata["width"]/$metadata["height"];
$image_alt = "Image called ".$name;

require_once(VIEWS_PATH."/work/work_single_content.php");
?>