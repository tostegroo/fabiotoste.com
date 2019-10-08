<div class="gallery-title">
	<div class="gallery-wrap">
		<h1 id="p-title-portfolio">Port<span>folio</span></h1>
	</div>
</div>
<div class="gallery-wrap">
	<div id="portfolio-gallery-container" class="gallery-container portfolio">
		<div id="portfolio-gallery" class="gallery">
		<?php
			if(isset($portfolio))
            {
                foreach ($portfolio as $k => $p)
                {
                	$color = rand(100, 200);
					$color = 'rgba('.$color.','.$color.','.$color.', 1.0)';

					$id = $p['id'];
					$p_title = $p['p_title'];
					$thumb = $p['thumb'];
					$title = $p['title'];
					$subtitle = $p['subtitle'];
				?>
				<div class="gallery-item portfolio hover" data-id="<?php echo $id;?>">
				<div class="gi-img">
					<img src="<?php echo $thumb;?>" alt="Thumb of <?php echo $p_title;?>">
				</div>
				<div class="overlay">
					<div class="overlay-info">
						<h3 class="client"><span><?php echo $subtitle;?></span></h3>
						<span class="line"></span>
						<h2 class="title"><span><?php echo $title;?></span></h2>
					</div>
				</div>
			</div>
			<?php
				}
            }
		?>
		</div>
	</div>
</div>