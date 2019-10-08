<?php
session_start();
if (isset($_SERVER["HTTP_ACCEPT_ENCODING"]) && substr_count($_SERVER["HTTP_ACCEPT_ENCODING"],"gzip") > 0) 
    ob_start("ob_gzhandler");
else
    ob_start();

require_once(dirname(__FILE__)."/../application/config/environment.php");
require_once(CLASSES_PATH."/utils/utils.php");

@$ctl_section_path = c_sanitize_file_name($_GET["section"]);
@$ctl_page_path = c_sanitize_file_name($_GET["page"]);

require_once(CONTROLLERS_PATH."/home/home.php");
?>