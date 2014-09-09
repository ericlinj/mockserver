var log4js = require('log4js');
var logger = log4js.getLogger();

exports.configure = function(configJsonFile, config) {
  log4js.configure(configJsonFile , config)
}

exports.setLevel = function(level) {
  logger.setLevel(level)
}

exports.error = function(err) {
  logger.error(err);
}

exports.trace = function(err) {
  logger.trace(err);
}
exports.debug = function(err) {
  logger.debug(err);
}
exports.info = function(err) {
  logger.info(err);
}
exports.fatal = function(err) {
  logger.fatal(err);
}
exports.warn = function(err) {
  logger.warn(err);
}
