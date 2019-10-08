<?php
if($portfolio_item!='')
{
	$title = $portfolio_item['title'];
	$description = $portfolio_item['description'];
	$bigletter = $portfolio_item['bigletter'];
	$content = $portfolio_item['content'];
?>
<section id="portfolio-single" class="portfolio-single">
	<div id="single-thumb" class="single-thumb"></div>
    <div id="single-close" class="single-close"></div>
    <div id="single-content-bg" class="single-content">
		<span id="single-cbg-span"><?php echo $bigletter;?></span>
	</div>
    <div id="single-content-portfolio" class="single-content">
    	<section class="portfolio-single-header">
    		<div class="ps-side left-side"></div>
			<div class="ps-side right-side">
				<div class="psr-content">
					<h1><?php echo $title;?></h1>
					<p><?php echo $description;?></p>
				</div>
			</div>
		</section>
		<section class="portfolio-single-body">
			<div class="psb-wrap">
				<div class="portfolio-single-body-content"><?php echo $content;?></div>
			</div>
			<footer class="portfolio-single-body-footer"></footer>
		</section>
    </div>
</section>
<?php
}
?>