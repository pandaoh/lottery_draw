<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>抽奖机</title>
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <link rel="stylesheet" type="text/css" href="jquery-ui-1.12.1/jquery-ui.min.css">
  </head>
  <body onload="initBox();">
    <main>
      <div>
        <img class="prize-box" src="img/box.png" alt="抽奖箱" title="点我抽奖哦～">
      </div>
      <div>
        <img class="prize-box" src="img/box.png" alt="抽奖箱" title="点我抽奖哦～">
      </div>
      <div>
        <img class="prize-box" src="img/box.png" alt="抽奖箱" title="点我抽奖哦～">
      </div>
      <div>
        <img class="prize-box" src="img/box.png" alt="抽奖箱" title="点我抽奖哦～">
      </div>
      <div>
        <img class="prize-box" src="img/box.png" alt="抽奖箱" title="点我抽奖哦～">
      </div>
      <div>
        <img class="prize-box" src="img/box.png" alt="抽奖箱" title="点我抽奖哦～">
      </div>
    </main>
    <div class="people-info">
      <p class="more-info">&emsp;正在读取数据...&emsp;</p>
    </div>
    <div class="start-dialog">
      <div class="info-dialog welcome">
        <span>抽抽乐</span>
        <span>&nbsp;<strong class="get-prizenum"></strong>&nbsp;种好礼等你来拿！</span>
        <button>开始抽奖</button>
      </div>
    </div>
    <div class="get-dialog">
      <div class="info-dialog surprise">
        <span>恭喜你获得:&nbsp;<strong class="get-prizename"></strong></span>
        <button>再抽一次</button>
      </div>
    </div>
    <div class="progress-dialog">
      <strong>正在抽奖中...</strong>
      <div class="progress-body">
        <div class="progress-wrap">0%</div>
      </div>
    </div>
    <a href="backindex.html" target="_blank"><img alt="篮球" title="点击进入后台管理 ～ " class="help-text" src="img/basketball.png"></a>
    <script type="text/javascript" src="js/jquery-3.4.1.min.js"></script>
    <script type="text/javascript" src="jquery-ui-1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
  </body>
</html>
