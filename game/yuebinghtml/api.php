<?php
//session_start();
header('Content-type: application/json');
$servername=$_SERVER['SERVER_NAME'];//当前运行脚本所在服务器主机的名字。
  $sub_from=$_SERVER["HTTP_REFERER"];//链接到当前页面的前一页面的 URL 地址
  $sub_len=strlen($servername);//统计服务器的名字长度。
  $checkfrom=substr($sub_from,7,$sub_len);//截取提交到前一页面的url，不包含http:://的部分。
  if($checkfrom!=$servername){
   $msg="数据来源有误！请从本站提交！";
   echo $msg;
   exit;
  }
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
$zs= intval($zs,10);
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