var moment = require('moment');

exports.getTaskEndTime = function(task_begin_time, task_time_type) {
  var momentBegin = new moment(task_begin_time, 'YYYY-MM-DD HH:mm:ss')
  var task_end_time = momentBegin.add(task_time_type, 'd').format('YYYY-MM-DD HH:mm:ss');
  return task_end_time;
};

exports.getNowYYYYMMDDHHmmss = function() {
  return new moment().format('YYYY-MM-DD HH:mm:ss');
};
exports.getNowStrForVersion = function() {
  return new moment().format('YYYYMMDDHHmmss');
};
exports.utcTime = function(datetime) {
  return moment.utc(datetime);
};

exports.memorize = function(str, num) {
  var result;
  var namelen = str.replace(/[\u0080-\ufff0]/g, "xh").length;
  if (namelen <= num) return str;
  for (var i = num / 2, len = str.length; i < len; i++) {
    result = str.slice(0, i);
    if (result.replace(/[\u0080-\ufff0]/g, "xh").length >= (num - 1)) {
      return result + '...';
    }
  }
};

//同步情况下错误处理，渲染到500错误页面
exports.errorRender = function(res, err) {
  console.info("***********errorRender*******");
  res.render("500", {
    status: 500,
    error: err
  });
};

//ajax请求的错误处理
exports.errorAjax = function(res, err) {
  res.send({
    status: 500,
    errors: [err]
  });
};
