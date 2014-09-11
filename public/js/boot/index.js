var $ = require('jquery');
var Router = require('router');
var Mock = require('mock');
var Mocker = require('mocker');


if (typeof console == "undefined") {
  this.console = { log: function () {} };
}

// Router middleware

$(function() {
  if (window.openmocker === 1) {
    new Mocker().start();
  } else {
    console.info("not support mocker!!!")
  }

  var router = new Router()
    .on('/mock/preAdd', Mock.preAdd)
    .on('/mock/preEdit/:id', Mock.preEdit)
    .on('/mock/list', Mock.list)
    .on('/', Mock.list)
    .start();

});
