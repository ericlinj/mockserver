var db = require('../models');
var _ = require('lodash');
var Sequelize = require('sequelize');
var moment = require('moment');
var util = require('./util');
var logger = require('./log4js.js');
var fs = require('fs');
var XLSX = require('xlsx');
var ExcelWriter = require('../models/export/excelWriter.js');

var utcTime = util.utcTime
var memorize = util.memorize;
var getTaskEndTime = util.getTaskEndTime;
var getNowYYYYMMDDHHmmss = util.getNowYYYYMMDDHHmmss;

////////////新建
exports.preAdd = function(req, res) {
  res.render('projectAdd', {})
};

exports.doAdd = function(req, res) {
  res.render('projectList', {})
};

exports.doDel = function(req, res) {
  res.render('projectList', {})
};

exports.list = function(req, res) {
  res.render('projectList', {})
};

//for projectlist in html select
exports.ajaxList = function(req, res) {
  db.mock_project.findAll()
    .success(function(details) {
      res.json(details)
    }).error(function(err) {
      logger.error(err);
      util.errorRender(res, err.code);
      return;
    });
}

exports.exportExcel = function(req, res) {
  var prjName = req.param('prjName');
  var prjId = req.param('prjId');
  if (prjId) {
    db.mock_detail.findAll({
      include: [db.mock_project],
      where: {
        'mock_project.id': prjId
      },
      order: [
        ['id', 'desc']
      ]
    })
      .success(function(details) {
        var excelData = [];
        excelData.push(['id','标题','接口url','输入参数','输出json','备注']);
        _.each(details, function(detail) {
          var dataItem = [];

          dataItem.push(detail.id);
          dataItem.push(detail.title);
          dataItem.push(detail.url);
          dataItem.push(detail.para_json);
          dataItem.push(detail.result_json);
          dataItem.push(detail.remark);

          excelData.push(dataItem);
        })

        var fileName = 'interface-' + prjName + '.xlsx';
        var filePath = 'export/excel/';
        var fileUrl = filePath + fileName;
        var excelWriter = new ExcelWriter(prjName , excelData);
        try {
          XLSX.writeFile(excelWriter.getWorkbook(), fileUrl);
        } catch (err) {
          logger.error(err);
          util.errorRender(res, err);
        }

        res.download(fileUrl, fileName, function(err) {
          if (err) {
            logger.error(err);
            util.errorRender(res, err);
          }
        });
      }).error(function(err) {
        logger.error(err);
        util.errorRender(res, err.code);
        return;
      });
  } else {
    util.errorRender(res, "项目未指定");
  }
}
