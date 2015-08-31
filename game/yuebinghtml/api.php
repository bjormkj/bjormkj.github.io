<?php
//session_start();
header('Content-type: application/json');
define('mysql_server','localhost');
define('mysql_root','heimashe_paiming');
define('mysql_pass','iTU6cM3t2');
define('mysql_bass','heimashe_paiming');
$con = mysql_connect(mysql_server,mysql_root,mysql_pass);
if (!$con){
  die('Could not connect: ' . mysql_error());
  exit;
}
mysql_select_db(mysql_bass,$con);
mysql_query("set names utf8");
//$ip = ip2long($_SERVER["REMOTE_ADDR"]);//ip


$zs=$_GET["zs"];

$sql="INSERT INTO  `heimashe_paiming`.`paiming` (`id` ,`type` ,`fs`)VALUES (NULL ,  '',  '$zs');";

mysql_query($sql);

$this_id=mysql_insert_id();

$rank_sql="SELECT id, fs, (SELECT COUNT( 1 ) FROM paiming WHERE fs >= ( SELECT fs FROM paiming
WHERE id =$this_id ORDER BY fs DESC LIMIT 1 )) AS rank FROM paiming WHERE id =$this_id";

$mingci=0;
$result=mysql_query($rank_sql);
if($row = mysql_fetch_array($result)){
	$mingci=$row['rank'];
        //echo json_encode($row);
}else{
	echo 'error code #5012';
	exit;
}

$result=mysql_query("SELECT * FROM  `paiming` order by `fs` desc LIMIT 0 , 1");
$diyiming=0;

if($row = mysql_fetch_array($result)){
	$diyiming=$row['fs'];
        
}else{
	echo 'error code #5012';
	exit;
}
echo '{"fs":"'.$zs.'","mingci":"'.$mingci.'","diyiming":"'.$diyiming.'"}';
?>