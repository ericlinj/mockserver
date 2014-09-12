var db = require('../models');
var _ = require('lodash');
var Sequelize = require('sequelize');
var moment = require('moment');
var util = require('./util');
var logger = require('./log4js.js');

var utcTime = util.utcTime
var memorize = util.memorize;
var getTaskEndTime = util.getTaskEndTime;
var getNowYYYYMMDDHHmmss = util.getNowYYYYMMDDHHmmss;

////////进入demo页面
exports.demo = function(req, res) {
  var urls = [];
  db.mock_detail.findAll()
    .success(function(details) {
      _.each(details, function(detail) {
        urls.push(detail.url);
      })

      res.render('demo', {
        urls: urls
      });
    }).error(function(err) {
      logger.error(err);
      util.errorRender(res, err.code);
      return;
    });
};

////////////新建
exports.preAdd = function(req, res) {
  res.render('mockAdd', {})
};

exports.doAdd = function(req, res) {
  db.mock_detail.create({
    url: req.param('url') || '',
    title: req.param('title') || '',
    para_json: req.param('para_json') || '',
    result_json: req.param('result_json') || '',
    mock_json: req.param('mock_json') || '',
    remark: req.param('remark') || '',
    is_mock: req.param('is_mock') || '1',
    project_id: req.param('project_id'),
    creater: req.session.user.username,
    create_time: utcTime(getNowYYYYMMDDHHmmss()),
  }).success(
    function() {
      res.redirect('list')
    }
  ).error(function(err) {
    logger.error(err);
    util.errorRender(res, err.code);
    return;
  });;
};

exports.preEdit = function(req, res) {
  db.mock_detail.find({
    where: {
      'id': req.param('id')
    }
  })
    .success(function(detail) {
      logger.info('preEdit:' + detail);
      res.render('mockEdit', {
        detail: detail
      })
    }).error(function(err) {
      logger.error(err);
      util.errorRender(res, err.code);
      return;
    });
};

exports.doEdit = function(req, res) {
  var isStay = req.param('is_stay');
  db.mock_detail.update({
    url: req.param('url') || '',
    title: req.param('title') || '',
    para_json: req.param('para_json') || '',
    result_json: req.param('result_json') || '',
    mock_json: req.param('mock_json') || '',
    remark: req.param('remark') || '',
    is_mock: req.param('is_mock') || '1',
    project_id: req.param('project_id'),
    update_time: utcTime(getNowYYYYMMDDHHmmss()),
  }, {
    'id': req.param('id')
  }).success(
    function() {
      if (isStay && parseInt(isStay, 10) === 1) {
        res.json({
          status: 1
        });
      } else {
        res.redirect('list')
      }
    }
  ).error(function(err) {
    logger.error(err);
    if (isStay && parseInt(isStay, 10) === 1) {
      res.json({
        status: 500,
        msg: err
      });
    } else {
      util.errorRender(res, err.code);
    }
    return;
  });
};

exports.doDel = function(req, res) {
  res.render('mockList', {})
};

exports.list = function(req, res) {
  var data = [];
  var q_url = req.param('q_url') || '';
  var q_project = req.param('q_project') || 1;

  db.mock_detail.findAll({
    include: [db.mock_project],
    where: {
      'url': {
        like: ('%' + q_url + '%')
      },
      'mock_project.id': q_project
    },
    order: [
      ['id', 'desc']
    ]
  })
    .success(function(details) {
      //logger.info(details);
      _.each(details, function(detail) {
        detail.create_time_showStr = new moment(utcTime(detail.create_time)).format('YYYY-MM-DD HH:mm:ss');
        detail.is_mock_showStr = parseInt(detail.is_mock, 10) === 1 ? '是' : '否';
      })

      res.render('mockList', {
        details: details,
        q_url: q_url,
        q_project: q_project
      })
    }).error(function(err) {
      logger.error(err);
      util.errorRender(res, err.code);
      return;
    });
};
