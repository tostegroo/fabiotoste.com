<div class="gallery-title work">
	<div class="gallery-wrap">
		<h1 id="p-title-work">Personal<br class="mobile"><span>Work</span></h1>
	</div>
</div>
<div class="gallery-wrap">
	<div id="work-gallery-container" class="gallery-container work">
		<div id="work-gallery" class="gallery">
		<?php
			if(isset($gallery))
            {
                foreach ($gallery as $k => $image)
                {
                	$color = rand(100, 200);
					$color = 'rgba('.$color.','.$color.','.$color.', 1.0)';
					$id = $image['id'];
					$name = $image['title'];
					$thumb = $image["sizes"]["thumbnail"];
				?>
				<div class="gallery-item work hover" data-id="<?php echo $id;?>" style="background-color:<?php echo $color;?>;">
					<img src="<?php echo $thumb;?>" alt="Thumb of personal work called <?php echo $name;?>">
				</div>
			<?php
				}
            }
		?>
		</div>
	</div>
</div>