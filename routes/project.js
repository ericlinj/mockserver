var db = require('../models');
var _ = require('lodash');
var Sequelize = require('sequelize');
var moment = require('moment');
var util = require('./util');
var logger = require('./log4js.js');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var XLSX = require('xlsx');
var ExcelWriter = require('../models/export/excelWriter');

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
  var prjName = req.param('project_name');
  if (prjName) {
    var fileName = 'interface-' + prjName + '.xlsx';
    var filePath = 'export/excel/';
    var fileUrl = filePath + fileName;
    try {
      XLSX.writeFile(ExcelWriter.getWorkbook(), fileUrl);
    } catch (err) {
      logger.error(err);
      util.errorRender(res, err);
    }

    res.download(fileName, fileName, function(err) {
      if (err) {
        logger.error(err);
        util.errorRender(res, err);
      }
    });

  } else {
    util.errorRender(res, "项目未指定");
  }
}
