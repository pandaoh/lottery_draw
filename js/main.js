/**
 * @author 贺雄彪
 * @description 抽奖机管理
 */

/**
 * 预处理
 */
$(function () {
  $(".update-dialog").dialog({
    autoOpen: false,
    modal: true,
    show: {
      effect: "blind",
      duration: 300
    },
    hide: {
      effect: "explode",
      duration: 200
    },
    close: function () {
      $(".btn-focus").removeClass("btn-focus");
      $(".tr-focus").removeClass("tr-focus");
    },
    buttons: {"取消": function () {
        $(this).dialog("close");
      }, "修改": function () {
        $("#update-form").submit();
        var content = strFormat($("[name='newprize-name']").val());
        if (content.length !== 0) {
          $(this).dialog("close");
        }
      }}
  });

  $(".delete-dialog").dialog({
    autoOpen: false,
    modal: true,
    show: {
      effect: "shake",
      duration: 300,
      times: 2,
      distance: 20
    },
    hide: {
      effect: "explode",
      duration: 200
    },
    close: function () {
      $(".btn-focus").removeClass("btn-focus");
      $(".tr-focus").removeClass("tr-focus");
    },
    buttons: {"取消": function () {
        $(this).dialog("close");
      }, "删除": function () {
        deletePrize();
        $(this).dialog("close");
      }}
  });

  $(".probality-dialog").dialog({
    autoOpen: false,
    modal: true,
    show: {
      effect: "blind",
      duration: 300
    },
    hide: {
      effect: "explode",
      duration: 200
    },
    buttons: {"取消": function () {
        $(this).dialog("close");
      }, "保存": function () {
        $("#probality-form").submit();
        var content = $("[name='reward-probality']").val();
        if (content.length !== 0) {
          $(this).dialog("close");
          $("[name='reward-probality']").val("");
        }
      }}
  });

  $(".resetprize-dialog").dialog({
    autoOpen: false,
    modal: true,
    show: {
      effect: "shake",
      duration: 300,
      times: 2,
      distance: 20
    },
    hide: {
      effect: "explode",
      duration: 200
    },
    close: function () {
      $(".btn-warning").removeClass("btn-focus");
    },
    buttons: {"取消": function () {
        $(this).dialog("close");
      }, "确认重置": function () {
        resetPrize();
        $(this).dialog("close");
      }}
  });
  getProbality();
  selectAll();
});



var selectType = "ALL";//全局变量，记录当前查询类型。
/**
 * 查询已领取奖品功能
 */
function selectAll() {
  selectType = "ALL";
  $(".notall-btn").removeClass("btn-visit");
  $(".all-btn").addClass("btn-visit");
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "json",
    data: {
      requestType: "READ",
      selectType: selectType
    },
    beforeSend: function () {
      console.log("......正在从服务器请求数据......");
    },
    success: function (result) {
      jsonDecode(result);
      console.log("请求成功！");
    },
    error: function () {
      $(".not-get").html("数据加载失败！");
      $(".prize-num").html("连接失败！");
      console.log("请求失败！");
    },
    complete: function () {
      console.log("COMPLETE");
      $(".hint-info").html("请求已完成！");
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
    }
  });
}



/**
 * 查询未领取奖品功能
 */
function selectNotget() {
  selectType = "NOTGET";
  $(".all-btn").removeClass("btn-visit");
  $(".notall-btn").addClass("btn-visit");
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "json",
    data: {
      requestType: "READ",
      selectType: selectType
    },
    beforeSend: function () {
      console.log("......正在从服务器请求数据......");
    },
    success: function (result) {
      jsonDecode(result);
      console.log("请求成功！");
    },
    error: function () {
      $(".not-get").html("数据加载失败！");
      $(".prize-num").html("连接失败！");
      console.log("请求失败！");
    },
    complete: function () {
      console.log("COMPLETE");
      $(".hint-info").html("请求已完成！");
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
    }
  });
}



/**
 * 新增功能
 * @returns {Boolean} 判断表单提交
 */
function insertPrize() {
  var prizeName = $("#add-form").serialize();//表单数据 
  prizeName = decodeURIComponent(prizeName.slice(11), true);//解决中文乱码
  prizeName = strFormat(prizeName);
  if (prizeName.length <= 0) {
    $("[name='prize-name']").val("");
    $(".warp-dialog").effect("shake", 500);//抖动特效提示
    $("[name='prize-name']").addClass("form-warning");//警告信息
    setTimeout(function () {
      $("[name='prize-name']").removeClass("form-warning");
    }, 500);
    return false;
  }
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "json",
    data: {
      requestType: "CREATE",
      prizeName: prizeName,
      selectType: selectType
    },
    beforeSend: function () {
      console.log("......正在向服务器添加数据......");
    },
    success: function (result) {
      jsonDecode(result);
      console.log("请求成功！");
    },
    error: function () {
      $(".not-get").html("数据添加失败！");
      console.log("请求失败！");
    },
    complete: function () {
      console.log("COMPLETE");
      $(".hint-info").html("新增完成！");
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
      $("[name='prize-name']").val("");
      $(".add-btn").removeClass("btn-focus");
    }
  });
  document.querySelector(".add-dialog").style.display = "none";
  return false;
}



