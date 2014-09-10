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
    })
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
  );
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
    })
};

exports.doEdit = function(req, res) {
  db.mock_detail.update({
    url: req.param('url') || '',
    title: req.param('title') || '',
    para_json: req.param('para_json') || '',
    mock_json: req.param('mock_json') || '',
    remark: req.param('remark') || '',
    is_mock: req.param('is_mock') || '1',
    project_id: req.param('project_id'),
    update_time: utcTime(getNowYYYYMMDDHHmmss()),
  }, {
    'id': req.param('id')
  }).success(
    function() {
      res.redirect('list')
    }
  );
};

exports.doDel = function(req, res) {
  res.render('mockList', {})
};

exports.list = function(req, res) {
  var data = [];
  var q_url = req.param('q_url') || '';

  db.mock_detail.findAll({
    where: {
      'url': {
        like: ('%' + q_url + '%')
      }
    },
    order: [
      ['id', 'desc']
    ]
  })
    .success(function(details) {
      _.each(details, function(detail) {
        detail.create_time_showStr = new moment(utcTime(detail.create_time)).format('YYYY-MM-DD HH:mm:ss');
        detail.is_mock_showStr = parseInt(detail.is_mock, 10) === 1 ? '是' : '否';
      })

      logger.info(details);
      res.render('mockList', {
        details: details,
        q_url: q_url
      })
    })
};
