//demo
var $ = require('jquery');
var JsonEditor = require('jsoneditor');
var JsonMinify = require('jsonminify');
var jsonMinify = new JsonMinify;
var Dialog = require('dialog');
var jsonEditor = null;
var appUtil = require('appUtil');
var validate = require('validate-form');

exports.preAdd = function(context, next) {
  var me = this;
  appUtil.initProjectSelect("project_id");
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })
  initJsonCheck();
  initValidator($('#mockadd-form'));
  $("#btn-add-submit").click(function() {
    try {
      var mockJson = jsonEditor.getText();
      $("input[name=mock_json]").val(mockJson);
      trimUrl();
      me.validator.cb(function() {
        $('#mockadd-form')[0].submit();
      })

    } catch (e) {
      alert("mock数据错误：" + e);
    }
  })
};

function initValidator(jqForm) {
  //validate form
  this.validator = validate(jqForm)
    .field('title')
    .is('required', '请输入接口标题！')
    .is('maxLength', 50, '接口标题名称超长！')
    .field('url')
    .is('required', '请输入接口URL！')
    .is('maxLength', 255, '接口URL名称超长！')
    .field('result_json')
    .is('required', '请输入“输出参数”！');
}

function trimUrl() {
  var url = $("input[name=url]").val();
  url = url.replace(/\s/g, "");
  $("input[name=url]").val(url);

}
exports.preEdit = function(context, next) {
  var me = this;
  appUtil.initProjectSelect("project_id", $("select[name=project_id]").attr("data_project_id"));
  ///////cancel
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })

  initJsonCheck();
  initValidator($('#mockedit-form'));
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

      trimUrl();
      me.validator.cb(function() {
        $('#mockedit-form')[0].submit();
      })
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
    trimUrl();

    me.validator.cb(function() {
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

  })
};

exports.preClone = function(context, next) {
  var me = this;
  var selectedPrjId = $("select[name=project_id]").attr("data_project_id");
  appUtil.initProjectSelect("project_id", selectedPrjId);
  ///////cancel
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })

  initJsonCheck();
  initValidator($('#mockclone-form'));
  try {
    var json = $("input[name=mock_json]").val() || "{}";
    jsonEditor.setText(json);
  } catch (e) {
    console.info(e)
  }
  $("#btn-clone-submit").click(function() {
    try {
      var mockJson = jsonEditor.getText();
      $("input[name=mock_json]").val(mockJson);
      $("input[name=is_stay]").val(0);

      trimUrl();
      me.validator.cb(function() {
        $('#mockclone-form')[0].submit();
      })
    } catch (e) {
      alert("mock数据错误：" + e);
    }
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
    me.showDiffDialog = new Dialog("diff最近修改", document.getElementById('diffDiv')).closable();
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
    /////////diff
    $(".diffButton").click(function() {
      var diffId = $(this).attr("data-id");
      $.ajax({
        type: "POST",
        data: {
          id: diffId
        },
        url: "/snap/diff",
        success: function(data) {
          if (parseInt(data.status, 10) === 1) {
            me.showDiffDialog.show();
            $("#diffDiv").html(data.diffHtml);
          } else {
            alert("出错了：" + data.msg);
          }
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
      window.open('/project/exportExcel?' + para, '_blank ')
    })

    //clone
    $('.cloneButton').click(function() {
      var id = $(this).attr("data-id");
      window.location.href = '/mock/preClone/' + id;
    })

    ///////////////

  }
};
