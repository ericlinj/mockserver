var $ = require('jquery');
var Router = require('router');
var Mock = require('mock');
var Mocker = require('mocker');

// Router middleware

$(function() {
  new Mocker().start(function() {
    var router = new Router()
      .on('/mock/preAdd', Mock.preAdd)
      .on('/mock/preEdit/:id', Mock.preEdit)
      .on('/mock/list', Mock.list)
      .on('/', Mock.list)
      .start();
  });

});
