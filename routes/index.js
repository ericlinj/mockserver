var moment = require('moment');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');


exports.login = function(req, res) {
  res.render('login', {});
};

exports.logout = function(req, res) {
  if(CONFIG.ENV === 'production') {
    var callbackUrl = 'http://' + req.headers['x-forwarded-host'] + "/";
    res.cookie('jpassport-sp', '', { path: '/', maxAge:'0' });
    req.session.destroy(function() {
      res.redirect('https://passport.sogou-inc.com/logout.jsp?url=' + callbackUrl);
    });
  }
};

exports.about = function(req, res) {
  res.render('about', {
  });
};
