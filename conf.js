/**
 * Created by leiyao on 16/12/5.
 */


var Config = {
    Access: {
        ldapUrl: "ldap://ldap.letv.cn",
        ldapQuery: "dc=letv,dc=LOCAL",
        ldapDomain: "letv\\"
    },
    StatusCode: {
        "OK": {code: 0, msg: '操作成功'},
        "ARGUMENTS_ERROR": {code: 1, msg: "请求参数不正确"},
        "NOT_LOGIN": {code: 10, msg: "未登录"},
        "API_INVOKE_FAIL": {code: 20, msg: "API调用失败"},
        "API_INVOKE_FORMAT_FAIL": {code: 21, msg: "API返回数据格式不正确"},
        "LDAP_PASS": {code: 1000, msg: "LDAP验证通过"},
        "LDAP_FAIL": {code: 1001, msg: "LDAP验证失败"}
    },
    SESSION_REDIS: {
        port: 6379,
        host: '10.150.160.136'
    },
    API:{
        URL:"http://10.140.45.181:9020/"
    }
};

global.conf = Config;

module.exports = Config;
