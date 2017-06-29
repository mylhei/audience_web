var express = require('express');
var router = express.Router();
var ldap = require('../utils/LdapLogin');

var User = require('../model/User');

var Utils = require('../utils/utils');


/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query.username && req.query.password) {
        ldap.LOGIN(req.query.username, req.query.password).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.end('登录失败');
        });
    } else {
        res.send('未录入用户名,密码,录入规则:/users?username=&password=');
    }
});

/**
 * 登录接口
 */
router.post('/signin', function (req, res, next) {
    var user = new User(req.body.username, req.body.password);

    //TODO: 记录登录接口
    if (user.username && user.password) {
        ldap.LOGIN(user.username, user.password).then(function (data) {
            user.displayName = data.displayName;
            user.email = data.email;
            user.phoneNumber = data.phone;
            user.UserId = data.No;
            delete user.password;
            req.session.user = user;
            Utils.response(res, conf.StatusCode.OK, user);
        }).catch(function (err) {
            console.log(err);
            Utils.response(res, conf.StatusCode.LDAP_FAIL, "登录失败,请检查用户名密码");
        });
    } else {
        Utils.response(res, conf.StatusCode.ARGUMENTS_ERROR,"用户名密码不可为空.");
    }
});

/**
 * 注销接口
 */
router.get('/logout',function(req,res,next){
    req.session.user = null;
    res.json({});
});

module.exports = router;
