<!doctype html>
    <html lang="en" xml:lang="en">
    <head>
        <?php require_once(VIEWS_PATH."/common/metas.php"); ?>
        <base href="<?php echo ROOT_PATH; ?>" data-page="<?php echo $ctl_section_path; ?>" data-slug="<?php echo  $ctl_page_path; ?>" data-type="<?php echo $mobile;?>">
        <script type="text/javascript">
            var base_path = "<?php echo (ROOT_FOLDER=="") ? "/" : ROOT_FOLDER;?>";
            var root_path = "<?php echo ROOT_PATH; ?>";
            var static_path = "<?php echo STATIC_PATH; ?>";
            var upload_path = "<?php echo UPLOAD_PATH; ?>";
            var phrases = [];
            <?php
                if(isset($phrases))
                {
                    foreach ($phrases as $phrase)
                    {
                    ?>
                        phrases.push({title:"<?php echo $phrase["title"];?>", phrase:"<?php echo $phrase["phrase"];?>"});
                    <?php
                    }
                }
            ?>
        </script>
        <link type="text/css" media="screen" rel="stylesheet" href="<?php echo STATIC_PATH.'/honorable/awwwards.css'; ?>" />
        <link rel="stylesheet" href="<?php echo STATIC_PATH.'/css/style.css'; ?>">
    </head>
    <body itemscope itemtype="http://schema.org/WebSite">
        <meta itemprop="name" content="fabiotoste.com">
        <meta itemprop="description" content="<?php echo $meta_description;?>">
        <meta itemprop="image" content="<?php echo $og_picture;?>">
        <span itemprop="about" itemscope itemtype="http://schema.org/Person">
            <meta itemprop="name" content="Fabio Toste">
            <meta itemprop="givenName" content="Fabio">
            <meta itemprop="familyName" content="Toste">
            <meta itemprop="email" content="tostegroo@gmail.com">
            <meta itemprop="birthDate" content="03/21/1981">
            <meta itemprop="gender" content="male">
            <meta itemprop="worksFor" content="Hive">
            <meta itemprop="description" content="<?php echo $meta_description;?>">
            <meta itemprop="image" content="<?php echo $og_picture;?>">
        </span>

        <div id="awwwards" class="honorable green left">
            <a href="http://www.awwwards.com" target="_blank">Awwwards</a>
        </div>

    	<div id="fb-root"></div>
        <?php require_once(VIEWS_PATH."/common/social.php"); ?>
        <div class="dummy"></div>
        <div id="main-loader" class="main-loader">
            <div class="loader-content animate"></div>
            <div id="loader-bar" class="loader-bar"><span></span></div>
        </div>
        <header id="header">
            <a href="<?php echo ROOT_PATH; ?>/about" class="section_link about" data-link="about"><h1 id="home-logo" class="logo">
                <span class="logo-text glitch about desktop" data-text="About">About</span>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50" height="40" viewBox="0 0 149.033 122.159" enable-background="new 0 0 149.033 122.159" xml:space="preserve">
                    <g id="logo-svg">
                        <polygon points="75.193,0 49.762,41.316 72.542,54.158 62.645,70.161 40.673,57.207 0,122.159 149.033,122.159 "/>
                    </g>
                </svg>
            </h1></a>
            <div id="home-share" class="home-share">
                <a id="share-twitter" href="#sharetwitter" class="social-item-home twitter" title="Share on Twitter"><span class="s-ico icon-social-twitter"></span></a>
                <a id="share-facebook" href="#sharefacebook" class="social-item-home facebook" title="Share on Facebook"><span class="s-ico icon-social-facebook"></span></a>
                <a id="share-gplus" href="#sharegplus" class="social-item-home gplus" title="Share on Google+"><span class="s-ico icon-social-googleplus"></span></a>
            </div>
        </header>
        <section id="c-about" class="h-overlay" data-id="about">
            <?php $internal_load=true; require(CONTROLLERS_PATH."/about/about.php"); ?>
        </section>
        <main class="main" id="main">
