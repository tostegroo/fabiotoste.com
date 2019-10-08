<?php
require_once(CONFIG_PATH."/metas.php");
require_once(CLASSES_PATH.'/mobile/mobiledetect.php');

$detect = new Mobile_Detect;
$mobile = 'desktop';
$is_mobile = false;
if ($detect->isMobile()) 
{
	$mobile = 'mobile';
	$is_mobile = true;
}

$meta_title = (isset($meta_title)) ? $meta_title : META_TITLE;
$meta_author = (isset($meta_author)) ? $meta_author : META_AUTHOR;
$meta_url = (isset($meta_url)) ? $meta_url : META_URL;
$meta_keywords = (isset($meta_keywords)) ? strtolower($meta_keywords) : META_KEYWORDS;
$meta_description = (isset($meta_description)) ? str_replace('"', '', $meta_description) : META_DESCRIPTION;

$og_title = isset($og_title) ? $og_title : OG_TITLE;
$og_type = isset($og_type) ? $og_type : OG_TYPE;
$og_url = isset($og_url) ? $og_url : OG_URL;
$og_picture = isset($og_picture) ? $og_picture : OG_PICTURE;
$og_description = isset($og_description) ? $og_description : OG_DESCRIPTION;
$og_sitename = isset($og_sitename) ? $og_sitename : OG_SITE_NAME;
$og_keywords = isset($og_keywords) ? $og_keywords : OG_KEYWORDS;
$canonical_url = ROOT_PATH."/";

?>
<title><?php echo $meta_title; ?></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<?php /*<meta name="author" content="Fabio Toste" />*/ ?>
<meta name="robots" content="index, follow" />

<meta property="article:author" content="<?php echo $meta_url; ?>" />
<meta name="description" content="<?php echo $meta_description; ?>">
<meta name="keywords" content="<?php echo $meta_keywords; ?>">

<meta property="fb:app_id" content="<?php echo FB_APP_KEY;?>"/>
<meta property="og:title" content="<?php echo $og_title; ?>" />
<meta property="og:type" content="<?php echo $og_type; ?>" />
<meta property="og:url" content="<?php echo $og_url; ?>" />
<meta property="og:image" content="<?php echo $og_picture; ?>" />
<meta property="og:site_name" content="<?php echo $og_sitename;?>" />
<meta property="og:description" content="<?php echo $og_description; ?>" />

<link rel="canonical" href="<?php echo $canonical_url;?>"/>

<?php if($is_mobile==false){ ?>
<meta name="viewport" content="width=device-width, initial-scale=0.3, maximum-scale=0.6, minimum-scale=0.3">
<?php }else{ ?>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
<?php } ?>

<meta name="mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" sizes="57x57" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo ROOT_PATH; ?>/favicon/apple-touch-icon-180x180.png">
<link rel="icon" type="image/png" href="<?php echo ROOT_PATH; ?>/favicon/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="<?php echo ROOT_PATH; ?>/favicon/android-chrome-192x192.png" sizes="192x192">
<link rel="icon" type="image/png" href="<?php echo ROOT_PATH; ?>/favicon/favicon-16x16.png" sizes="16x16">
<link rel="manifest" href="<?php echo ROOT_PATH; ?>/favicon/manifest.json">
<link rel="mask-icon" href="<?php echo ROOT_PATH; ?>/favicon/safari-pinned-tab.svg" color="#22bfbf">
<link rel="shortcut icon" href="<?php echo ROOT_PATH; ?>/favicon/favicon.ico">
<meta name="msapplication-TileColor" content="#e2e2e2">
<meta name="msapplication-TileImage" content="<?php echo ROOT_PATH; ?>/favicon/mstile-150x150.png">
<meta name="msapplication-config" content="<?php echo ROOT_PATH; ?>/favicon/browserconfig.xml">
<meta name="theme-color" content="#22bfbf">