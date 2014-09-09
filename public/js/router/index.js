var Backbone = require('backbone');
var $ = require("jquery");

Backbone.$ = $;

var MockServer = {
  Layout: {},
  Views: {},
  Collections: {},
  Models: {},
  widgets: {},
  currentView: null,
  router: null
};

MockServer.Router = Backbone.Router.extend({
  //路由规则
  routes: {
    "/demo": "demo",
  },

  //初始化
  initialize: function() {

  },

  demo: function() {

  }

});

window.MockServer = MockServer;

exports.init = function() {
  //实例化Router
  MockServer.router = new MockServer.Router();
  //开始监听hash

  Backbone.history.start();
};
