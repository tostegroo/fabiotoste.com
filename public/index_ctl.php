<?php 
session_start();
if (isset($_SERVER["HTTP_ACCEPT_ENCODING"]) && substr_count($_SERVER["HTTP_ACCEPT_ENCODING"],"gzip")>0) 
    ob_start("ob_gzhandler");
else
    ob_start();

require_once(dirname(__FILE__)."/../application/config/environment.php");
require_once(CLASSES_PATH."/utils/utils.php");

@$ctl_section_path = c_sanitize_file_name($_GET["section"]);
@$ctl_page_path = c_sanitize_file_name($_GET["page"]);

$dir_exceptions = array();
if (isset($ctl_section_path) && isset($ctl_page_path) && (!in_array($ctl_section_path, $dir_exceptions))) 
{
    $ctl_file_full_path = CONTROLLERS_PATH."/".$ctl_section_path."/".$ctl_page_path.".php";
	$ctl_file_base_path = CONTROLLERS_PATH."/".$ctl_section_path;
	
    if (file_exists($ctl_file_full_path)) 
	{
        require_once($ctl_file_full_path);
    }
    else if (file_exists($ctl_file_base_path."/index.php")) 
	{
		require_once($ctl_file_base_path."/index.php");
	}
    else
	{
       	require_once(CONTROLLERS_PATH."/error/404.php");
    }
}else{
   require_once(CONTROLLERS_PATH."/home/home.php");
}
?>