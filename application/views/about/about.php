<div id="about-close" class="about-close"></div>
<div class="about-container">
	<div id="about-background" class="about-background"></div>
	<h1 id="about-title" class="title"><strong>It´s me</strong><br>Fabio</h1>
	<div id="about-content" class="about-content">
		<div class="content">
			<?php
			if(isset($about_groups))
			{
				foreach ($about_groups as $k => $aboutgroup) 
				{
					$titlecolor = $aboutgroup["title_color"];
					$backgroundcolor = $aboutgroup["background_color"];
					$fontcolor = $aboutgroup["font_color"];
					$title = $aboutgroup["title"];
					$content = $aboutgroup["content"];
				?>
				<section class="about-section" style="background-color:<?php echo $backgroundcolor;?>; color:<?php echo $fontcolor;?>">
					<h1 class="title s-title" style="color:<?php echo $titlecolor;?>"><strong>It´s me</strong><br>Fabio</h1>
					<h2 class="subtitle"><?php echo $title;?></h2>
					<?php echo $content;?>
				</section>
				<?php
				}
			}
			?>
		</div>
	</div>
	<div id="switchButton" class="hud switchButton"></div>
	<div id="about-scroll" class="about-scroll">
    	<p>I'm here</p>
    	<span></span>
    </div>
</div>