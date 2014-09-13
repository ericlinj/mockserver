var AppUtil = {},
  $ = require('jquery');




//缓存定义
AppUtil.Cache = {};


//常量定义
AppUtil.CONST = {};




//工具方法

AppUtil.initProjectSelect = function(selectName , curPrjId){
  $.ajax({
    url: '/project/ajaxList',
    type: 'get',
    success: function(data) {
      var optHtml = '';
      $(data).each(function(idx, item) {
        if (curPrjId && parseInt(curPrjId, 10) === parseInt(item.id, 10)) {
          optHtml += '<option value=' + item.id + ' selected="selected">' + item.name + '</option>'
        } else {
          optHtml += '<option value=' + item.id + '>' + item.name + '</option>'
        }
      });
      $("select[name="+selectName+"]").html(optHtml);
    }
  })
}







module.exports = AppUtil;
