<?php

require_once 'sql.php';

$request_type = filter_input(INPUT_POST, 'requestType');
$notget_prize = "SELECT `rp_id` FROM `reward_pool` WHERE `rp_used_datetime` IS NULL";
$select_probality = "SELECT `probality` FROM `reward_probality` WHERE `id` = '0'";//概率表，照这条语句见表。只有一条数据id=0，第二个栏位为概率reward_probality。
$select_info = "SELECT `ip`,`get_time`,`prize_name` FROM `people_info`";//中奖信息表，自己照这条语句建表。

/**
 * 根据获取的请求类型操作
 */
switch ($request_type) {
  case "NUM":
    $result = mysqli_query($hxb_db, $notget_prize);
    $notget_prizenum = mysqli_num_rows($result);
    echo $notget_prizenum;
    break;
  case "NAME":
    $notget_result = mysqli_query($hxb_db, $notget_prize);
    if (mysqli_num_rows($notget_result) < 1) {
      echo '当前奖池为空！';
    } else {
      $prize_pool = [];
      while ($row = mysqli_fetch_assoc($notget_result)['rp_id']) {
        $prize_pool[] = $row;
      }
      $pool_num = sizeof($prize_pool);                                          //计算数组长度
      $probality_result = mysqli_query($hxb_db, $select_probality);
      $get_probality = mysqli_fetch_assoc($probality_result)['probality'];      //获取中奖概率 
      $pool_length = ceil($pool_num / $get_probality);
      for ($i = $pool_num; $i < $pool_length; $i++) {
        $prize_pool[$i] = '0';                                                  //$i可写可不写
      }
      $get_id = rand(0, sizeof($prize_pool) - 1);                               //取随机数抽奖
      $prize_id = $prize_pool[$get_id];                                         //抽出的奖品ID
//    intval($prize_id)转整型 floatval转浮点型
      $select_prizename = "SELECT `rp_name` FROM `reward_pool` WHERE `reward_pool`.`rp_id` = '{$prize_id}'";
      $current_gettime = "UPDATE `reward_pool` SET `rp_used_datetime` = CURRENT_TIMESTAMP WHERE `reward_pool`.`rp_id` = '{$prize_id}'";
      $result = mysqli_query($hxb_db, $select_prizename);
      $prize_name = mysqli_fetch_assoc($result)['rp_name'];                     //抽出的奖品名称
      if ($prize_name !== null) {
        mysqli_query($hxb_db, $current_gettime);
        $ip = get_ip();
        $add_info = "INSERT INTO `people_info` (`id`, `ip`, `get_time`, `prize_name`, `address`) VALUES (NULL, '{$ip}', CURRENT_TIMESTAMP, '{$prize_name}', NULL)";
        mysqli_query($hxb_db, $add_info);
        echo $prize_name;
      } else {
        echo "谢谢惠顾！";
      }
    }
    break;
  case "INFO":
    $result = mysqli_query($hxb_db, $select_info);
    sql_tojson($result);
    break;
  default:
    echo "获取类型错误！";
    break;
}
mysqli_close($hxb_db);

/**
 * 获取ip地址
 * @return String ip地址
 */
function get_ip() {
  $ip = '未知IP';
  if (!empty(filter_input(INPUT_SERVER, 'HTTP_CLIENT_IP'))) {
    return is_ip(filter_input(INPUT_SERVER, 'HTTP_CLIENT_IP')) ? filter_input(INPUT_SERVER, 'HTTP_CLIENT_IP') : $ip;
  } elseif (!empty(filter_input(INPUT_SERVER, 'HTTP_X_FORWARDED_FOR'))) {
    return is_ip(filter_input(INPUT_SERVER, 'HTTP_X_FORWARDED_FOR')) ? filter_input(INPUT_SERVER, 'HTTP_X_FORWARDED_FOR') : $ip;
  } else {
    return is_ip(filter_input(INPUT_SERVER, 'REMOTE_ADDR')) ? filter_input(INPUT_SERVER, 'REMOTE_ADDR') : $ip;
  }
}

/**
 * 判断ip地址正确性
 * @param String $str ip地址
 * @return boolean 判断是否为ip地址
 */
function is_ip($str) {
  $ip = explode('.', $str);
  for ($i = 0; $i < count($ip); $i++) {
    if ($ip[$i] > 255) {
      return false;
    }
  }
  return preg_match('/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/', $str);
}

/**
 * 数据库查询结果转为json
 * @param object $result 数据库查询结果
 */
function sql_tojson($result) {
  $result_array = [];
  while ($row = mysqli_fetch_object($result)) {
    $result_array[] = $row;
  }
  echo json_encode($result_array);
}
