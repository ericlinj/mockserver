ajaxmocker 介绍
=====
## ajaxmocker是什么？
前后端接口数据mock方案


## mocker能做什么？
1. 后端接口管理
2. 前端基于后端提供接口，通过ajax+json模拟后端服务


## 具体介绍
ajaxmocker 分为服务端与客户端

1. 服务端mockserver主要提供两个功能
  - 提供端接口维护
  - mockerclient跨域请求服务支持

2. 客户端mockclient主要提供
  - 本地mocker 启动配置
  - 加载后端接口数据到本地缓存
  - 基于配置与接口数据，对所有本地的ajax请求的拦截与转发（到mockserver）

## 后端开发同学配置接口：
1. 本地配置host


         10.134.70.205 mockserver.sogou-inc.com


2. 访问

  <http://mockserver.sogou-inc.com:81>

  `注意：如果提示没有权限，可以联系开发人员`

3. 新建接口

  按照superzone以往接口文档格式定义表单
4. 查询接口
  对建立接口进行查询

5. 验证输出数据的json格式与跨域访问是否正常

## 前端开发同学需要：
1. 安装ajaxmocker（目前仅支持cjs方式，有空把reqirejs和独立安装方式都处理一下）
component下安装方式:


        "dependencies": {
          "ericlinj/mocker": "*"
        }


2. 配置moker服务端的环境

页面中引入如下脚本


        var prjId = 1;//项目id，需要前往系统中注册获取
        <script src="http://mockserver.sogou-inc.com:81/mockrest/initMockContext?projectId="+prjId type="text/javascript" charset="utf-8"></script>







3. spa启动伊始进行初始化,需要在mock启动的回调中加入原有的启动脚本


        var Mocker = require('mocker');
            $(function () {
              //init mocker
              if(window.open_mocker && parseInt(window.open_mocker , 10) === 1){
                new Mocker().start(function(){
                  //your stuff ,such as boot,cache loading
                  router.init();
                });
              }else{
                  //your stuff ,such as boot,cache loading
                  router.init();
            }
              })


4. 启动client mocker完成
5. 对于不希望mock的ajax请求可以在mockserver中进行配置处理，配置完成后需要在client端浏览器属刷新页面生效

# 注意事项
1. mocker有缺陷，只能针对ajax的success作为options的filed进行处理，对于回调方式的sucess不支持，后续看有没有办法做个兼容处理。
    * 支持


      $.ajax({
        ....
        success :function(res){
        }
      })



    * 不支持


        $.ajax({}).success(function(){
          //....
        })



