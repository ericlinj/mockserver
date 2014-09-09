var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  _ = require('lodash'),
  dbConfig = require('../config/dbConfig.json'),
  logger = require('../routes/log4js.js');

var env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
var db_env = dbConfig[env];
// logger.info("current env is: " + env + ", and dbconfig is as following ...");
// logger.info(db_env);

var sequelize = new Sequelize(
  db_env.db,
  db_env.username,
  db_env.pwd, {
    host: db_env.host,
    port: db_env.port,
    pool: {
      maxConnections: db_env.maxConnections,
      maxIdleTime: db_env.maxIdleTime,
      validateConnection: function(r) {
        console.info(r);
      }
    }
  }),
db = {};

global.SEQUELIZE = sequelize;

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) == '.js'));
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
