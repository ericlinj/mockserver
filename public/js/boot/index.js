var $ = require('jquery');
var Router = require('router');
var Mock = require('mock');
var Mocker = require('mocker');

// Router middleware

$(function() {
  if (window.openmocker === 1) {
    new Mocker().start();
  } else {
    console.info("not support mocker")
  }

  var router = new Router()
    .on('/mock/preAdd', Mock.preAdd)
    .on('/mock/preEdit/:id', Mock.preEdit)
    .on('/mock/list', Mock.list)
    .start();

});
