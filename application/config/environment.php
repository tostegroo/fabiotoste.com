<?php

//LOCALE
setlocale(LC_ALL, "en");
date_default_timezone_set("America/Sao_Paulo");

//SESSION
define("MAX_LOGIN_ATTEMPTS", 10);
define("LOGIN_INTERVAL", 60 * 24);
define("SESSION_NAME", "fabiotoste");

//MYSQL
define("MYSQL_HOST", "localhost");
define("MYSQL_PORT", "3306");
define("MYSQL_USER", "root");
define("MYSQL_PASSWORD", "");
define("MYSQL_DB", "");
define("PREFIX_TABLES", "");

//PROTOCOL
$protocol = ((isset($_SERVER["SERVER_PORT"]) && ($_SERVER["SERVER_PORT"] == 443)) || (isset($_SERVER["HTTP_SSL"]) && ($_SERVER["HTTP_SSL"] == true)))? "https://" : "http://";
define("PROTOCOL", $protocol);

//SERVER
define("ROOT_FOLDER", "");

//PATHS
define("ROOT_PATH", SERVER.ROOT_FOLDER);
define("STATIC_PATH", ROOT_PATH);
define("UPLOAD_PATH", STATIC_PATH."/uploads");
define("CONTROLLERS_PATH", $_SERVER["DOCUMENT_ROOT"].ROOT_FOLDER."/../application/controllers");
define("CONFIG_PATH", $_SERVER["DOCUMENT_ROOT"].ROOT_FOLDER."/../application/config");
define("CLASSES_PATH", $_SERVER["DOCUMENT_ROOT"].ROOT_FOLDER."/../application/classes");
define("VIEWS_PATH", $_SERVER["DOCUMENT_ROOT"].ROOT_FOLDER."/../application/views");
define("DOCUMENT_ROOT", $_SERVER['DOCUMENT_ROOT']);

//FACEBOOK
define("FB_APP_KEY", "");
?>
