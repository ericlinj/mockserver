mockserver
=====

ajaxmocker

ajaxmocker是什么？
ajax数据mock方案


mocker能做什么？
1）后端接口管理
2）前端基于后端提供接口，通过ajax+json模拟后端服务


具体介绍
ajaxmocker 分为服务端与客户端

服务端mockserver主要提供两个功能
1）提供前、后端接口维护
2）mocker 客户端跨域请求支持

客户端mockclient主要提供
1）本地mocker 启动配置
2）加载前后端接口数据到本地
2）基于配置与接口数据，对所有本地的ajax请求的拦截与转发（到mockserver）

后台开发同学需要关注：
1）本地配置host
mockserver.sogou-inc.com  10.134.70.205
2)访问
http://mockserver.sogou-inc.com:3333
如果提示没有权限，可以联系开发人员
3）新建接口
4）查询接口
5）验证输出数据的json格式与跨域访问是否正常

前端开发同学需要：
1）安装ajaxmocker（TODO,目前仅支持cjs方式，有空把reqirejs和独立安装方式都处理一下）
component下安装方式

"dependencies": {
    ...
    "ericlinj/mocker": "*"
  }
2）给出一个全局的oper-mocker参数：0-关闭；1-开启，建议通过后端的maven profile配置给出,仅仅在dev环境下给出，防止影响qa和product环境访问
3）spa启动伊始进行初始化

  var Mocker = require('mocker');
  if (parseInt(window.openmocker , 10) === 1) {
    new Mocker().start();
  }
4)启动client mocker完成
5)对于不希望mock的ajax请求可以在mockserver中进行配置处理，配置完成后需要在client端浏览器属刷新页面生效


