部署文档
============

描述nodejs web应用与jpassport整合部署

###1.apache安装以及jpassport in apache模块整合列表项目###

1. 安装apache（2.2.27版本）
2. 安装passport模块（\jpassport-module\jpassport-module\binary\JPassport-Client-Apache20-Module-1.2.1-1.x86_64.rpm）
3. 修改安装后的模块配置**/usr/local/passport_apache_2x/conf/jpassport.conf**为如下内容：

        JPassportClientPath            "/usr/local/passport_apache_2x"
        JPassportIDPUrl               "http://passport.sogou-inc.com"
        JPassportAuthenticationURL    "https://passport.sogou-inc.com/AuthorizationDecision"

4. apache中配置反向代理（其中ServerName需要配置为线上机器域名，代理到本地的3003端口，该端口对应nodejs webapp 启动端口）apache的**httpd.conf**中增加如下配置

        <VirtualHost *:80>
                ServerAdmin ericlixj@163.com
                ServerName localhost
                ProxyRequests Off
                <Proxy *>
                        Order deny,allow
                        Allow from all
                </Proxy>
                ProxyPass / http://127.0.0.1:3003/
                ProxyPassReverse / http://127.0.0.1:3003/
                            #for passport
                JPassportEnable on
                JPassportRootPathURI "/"
                JPassportShortUserName on
                JPassportFilter ".*"
        </VirtualHost>
        Include /usr/local/passport_apache_2x/conf/jpassport.conf


5. 配置后重新启动apache即可

        apachectl -k  restart -e DEBUG


####1.1Q&A####

1.安装passport模块rpm时报依赖异常,可以尝试强制，不依赖方式安装

    rpm -ivh JPassport-Client-Apache20-Module-1.2.1-1.x86_64.rpm --force --nodeps

2.开发host配置:

    10.134.70.205 stars.sogou-inc.com

###2.node web app 安装###
####1. 下载stars源码####

            git clone https://github.com/foriacus/stars.git

####2. 安装node依赖####

            npm install

####3. 配置数据库与日志####
#####3.1 生产环境日志：#####
调整生产环境日志级别请查看

        {webRoot}/config/base.yaml 中针对logger的production配置，默认为error级别

        default:
          server:
            port: 3003
          website:
            title: '搜狗受众分析平台'
          wwwroot: 'data'
          reservedWords: ''
          logger:
            level:
              development: 'DEBUG'
              production: 'ERROR'



日志打印位置(如若不存在需要提前手动建立):

        /usr/local/stars/logs

        按日期进行分割


#####3.2 数据库配置 #####

        修改{webRoot}/config/dbConfig.json 配置

        {
          "development": {
            "host": "10.134.70.205",
            "db": "stars",
            "username": "bard",
            "pwd": "bard",
            "port": "3306",
            "maxConnections": 5,
            "maxIdleTime": 30
          },

          "production": {
            "host": "10.134.70.205",
            "db": "stars",
            "username": "bard",
            "pwd": "bard",
            "port": "3306",
            "maxConnections": 5,
            "maxIdleTime": 30
          }
        }

####4.生产环境####

            NODE_ENV=production forever start -l forever-stars.log -a -w app.js
            tail -f ~/.forever/forever-stars.log















