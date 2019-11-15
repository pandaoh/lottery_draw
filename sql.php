<?php

/**
 * 数据库配置信息
 */
$host = "数据库地址";
$user = "账号";
$pwd = "密码";
$db_name = "数据库名";
//数据表名为：reward_pool 各栏位名：rp_id（int(10) PK、AI）、rp_name（varchar(30)）、rp_create_datetime（datetime(预设值：CURRENT_STAMP)）、rp_used_datetime（datetime(可为空，默认为空)） 
//还有两张表见front_stack.php

//$hxb_db = new mysqli($host, $user, $pwd, $db_name); //面向对象连接方式
$hxb_db = mysqli_connect($host, $user, $pwd, $db_name); //面向过程连接方式
if (!$hxb_db) {
  die("数据库连接失败，请检查您的代码！！！！！" . mysqli_connect_error());
  exit();
}

$set_code = "SET NAMES UTF8"; //设置编码格式
mysqli_query($hxb_db, $set_code);

if (filter_input(INPUT_SERVER, "REQUEST_METHOD") === "GET") {
  mysqli_close($hxb_db); //直接访问此文件时关闭数据库！
}
