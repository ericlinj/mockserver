//demo
var $ = require('jquery');
var JsonEditor = require('jsoneditor');
var Dialog = require('dialog');

exports.preAdd = function(context, next) {
  $('.cancel').click(function(){
    window.location.href = "/mock/list";
  })
};
exports.preEdit = function(context, next) {
  $('.cancel').click(function(){
    window.location.href = "/mock/list";
  })
};

//弹框

exports.list = function(context, next) {
  var container = document.getElementById('mockjson');
  var me = this;
  //dialog
  me.showDialog = new Dialog("mockJsonObject", container).closable();
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
        // me.showDialog.modal();
        me.showDialog.show();

      }
    });
  })
};
