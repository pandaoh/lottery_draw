/**
 * @author 贺雄彪
 * @description 抽奖机界面
 */

/**
 * 页面初始化
 */
function initBox() {
  $(".get-dialog button").click(function () {
    reGet();
  });
  boxRandom();
  setTimeout(function () {
    getPrizenum();
    $(".start-dialog").show("blind", 300);
    $(".start-dialog button").click(function () {
      $(".start-dialog").hide("blind", 300);
    });
  }, 2300);
}



/**
 * 随机摆放盒子位置
 */
function boxRandom() {
  var img = document.querySelectorAll(".prize-box");
  clearInterval(infoGet);
  var randomLocation = setInterval(function () {
    for (i = 0; i < img.length; i++) {
      img[i].style.position = "absolute";
      img[i].style.top = getRandnum(79) + "%";
      img[i].style.left = getRandnum(79) + "%";
    }
  }, 300);
  setTimeout(function () {
    clearInterval(randomLocation);
    $(".get-dialog .surprise").css("background-image", "");
    setImgclick();
    getInfo();
  }, 2700);
}



/**
 * 设置图片点击事件
 */
function setImgclick() {
  $(".prize-box").click(function () {
    $(".prize-box").off("click");
    $(this).attr("src", "img/blast.png");
    setTimeout(progressMove(), 100);
    setTimeout(function () {
      getPrizename();
      $(".get-dialog").show("shake", 500);
    }, 2000);
  });
}



/**
 * 再抽一次功能
 */
function reGet() {
  $(".prize-box").attr("src", "img/box.png");
  $(".get-dialog").hide("shake", 500);
  boxRandom();
}



/**
 * 产生随机数
 * @param {Number} 随机数范围
 * @returns {Number} 产生的随机数
 */
function getRandnum(range) {
  var num = Math.random() * range;
  num = parseInt(num);
  return num;
}



/**
 * 获取可抽取奖品数量
 */
function getPrizenum() {
  $.ajax({
    async: true,
    url: "front_stack.php",
    method: "POST",
    dataType: "text",
    data: {
      requestType: "NUM"
    },
    beforeSend: function () {
      console.log("%c......正在获取奖品数目......", "border-radius:10px;padding:3px;line-height:25px;background:#555;color:snow;font-weight:bolder;font-size:20px;");
    },
    success: function (prizeNum) {
      $(".get-prizenum").html("");
      $(".get-prizenum").html(prizeNum);
      console.log("%c......请求成功！......", "border-radius:10px;padding:3px;line-height:25px;background:green;color:snow;font-weight:bolder;font-size:20px;");
    },
    error: function () {
      console.log("%c......请求错误！......", "border-radius:10px;padding:3px;line-height:25px;background:red;color:snow;font-weight:bolder;font-size:20px;");
    },
    complete: function () {
      console.log("%c......COMPLETE......", "border-radius:10px;padding:3px;line-height:25px;background:#555;color:snow;font-weight:bolder;font-size:20px;");
    }
  });
}



/**
 * 获取奖品名称
 */
function getPrizename() {
  $.ajax({
    async: true,
    url: "front_stack.php",
    method: "POST",
    dataType: "text",
    data: {
      requestType: "NAME"
    },
    beforeSend: function () {
      console.log("%c......正在获取奖品名称......", "border-radius:10px;padding:3px;line-height:25px;background:#555;color:snow;font-weight:bolder;font-size:20px;");
    },
    success: function (prizeName) {
      $(".get-prizename").html("");
      if (prizeName === "谢谢惠顾！") {
        $(".get-dialog .surprise").css("background-image", "url(./img/cry_" + getRandnum(2) + ".gif)");
      } else if (prizeName === "当前奖池为空！") {
        $(".get-dialog .surprise").css("background-image", "");
      } else {
        $(".get-dialog .surprise").css("background-image", "url(./img/surprise_" + getRandnum(15) + ".gif)");
      }
      $(".get-prizename").html(prizeName);
      console.log("%c......请求成功！......", "border-radius:10px;padding:3px;line-height:25px;background:green;color:snow;font-weight:bolder;font-size:20px;");
    },
    error: function () {
      console.log("%c......请求错误！......", "border-radius:10px;padding:3px;line-height:25px;background:red;color:snow;font-weight:bolder;font-size:20px;");
    },
    complete: function () {
      console.log("%c......COMPLETE......", "border-radius:10px;padding:3px;line-height:25px;background:#555;color:snow;font-weight:bolder;font-size:20px;");
    }
  });
}



/**
 * 进度条显示
 */
function progressMove() {
  var dialogPar = document.querySelector(".progress-dialog");
  var dialogWrap = document.querySelector(".progress-wrap");
  var wrapWidth = 0;
  dialogPar.style.display = "block";
  clearInterval(infoGet);
  var temp = setInterval(function () {
    if (wrapWidth >= 100) {
      clearInterval(temp);
      dialogPar.style.display = "none";
      dialogWrap.style.width = "0%";
      dialogWrap.innerHTML = "0%";
    } else {
      wrapWidth += 5;
      dialogWrap.style.width = wrapWidth + '%';
      dialogWrap.innerHTML = wrapWidth + '%';
    }
  }, 90);
}



var infoGet = null;//中奖信息定时器
/**
 * 获取中奖信息
 */
function getInfo() {
  $.ajax({
    async: true,
    url: "front_stack.php",
    method: "POST",
    dataType: "json",
    data: {
      requestType: "INFO"
    },
    success: function (result) {
      infoArray = jsonDecode(result);
      if (infoArray.length !== 0) {
        var infoNum = infoArray.length - 2;
        $(".more-info").append(infoArray[infoArray.length - 1]);
        infoGet = setInterval(function () {
          if (infoNum >= 0) {
            $(".more-info").empty();
            $(".more-info").append(infoArray[infoNum]);
            infoNum--;
          } else {
            $(".more-info").empty();
            $(".more-info").append(infoArray[infoArray.length - 1]);
            infoNum = infoArray.length - 2;
          }
        }, 10000);
      } else {
        $(".more-info").html("&emsp;暂时还无人中奖哦~&emsp;暂时还无人中奖哦~&emsp;暂时还无人中奖哦~&emsp;");
      }
    },
    error: function () {
      $(".more-info").empty();
      $(".more-info").html("&emsp;中奖记录读取失败！&emsp;中奖记录读取失败！&emsp;中奖记录读取失败！&emsp;");
    }
  });
}



var spanArray = [];//中奖数据存储数组
/**
 * 解析json数据，并创建Element。
 * @param {Object} result 后台传回的json数据
 * @returns {Array|spanArray} 数组
 */
function jsonDecode(result) {
  $(".more-info").empty();
  var obj = [];
  var obj = result;
  for (var i = 0; i < result.length; i++) {
    var newSpan = $("<span></span>");
    newSpan.addClass("info-item");
    var newI = $("<i></i>");
    var newTime = $("<b></b>");
    var newIp = $("<b></b>");
    var newName = $("<b></b>");
    newI.html("&emsp;" + obj[i].get_time);
    newI.appendTo(newTime);
    newIp.html(obj[i].ip);
    newName.html(obj[i].prize_name + "&emsp;");
    newSpan.append(newTime);
    var textStart = "&emsp;恭喜&emsp;";
    newSpan.append(textStart);
    newSpan.append(newIp);
    var textEnd = "&emsp;获得&emsp;";
    newSpan.append(textEnd);
    newSpan.append(newName);
    spanArray[i] = newSpan;
  }
  return spanArray;
}
