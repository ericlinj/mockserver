//demo
var $ = require('jquery');
var JsonEditor = require('jsoneditor');
var JsonMinify = require('jsonminify');
var jsonMinify = new JsonMinify;
var Dialog = require('dialog');
var jsonEditor = null;

exports.preAdd = function(context, next) {
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
  var q_cache_project = $("select[name=q_project]").attr('data_qcache');
  $.ajax({
    url: '/project/ajaxList',
    type: 'get',
    success: function(data) {
      var optHtml = '';
      $(data).each(function(idx, item) {
        if (q_cache_project && parseInt(q_cache_project, 10) === parseInt(item.id, 10)) {
          optHtml += '<option value=' + item.id + ' selected="selected">' + item.name + '</option>'
        } else {
          optHtml += '<option value=' + item.id + '>' + item.name + '</option>'
        }
      });
      $("select[name=q_project]").html(optHtml);
    }
  })
  if(container){
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
    })
  }
};