/**
 * 修改功能
 * @returns {Boolean} 判断表单提交
 */
function updatePrize() {
  var prizeID = $(".tr-focus").children().first().html();
  prizeID = parseInt(prizeID);
  var newprizeName = $("#update-form").serialize();//表单数据 
  newprizeName = decodeURIComponent(newprizeName.slice(14), true);//解决中文乱码
  newprizeName = strFormat(newprizeName);
  if (newprizeName.length <= 0) {
    $("[name='newprize-name']").val("");
    $("[name='newprize-name']").addClass("form-warning");
    setTimeout(function () {
      $("[name='newprize-name']").removeClass("form-warning");
    }, 500);
    return false;
  }
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "json",
    data: {
      requestType: "UPDATE",
      selectType: selectType,
      prizeID: prizeID,
      newprizeName: newprizeName
    },
    beforeSend: function () {
      console.log("......正在修改服务器的数据......");
    },
    success: function (result) {
      jsonDecode(result);
      console.log("请求成功！");
    },
    error: function () {
      $(".not-get").html("数据修改失败！");
      console.log("请求失败！");
    },
    complete: function () {
      console.log("COMPLETE");
      $(".hint-info").html("修改完成！");
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
      $("[name='newprize-name']").val("");
    }
  });
  return false;
}



/**
 * 删除功能
 */
function deletePrize() {
  var prizeID = $(".tr-focus").children().first().html();
  prizeID = parseInt(prizeID);
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "json",
    data: {
      requestType: "DELETE",
      selectType: selectType,
      prizeID: prizeID
    },
    beforeSend: function () {
      console.log("......正在从服务器删除数据......");
    },
    success: function (result) {
      jsonDecode(result);
      console.log("请求成功！");
    },
    error: function () {
      $(".not-get").html("数据删除失败！");
      console.log("请求失败！");
    },
    complete: function () {
      console.log("COMPLETE");
      $(".hint-info").html("删除完成！");
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
    }
  });
}



/**
 * 弹出概率设置框
 */
function basketOpen() {
  $(".probality-dialog").dialog("open");
}

/**
 * 打开新增弹出框
 */
function addPrize() {
  $(".add-btn").addClass("btn-focus");
  $("[name='prize-name']").val("");
  document.querySelector(".add-dialog").style.display = "block";
  $("[name='prize-name']").focus();
}

/**
 * 关闭新增弹出框
 */
function closeDialog() {
  $(".add-btn").removeClass("btn-focus");
  $("[name='prize-name']").val("");
  document.querySelector(".add-dialog").style.display = "none";
}



/**
 * 解析后台传回的json文档
 * @param {json} 后台传回的json文档
 */
function jsonDecode(result) {
  $("tbody").empty();
  var obj = [];
  var obj = result;
  if (result.length === 0) {
    var newTr = $("<tr></tr>");
    var newTd = $("<td></td>");
    newTd.attr("colspan", "6");
    newTd.addClass("not-get");
    newTd.html("当前奖池无数据！");
    newTd.appendTo(newTr);
    $("tbody").append(newTr);
  } else {
    for (var i = 0; i < result.length; i++) {
      var newTr = $("<tr></tr>");
      var newId = $("<td></td>");
      var newName = $("<td></td>");
      var newCreateTime = $("<td></td>");
      var newGetTime = $("<td></td>");
      var newUpdate = $("<td></td>");
      var newUpdateButton = $("<button></button>");
      var newDelete = $("<td></td>");
      var newDeleteButton = $("<button></button>");
      newId.html(obj[i].rp_id);
      newName.html(obj[i].rp_name);
      newCreateTime.html(obj[i].rp_create_datetime);
      if (obj[i].rp_used_datetime === null) {
        newGetTime.css("font-weight", "bold");
        newGetTime.html("尚未领取");
        newUpdateButton.addClass("update-btn");
        newDeleteButton.addClass("delete-btn");
        newUpdateButton.html("修改");
        newDeleteButton.html("删除");
        newUpdateButton.appendTo(newUpdate);
        newDeleteButton.appendTo(newDelete);
      } else {
        newGetTime.html(obj[i].rp_used_datetime);
        newUpdate.html("&nbsp;");
        newDelete.html("&nbsp;");
      }
      newTr.append(newId);
      newTr.append(newName);
      newTr.append(newCreateTime);
      newTr.append(newGetTime);
      newTr.append(newUpdate);
      newTr.append(newDelete);
      $("tbody").append(newTr);
    }
    btnClick();
  }
  getPrizenum();
}



