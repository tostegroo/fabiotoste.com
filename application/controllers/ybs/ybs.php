<!doctype html>
<html lang="en" xml:lang="en">
<head>
    <?php $meta_title = 'fabiotoste.com — your browser stinks!'; ?>
    <?php require_once(VIEWS_PATH."/common/metas.php"); ?>
    <link rel="stylesheet" type="text/css" href="<?php echo STATIC_PATH; ?>/css/ybs.css"/>
</head>
<body>
	<div class="content">
        <div class="text text_1">
        	<b>if</b>you<b>are</b><br>seeing<br>
            <b>this</b><br>
            message<br>
            <b>your browser</b><br>
            <span>stinks!</span>
        </div>
        <div class="img">
            <img src="<?php echo STATIC_PATH?>/imgs/logo_full.png" alt="fabiotoste.com - triangle"/>
        </div>
        <div class="text text-2"><b>to</b>see<b>this</b>site<b>you</b>need<b>a</b>better<b>browser</b></div>
        <div class="browsers">
        	<a href="http://windows.microsoft.com/pt-br/internet-explorer/download-ie" target="_blank" title="Link to download IE11"><div class="b_ico ie"></div></a>
            <a href="https://www.google.com/intl/pt-BR/chrome/browser/" target="_blank" title="Link to download google Chrome"><div class="b_ico chrome"></div></a>
            <a href="https://www.mozilla.org/pt-BR/firefox/new/" target="_blank" title="Link to download Firefox"><div class="b_ico firefox"></div></a>
            <a href="https://www.apple.com/br/safari/" class="last" target="_blank" title="Link to download Safari"><div class="b_ico safari"></div></a>
        </div>
    </div>
    <?php require_once(VIEWS_PATH."/common/analytics.php"); ?>
</body>
</html>
