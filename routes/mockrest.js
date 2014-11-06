var db = require("../models");
var _ = require("lodash");
var Sequelize = require("sequelize");
var moment = require("moment");
var util = require("./util");
var logger = require('./log4js.js');
var EJS = require('ejs');

var utcTime = util.utcTime
var memorize = util.memorize;
var getTaskEndTime = util.getTaskEndTime;
var getNowYYYYMMDDHHmmss = util.getNowYYYYMMDDHHmmss;

JSON.minify = JSON.minify || require("node-json-minify");

///////提供mock数据，外部接口调用
exports.doMock = function (req, res) {
    var url = req.url;
    var prefixLen = global.CONFIG.mocker_server_prefix.length + 2;
    var mockUrl = url.substr(url.indexOf('/' + global.CONFIG.mocker_server_prefix + '/') - 1 + prefixLen);
    mockUrl = mockUrl.substr(mockUrl, mockUrl.indexOf("?"))
    logger.info("mockUrl:" + mockUrl);

    db.mock_detail.find({
        where: {
            "url": mockUrl
        }
    })
        .success(function (mock_detail) {
            if (mock_detail) {
                var mockJson = JSON.minify(mock_detail.mock_json || mock_detail.result_json);
                try {
                    var mockJsonObj = JSON.parse(mockJson);
                    setTimeout(function () {
                        res.jsonp(mockJsonObj);
                    }, mock_detail.timeout || 0);
                } catch (e) {
                    logger.error(e);
                    res.jsonp({
                        "ERROR": "json格式错误"
                    });
                }
            }
        }).error(function (err) {
            logger.error(err);
            res.jsonp({
                "ERROR": err
            })
            return;
        });

};

exports.getMockDetails = function (req, res) {
    var project_id = req.param('project_id');
    var whereObj = {};
    if (project_id && parseInt(project_id, 10) === -1) {
        whereObj = {}
    } else {
        whereObj = {
            'project_id': project_id
        }
    }
    db.mock_detail.findAll({
        where: whereObj
    }).success(function (data) {
        res.jsonp(data);
    }).error(function (err) {
        logger.error(err);
        util.errorRender(res, err.code);
        return;
    });
};

exports.initMockContext = function (req, res) {
    var prjId = req.param("projectId");
    var contextScript , standAloneScript = "";
    if (prjId) {
        contextScript =
            ';window.mocker_server_host = "' + global.CONFIG.mocker_server_host + '";'
            + 'window.mocker_server_port = "' + global.CONFIG.server.port + '";'
            + 'window.openmocker = 1;'
            + 'window.mocker_server_prefix = "' + global.CONFIG.mocker_server_prefix + '";'
            + 'window.mocker_project_id = ' + prjId + ';';
        console.info(EJS.renderFile(
            './public/components/ericlinj-mocker/build/build.js',
            function (err, data) {
                if (err) logger.error(err)
                contextScript += data;
                res.send(contextScript);
            }));

    }
}
