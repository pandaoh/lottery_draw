<?php

require_once 'sql.php';

$request_type = filter_input(INPUT_POST, 'requestType');
$select_type = filter_input(INPUT_POST, 'selectType');
$prize_name = filter_input(INPUT_POST, 'prizeName');
$newprize_name = filter_input(INPUT_POST, 'newprizeName');
$prize_id = filter_input(INPUT_POST, 'prizeID');
$reward_probality = filter_input(INPUT_POST, 'newProbality');
$others_act = filter_input(INPUT_POST, 'othersAct');

/**
 * 判断处理类型
 */
switch ($request_type) {
  case "CREATE":
    insert_function($prize_name, $select_type);
    break;
  case "READ":
    select_function($select_type);
    break;
  case "UPDATE":
    update_function($newprize_name, $prize_id, $select_type);
    break;
  case "DELETE":
    delete_function($prize_id, $select_type);
    break;
  case "OTHERS":
    if ($others_act === "setProbality") {
      set_probality($reward_probality);
    } else if ($others_act === "resetPrize") {
      reset_prize();
    } else if ($others_act === "getPrizenum") {
      get_prizenum($select_type);
    }
    break;
  default:
    die("操作类型错误！");
    break;
}
mysqli_close($hxb_db); //关闭数据库

/**
 * 插入功能
 * @global sql $hxb_db 数据库
 * @param string $prize_name 奖品名称
 * @param string $select_type 操作类型
 */
function insert_function($prize_name, $select_type) {
  global $hxb_db;
  $add_prize = "INSERT INTO `reward_pool` (`rp_id`, `rp_name`, `rp_create_datetime`, `rp_used_datetime`) VALUES (NULL, '{$prize_name}', CURRENT_TIMESTAMP, NULL)";
  mysqli_query($hxb_db, $add_prize);
  select_function($select_type);
}

/**
 * 查询功能
 * @global type $hxb_db 数据库
 * @param string $select_type 操作类型
 */
function select_function($select_type) {
  global $hxb_db;
  switch ($select_type) {
    case "ALL":
      $select_all = "SELECT `rp_id`,`rp_name`,`rp_create_datetime`,`rp_used_datetime` FROM `reward_pool`";
      $result = mysqli_query($hxb_db, $select_all);
      sql_tojson($result);
      break;
    case "NOTGET":
      $select_notget = "SELECT `rp_id`,`rp_name`,`rp_create_datetime`,`rp_used_datetime` FROM `reward_pool` WHERE `rp_used_datetime` IS NULL";
      $result = mysqli_query($hxb_db, $select_notget);
      sql_tojson($result);
      break;
    default:
      die("操作类型错误！");
      break;
  }
}

/**
 * 修改功能
 * @global sql $hxb_db 数据库
 * @param string $newprize_name 新的奖品名称
 * @param int $prize_id 奖品ID
 * @param string $select_type 操作类型
 */
function update_function($newprize_name, $prize_id, $select_type) {
  global $hxb_db;
  $current_prizename = "UPDATE `reward_pool` SET `rp_name` = '{$newprize_name}' WHERE `reward_pool`.`rp_id` = '{$prize_id}'";
  mysqli_query($hxb_db, $current_prizename);
  select_function($select_type);
}

/**
 * 删除功能
 * @global sql $hxb_db 数据库
 * @param int $prize_id 奖品ID
 * @param string $select_type 操作类型
 */
function delete_function($prize_id, $select_type) {
  global $hxb_db;
  $delete_prize = "DELETE FROM `reward_pool` WHERE `reward_pool`.`rp_id` = '{$prize_id}'";
  mysqli_query($hxb_db, $delete_prize);
  select_function($select_type);
}

/**
 * 设置抽奖概率功能
 * @global sql $hxb_db 数据库
 * @param string $reward_probality 新的抽奖概率
 */
function set_probality($reward_probality) {
  global $hxb_db;
  $select_probality = "SELECT `probality` FROM `reward_probality` WHERE `id` = '0'";
  $update_probality = "UPDATE `reward_probality` SET `probality` = '{$reward_probality}' WHERE `reward_probality`.`id` = 0";
  if ($reward_probality !== "") {
    mysqli_query($hxb_db, $update_probality);
  }
  $probality_result = mysqli_query($hxb_db, $select_probality);
  $get_probality = mysqli_fetch_assoc($probality_result)['probality'];          //获取中奖概率 
  echo $get_probality;
}

/**
 * 重置奖池
 * @global sql $hxb_db 数据库
 */
function reset_prize() {
  global $hxb_db;
  $reset_gettime = "UPDATE `reward_pool` SET `rp_used_datetime` = NULL WHERE `reward_pool`.`rp_used_datetime` IS NOT NULL";
  mysqli_query($hxb_db, $reset_gettime);
  echo "奖池已重置！";
}

/**
 * 获取奖品数目
 * @global sql $hxb_db 数据库
 * @param type $select_type 查询类型
 */
function get_prizenum($select_type) {
  global $hxb_db;
  switch ($select_type) {
    case "ALL":
      $all_prize = "SELECT `rp_id` FROM `reward_pool`";
      $result = mysqli_query($hxb_db, $all_prize);
      $all_prizenum = mysqli_num_rows($result);
      echo $all_prizenum;
      break;
    case "NOTGET":
      $notget_prize = "SELECT `rp_id` FROM `reward_pool` WHERE `rp_used_datetime` IS NULL";
      $result = mysqli_query($hxb_db, $notget_prize);
      $notget_prizenum = mysqli_num_rows($result);
      echo $notget_prizenum;
      break;
    default:
      die("操作类型错误！");
      break;
  }
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
