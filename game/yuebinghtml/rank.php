<?php
//session_start();
header('Content-type: application/json');
$servername=$_SERVER['SERVER_NAME'];//��ǰ���нű����ڷ��������������֡�
  $sub_from=$_SERVER["HTTP_REFERER"];//���ӵ���ǰҳ���ǰһҳ��� URL ��ַ
  $sub_len=strlen($servername);//ͳ�Ʒ����������ֳ��ȡ�
  $checkfrom=substr($sub_from,7,$sub_len);//��ȡ�ύ��ǰһҳ���url��������http:://�Ĳ��֡�
  if($checkfrom!=$servername){
   $msg="������Դ������ӱ�վ�ύ��";
   echo $msg;
   exit;
  }
define('mysql_server','localhost');
define('mysql_root','heimashe_api');
define('mysql_pass','ESHfnX5zd');
define('mysql_bass','heimashe_api');
$con = mysql_connect(mysql_server,mysql_root,mysql_pass);
if (!$con){
  die('Could not connect: ' . mysql_error());
  exit;
}
mysql_select_db(mysql_bass,$con);
mysql_query("set names utf8");
$ip = ip2long($_SERVER["REMOTE_ADDR"]);//ip
$ua=$_SERVER['HTTP_USER_AGENT'];
$score=$_GET["score"];
$score= intval($score,10);

$game_id=$_GET['game_id'];
$game_id= intval($game_id,10);

$sql="INSERT INTO  `heimashe_api`.`ranks` (`id` ,`game_id` ,`score`,`ip`,`ua`)VALUES (NULL ,  '$game_id',  '$score','$ip','$ua');";

mysql_query($sql);

$this_id=mysql_insert_id();

$rank_sql="SELECT id,score,(SELECT COUNT( 1 ) FROM ranks WHERE score >= ( SELECT score FROM ranks
WHERE id =$this_id and game_id=$game_id ORDER BY score DESC LIMIT 1 )) AS rank FROM ranks WHERE id =$this_id and game_id=$game_id";

//echo $rank_sql;
$result=mysql_query($rank_sql);
if($row = mysql_fetch_array($result)){
	
        echo json_encode($row);
}else{
	echo 'error code #5012';
	exit;
}
?>