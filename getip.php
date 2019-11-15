<?php

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
