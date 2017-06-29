/**
 * Created by leiyao on 16/12/12.
 */


var express = require('express');
var router = express.Router();

var request = require('../utils/HttpRequest');
var Utils = require('../utils/utils');

/* 登录过滤 */
router.all('/*', function (req, res, next) {
    if (!req.session.user) {
        Utils.jsonp(res, conf.StatusCode.NOT_LOGIN, "用户未登录",req.query.callback);
    } else {
        next();
    }
});

var getRequestUri = function (name) {
    return conf.API.URL + name;
};

/**
 * 获取audience列表
 */
router.get('/get_audiences', function (req, res, next) {
    request.get(getRequestUri('Audiences'), function (err, response, body) {
        //TODO 记录操作结果
        if (err) {
            Utils.jsonp(res, conf.StatusCode.API_INVOKE_FAIL, err, req.query.callback);
        } else {
            try {
                Utils.jsonp(res, conf.StatusCode.OK, JSON.parse(body), req.query.callback);
            } catch (ex) {
                Utils.jsonp(res, conf.StatusCode.API_INVOKE_FORMAT_FAIL, body, req.query.callback);
            }
        }
    })
});


module.exports = router;
