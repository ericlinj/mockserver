var moment = require('moment');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var logger = require('./log4js.js');
var mockData = require('../config/mockData');



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
