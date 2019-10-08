<?php
function c_sanitize_file_name($file_name) 
{
    return preg_replace("/[^a-z^A-Z^0-9^_-]*/","", $file_name);
}
function bot_detected() 
{
	if (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/bot|crawl|slurp|spider/i', $_SERVER['HTTP_USER_AGENT'])) 
		return TRUE;
	else 
		return FALSE;
}
?>