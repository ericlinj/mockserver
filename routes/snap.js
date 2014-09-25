var db = require('../models');
var _ = require('lodash');
var Sequelize = require('sequelize');
var moment = require('moment');
var util = require('./util');
var logger = require('./log4js.js');
var Jsondiffpatch = require('jsondiffpatch');

var utcTime = util.utcTime
var memorize = util.memorize;
var getTaskEndTime = util.getTaskEndTime;
var getNowYYYYMMDDHHmmss = util.getNowYYYYMMDDHHmmss;
///////////////
var jsondiffpatch = Jsondiffpatch.create({
  objectHash: function(obj) {
    return obj._id || obj.id;
  },
  arrays: {
    detectMove: true,
    includeValueOnMove: false
  },
  textDiff: {
    minLength: 60
  }
});

exports.record = function(detail_id, title, url, para_json, result_json, remark, creater) {
  var snap = {
    "detail_id": detail_id,
    "content": JSON.stringify({
      "标题": title,
      "URL": url,
      "入参": para_json,
      "输出": result_json,
      "备注": remark
    }),
    "creater": creater,
    "create_time": utcTime(getNowYYYYMMDDHHmmss())
  };

  db.detail_snap.create(snap).success(
    function() {
      logger.info("record detail snap:" + snap);
    }
  ).error(function(err) {
    logger.error(err);
    return;
  });
};
exports.diff = function(req, res) {
  db.detail_snap.findAll({
    where: {
      'detail_id': req.param('id')
    },
    order: [
      ['id', 'desc']
    ],
    limit: 2
  })
    .success(function(details) {
      var diffHtml = "no diff";
      if (details && details.length === 2) {
        var left = JSON.parse(details[0].dataValues.content);
        var right = JSON.parse(details[1].dataValues.content);
        try {
          var delta = jsondiffpatch.diff(right, left);
          diffHtml = Jsondiffpatch.formatters.html.format(delta, left);
          logger.info(diffHtml)
        } catch (e) {
          logger.error(e);
          diffHtml = e;
        }
      }
      res.json({
        "status": 1,
        "diffHtml": diffHtml
      })
    }).error(function(err) {
      logger.error(err);
      res.json({
        "status": 500,
        "msg": err
      })
    });

}
