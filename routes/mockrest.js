var db = require("../models");
var _ = require("lodash");
var Sequelize = require("sequelize");
var moment = require("moment");
var util = require("./util");
var logger = require('./log4js.js');

var utcTime = util.utcTime
var memorize = util.memorize;
var getTaskEndTime = util.getTaskEndTime;
var getNowYYYYMMDDHHmmss = util.getNowYYYYMMDDHHmmss;

JSON.minify = JSON.minify || require("node-json-minify");

///////提供mock数据，外部接口调用
exports.doMock = function(req, res) {
  var url = req.url;
  var prefixLen = global.CONFIG.mocker_server_prefix.length + 2;
  var mockUrl = url.substr(url.indexOf('/' + global.CONFIG.mocker_server_prefix + '/') + prefixLen);
  mockUrl = mockUrl.substr(mockUrl, mockUrl.indexOf("?"))
  logger.info("mockUrl" + mockUrl);

  db.mock_detail.find({
    where: {
      "url": mockUrl
    }
  })
    .success(function(mock_detail) {
      if (mock_detail) {
        var mockJson = JSON.minify(mock_detail.mock_json);
        try {
          var mockJsonObj = JSON.parse(mockJson);
          res.jsonp(mockJsonObj);
        } catch (e) {
          logger.error(e);
          res.jsonp({
            "ERROR": "json格式错误"
          });
        }
      }
    })

};

exports.getMockDetails = function(req, res) {
  var project_id = req.param('project_id');
  db.mock_detail.findAll({
    where: {
      'project_id': project_id
    }
  }).success(function(data) {
    res.jsonp(data);
  })
};
