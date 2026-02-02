<?php 
$dbhost = 'sql107.epizy.com';
$dbname = 'epiz_27108762_dbtest';
$dbuser = 'epiz_27108762';
$dbpass = 'ZMbN04v3QXfezc5';

try {
	$db = new PDO("mysql:host={$dbhost};dbname={$dbname}",$dbuser,$dbpass);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

catch(PDOException $e) {
	echo "Connection error: ".$e->getMessage($db);
}
?>