/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var serveStatic = require('serve-static');
var markdown = require('markdown-js');
var fs = require('fs');

//local dependencies
var db = require('./models');
var logger = require('./routes/log4js.js');

//routes ...
var routes = require('./routes');
var mock = require('./routes/mock');
var project = require('./routes/project');
var mockrest = require('./routes/mockrest');
// load global config
var yaml = require('node-yaml-config');
var CONFIG = yaml.load('./config/base.yaml');
global.CONFIG = CONFIG;

//express application
var app = module.exports = express();
var env = global.appEnv = CONFIG.ENV = app.get('env');

// all environments
app.set('port', CONFIG.server.port || process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('md', function(path, options, fn) {
  fs.readFile(path, 'utf8', function(err, str) {
    if (err) return fn(err);
    str = markdown.parse(str).toString();
    fn(null, str);
  });
});
app.use(morgan('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser('stars app'));
app.use(session({
  secret: 'keyboard cat',
  key: 'sid',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(serveStatic(path.join(__dirname, 'public')));

// env deal , there two env config to use
// jpassport is sogou's oss ,use jpassport-sp cookie to store user
app.locals.title = CONFIG.website.title;

//////////////
app.locals.mocker_server_host = CONFIG.mocker_server_host;
app.locals.mocker_server_port = CONFIG.server.port;
app.locals.mocker_server_prefix = CONFIG.mocker_server_prefix;
app.locals.mocker_project_id = CONFIG.mocker_project_id;
app.locals.openmocker = 1;

///////////////node_env
if ('development' === env) {
  logger.setLevel(CONFIG.logger.level.development);
  logger.configure({
    appenders: [{
      type: 'console'
    }]
  });
  //development only
  app.use(require('errorhandler')());
  app.use(function(req, res, next) {
    app.locals.openmocker = 1; //mock is support!
    res.locals.username = 'ligangbj7466_dev';
    req.session.user = {
      username: 'ligangbj7466_dev'
    };
    next();
  });
} else if ('production' === env) {
  //生产环境打印错误到指定目录下
  logger.setLevel(CONFIG.logger.level.production);
  logger.configure("./config/log4js.json", {});

  app.use(function(req, res, next) {
    if (isMockRest(req)) {
      next();
    } else {
      dealPassport(req, res, next)
    }

  });
}

//mockrest请求不限制jpassport
function isMockRest(req) {
  req.url.indexOf('mockrest') != -1
}

function dealPassport(req, res, next) {
  if (req.cookies && req.cookies['jpassport-sp']) {
    var cookieJp = req.cookies['jpassport-sp'];
    var cookiename = cookieJp.match(/username:(\w+@sogou-inc.com),/i)[1];
    console.info("jpassport cookie user: " + cookiename);

    db.User.find({
      where: {
        "user_name": cookiename
      }
    }).success(function(user) {
      if (user) {
        res.locals.username = cookiename;
        req.session.user = {
          username: cookiename
        };
        next();
      } else {
        var err = new Error('not a valid user!');
        err.status = 403;
        next(err);
      }
    });
  } else {
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
  }
}

//logic routers
app.get('/', mock.list);
app.get('/mock/preAdd', mock.preAdd);
app.post('/mock/doAdd', mock.doAdd);
app.get('/mock/list', mock.list);
app.get('/mock/preEdit/:id', mock.preEdit);
app.post('/mock/doEdit', mock.doEdit);
app.get('/mock/doDel', mock.doDel);

app.get('/project/preAdd', project.preAdd);
app.post('/project/doAdd', project.doAdd);
app.get('/project/doDel', project.doDel);
app.get('/project/list', project.list);
app.get('/project/ajaxList', project.ajaxList);

app.get('/logout', routes.logout);

/////////////demo
app.get('/demo', mock.demo);
app.get('/md/intro', function(req, res) {
  res.render('intro.md', {
    layout: false
  });
});

//////////////外部接口调用
app.get('/mockrest/initMockContext', mockrest.getMockDetails);
app.get('/mockrest/getMockDetails', mockrest.getMockDetails);
app.get('/mockrest/*', mockrest.doMock);

// 404
app.get('*', function(req, res) {
  res.render('404.ejs', {
    title: 'No Found - ' + CONFIG.website.title,
    username: req.session.user
  });
});

//500 Error Handler.
app.use(function(err, req, res, next) {
  logger.error("Something went wrong: " + err);
  res.render('500', {
    status: err.status || 500,
    error: err
  });
});

//Sequelize
db.sequelize.sync({
  force: false
}).complete(function(err) {
  if (err) {
    logger.error(err);
    throw err;
  } else {
    app.listen(app.get('port'), function(e) {
      logger.info('Express server start success and listening on port [' + app.get('port') + '] in [' + app.get("env") + '] mode.');
    });
  }
});
