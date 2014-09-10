//demo
var $ = require('jquery');
var JsonEditor = require('jsoneditor');
var JsonMinify = require('jsonminify');
var jsonMinify = new JsonMinify;
var Dialog = require('dialog');

exports.preAdd = function(context, next) {
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })
  initJsonCheck();
};
exports.preEdit = function(context, next) {
  var me = this;
  ///////cancel
  $('.cancel').click(function() {
    window.location.href = "/mock/list";
  })

  initJsonCheck();
};

function initJsonCheck() {
  var me = this;
  //////jsoncheck
  var container = document.getElementById('mockjson');
  this.showDialog = new Dialog("json格式验证", container).closable();
  //jsonEditor
  var jsonEditor = new JsonEditor(container, {
    mode: "view"
  });
  $("#jsonCheck").click(function() {
    var jsondata = $("#mock_json").val();
    var minifyJson = jsonMinify.minify(jsondata);
    try {
      var mockJsonObj = JSON.parse(minifyJson);
      jsonEditor.set(mockJsonObj);
    } catch (e) {
      jsonEditor.set({
        "ERROR": "json格式错误"
      });
    }
    me.showDialog.show();

  })
}
//弹框

exports.list = function(context, next) {
  var container = document.getElementById('mockjson');
  var me = this;
  //dialog
  me.showDialog = new Dialog("跨域mockrest验证", container).closable();
  //jsonEditor
  var jsonEditor = new JsonEditor(container, {
    mode: "view"
  });
  $(".mockButton").click(function() {
    var url = $(this).attr("data-url");
    $.ajax({
      url: url,
      success: function(data) {
        jsonEditor.set(data);
        me.showDialog.show();

      }
    });
  })
};