/**
 * 按钮添加事件
 */
function btnClick() {
  $(".update-btn").click(function () {
    $(this).addClass("btn-focus");
    $(this).parents("tr").addClass("tr-focus");
    $(".update-dialog").dialog("open");
    var oldName = $(this).parents("tr").children("td").eq(1).html();
    $("[name='newprize-name']").val(oldName);
  });
  $(".delete-btn").click(function () {
    $(this).addClass("btn-focus");
    $(this).parents("tr").addClass("tr-focus");
    $(".delete-dialog").dialog("open");
    var oldName = $(this).parents("tr").children("td").eq(1).html();
    $(".delete-dialog p strong:nth-of-type(2)").html(oldName);
  });
}



/**
 * 字符串处理方法
 * @param {string} string为需要处理的字符串
 * @returns {string} 处理后的字符串
 */
function strFormat(string) {
  string = string.replace(/^\s+|\s+$/g, "");//去掉前后空格
  var div = document.createElement('div');
  div.textContent = string;//利用textContent属性转化"<",">","&","'"等字符 
  var formatString = div.innerHTML;
  return formatString;
}



/**
 * 键盘快捷键
 * @param {Event} 键盘按下事件
 */
function addKeyboard(e) {
  var keyNum = window.event ? e.keyCode : e.which;
//  console.log(keyNum);
  if (keyNum === 119) {
    basketOpen();
  }
  if (keyNum === 113) {
    addPrize();
  }
  if (keyNum === 27) {
    closeDialog();
  }
}



/**
 * 重新设置概率功能
 * @returns {Boolean} 判断表单提交
 */
function resetProbality() {
  var newProbality = $("#probality-form").serialize();//表单数据 
  newProbality = newProbality.slice(17);
  var formatProbality = parseFloat(newProbality).toFixed(3);
  if (formatProbality <= 0 || formatProbality > 1 || newProbality.length <= 0) {
    $("[name='reward-probality']").val("");
    $("[name='reward-probality']").addClass("form-warning");
    setTimeout(function () {
      $("[name='reward-probality']").removeClass("form-warning");
    }, 500);
    return false;
  } else {
    newProbality = formatProbality;
  }
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "text",
    data: {
      requestType: "OTHERS",
      othersAct: "setProbality",
      newProbality: newProbality
    },
    success: function (result) {
      $(".help-text").attr("title", "当前抽奖概率为【" + result + "】，双击（F8）重新设置 ～ ");
      console.log("请求成功！");
    },
    error: function () {
      console.log("请求失败！");
    },
    complete: function () {
      $(".hint-info").html("设置完成！");
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
    }
  });
  return false;
}



/**
 * 获取当前抽奖概率
 */
function getProbality() {
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "text",
    data: {
      requestType: "OTHERS",
      othersAct: "setProbality",
      newProbality: ""
    },
    success: function (result) {
      $(".help-text").attr("title", "当前抽奖概率为【" + result + "】，双击（F8）重新设置 ～ ");
      console.log("请求概率成功！");
    },
    error: function () {
      console.log("请求概率失败！");
    }
  });
}



/**
 * 重置奖池弹出框
 */
function openResetdialog() {
  $(".btn-warning").addClass("btn-focus");
  $(".resetprize-dialog").dialog("open");
}



/**
 * 重置奖池功能
 */
function resetPrize() {
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "text",
    data: {
      requestType: "OTHERS",
      othersAct: "resetPrize"
    },
    success: function (result) {
      $(".hint-info").html(result);
      $(".hint-info").show(300);
      setTimeout(function () {
        $(".hint-info").hide(300);
      }, 1100);
      console.log("请求成功！");
      window.location.reload();
    },
    error: function () {
      console.log("请求失败！");
    }
  });
}



/**
 * 获取奖品数目
 */
function getPrizenum() {
  $.ajax({
    async: true,
    url: "back_stack.php",
    method: "POST",
    dataType: "text",
    data: {
      requestType: "OTHERS",
      selectType: selectType,
      othersAct: "getPrizenum"
    },
    success: function (result) {
      if (result === "0") {
        $(".prize-num").html("当前奖池无奖品！");
      } else {
        $(".prize-num").html("当前共计&nbsp;【" + result + "】&nbsp;个奖品！");
      }
      console.log("请求数目成功！");
    },
    error: function () {
      console.log("请求数目失败！");
    }
  });
}