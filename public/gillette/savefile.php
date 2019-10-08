<?php

$id = $_GET["id"];
$nome = $_GET["nome"];
$lema = $_GET["lema"];
if (isset($GLOBALS["HTTP_RAW_POST_DATA"])) 
{
	$fileName = 'img.jpg';
	$im = $GLOBALS["HTTP_RAW_POST_DATA"];
}else
{  
	$im = file_get_contents( 'php://input' );
}
$fp = fopen($fileName, 'wb');
fwrite($fp, $im);
fclose($fp);

//echo '{"error":1,"error_lema":"O lema deve ter entre 2 e 64 letras.","error_image":"Ocorreu um erro no envio da imagem, tente novamente mais tarde.", "error_nome":"O nome deve ter entre 2 e 8 letras."}';
echo '{"success":1}';

?>