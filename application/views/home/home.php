<?php
if(!isset($load_ajax) || (isset($load_ajax) && $load_ajax != 1)) 
{
    require_once(VIEWS_PATH."/common/header.php");
}
?>
<section id="fixed-content" class="fixed-content">
    <div id="mouse-scroll" class="mouse-scroll">
    	<p>scroll down</p>
    	<span></span>
    </div>
</section>
<section id="c-welcome" class="h-container" data-id="">
	<div class="content">
		<a href="<?php echo ROOT_PATH; ?>/portfolio" class="section_link portfolio" data-link="portfolio"><p id="top-quote" class="quote top-quote"><span>“</span></p></a>
		<p id="text-wellcome" class="text-wellcome"></p>
		<a href="<?php echo ROOT_PATH; ?>/work" class="section_link work" data-link="work"><p class="quote bottom-quote"><span>”</span></p></a>
		<p class="info desktop">click and hold for interaction<br>click on the triangle up there to know about me</p>
		<div id="holdbar" class="holdbar"></div>
		<div id="portfolio-info" class="portfolio-info desktop">
			<h3 id="p-client" class="client"></h3>
			<h2 id="p-title" class="title"></h2>
		</div>
		<div id="portfolio-cta" class="portfolio-cta desktop" data-text="seemore"><b>see</b>more</div>
	</div>
</section>
<section id="c-portfolio" class="h-container" data-id="portfolio">
	<?php $internal_load=true; require(CONTROLLERS_PATH."/portfolio/portfolio.php"); ?>
</section>
<section id="c-work" class="h-container" data-id="work">
	<?php $internal_load=true; require(CONTROLLERS_PATH."/work/work.php"); ?>
</section>
<?php
if(!isset($load_ajax) || (isset($load_ajax) && $load_ajax != 1)) 
{
    require_once(VIEWS_PATH."/common/footer.php");
}
?>