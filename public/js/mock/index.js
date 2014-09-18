//demo
var $ = require('jquery');
var JsonEditor = require('jsoneditor');
var JsonMinify = require('jsonminify');
var jsonMinify = new JsonMinify;
var Dialog = require('dialog');
var jsonEditor = null;
var appUtil = require('appUtil');

exports.preAdd = function(context, next) {
  appUtil.initProjectSelect("project_id");
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })
  initJsonCheck();
  $("#btn-add-submit").click(function() {
    try {
      var mockJson = jsonEditor.getText();
      $("input[name=mock_json]").val(mockJson);
      $("form")[0].submit()
    } catch (e) {
      alert("mock数据错误：" + e);
    }
  })
};
exports.preEdit = function(context, next) {
  var me = this;
  appUtil.initProjectSelect("project_id", $("select[name=project_id]").attr("data_project_id"));
  ///////cancel
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })

  initJsonCheck();
  try {
    var json = $("input[name=mock_json]").val() || "{}";
    jsonEditor.setText(json);
  } catch (e) {
    console.info(e)
  }
  $("#btn-edit-submit").click(function() {
    try {
      var mockJson = jsonEditor.getText();
      $("input[name=mock_json]").val(mockJson);
      $("input[name=is_stay]").val(0);
      $("form")[0].submit()
    } catch (e) {
      alert("mock数据错误：" + e);
    }
  })

  $("#btn-edit-stay-submit").click(function() {
    try {
      var mockJson = jsonEditor.getText();

    } catch (e) {
      alert("mock数据错误：" + e);
    }

    $("input[name=mock_json]").val(mockJson);
    $("input[name=is_stay]").val(1);

    $.ajax({
      url: "/mock/doEdit",
      data: $("form").eq(0).serialize(),
      type: "POST"
    }).success(function(res) {
      if (res.status == 1) {
        alert("保存成功！");
      } else {
        alert("出错了：" + res.msg);
      }
    }).error(function(e) {
      console.error(e);
    })
  })
};

function initJsonCheck() {
  var me = this;
  //////jsoncheck
  var container = document.getElementById('mockjson');
  //jsonEditor
  jsonEditor = new JsonEditor(container, {
    modes: ['tree', 'text', 'code']
  });
  $("#jsonCheck").click(function() {
    try {
      var jsondata = jsonEditor.get();
      alert("验证成功")
    } catch (e) {
      alert("验证失败:" + e)
    }
  })
  $("#importResultJson").click(function() {
    try {
      var minifyJson = jsonMinify.minify($("#result_json").val());
      jsonEditor.setText(minifyJson);
    } catch (e) {
      alert("导入失败，minifyJson:" + minifyJson)
      console.info(e);
    }
  })
}
//弹框

//////进入list页面
exports.list = function(context, next) {
  var container = document.getElementById('mockjson');
  var me = this;
  // project list select
  appUtil.initProjectSelect("q_project", $("select[name=q_project]").attr('data_qcache'));
  //add ajaxmock checker
  if (container) {
    //dialog
    me.showDialog = new Dialog("跨域mockrest验证", container).closable();
    //jsonEditor
    var jsonEditor = new JsonEditor(container, {
      mode: "view"
    });
    $(".mockButton").click(function() {
      var url = $(this).attr("data-url");
      $.ajax({
        type: "POST",
        url: url,
        success: function(data) {
          jsonEditor.set(data);
          me.showDialog.show();

        }
      });
    });
    //del
    $(".delButton").click(function() {
      if (!confirm("确认删除？")) {
        return;
      }
      var me = this;
      var delId = $(this).attr("data-id");
      $.ajax({
        type: "get",
        url: "/mock/doDel",
        data: {
          id: delId
        },
        success: function(data) {
          if (data.status && parseInt(data.status, 10) == 1) {
            $(me).parentsUntil("tr").parent().remove();
            alert("删除成功");
          } else {
            alert("发生异常:" + data.msg);
          }
        }
      });
    })
    //export pdf
    $('.export-pdf').click(function() {
        var prjName = $('select[name=q_project] option:checked').text();
        var prjId = $('select[name=q_project]').val();
        if (!confirm('确认导出项目' + prjName + '的接口文档？')) {
          return false;
        }
        var para = "prjId=" + prjId + "&prjName=" + prjName;
        window.open('/project/exportExcel?' + para , '_blank ')
    })

    ///////////////

  }
};
