"use strict"
/**
 * Created by leiyao on 16/12/5.
 */
var ldap = require('ldap-verifyuser');

var LDAP = {
    LOGIN: function (username, password) {
        return new Promise(function (resolve, reject) {
            let config = {
                server: conf.Access.ldapUrl,
                adrdn: conf.Access.ldapDomain,
                adquery: conf.Access.ldapQuery,
                debug: false,
                rawAdrdn: false
            };
            ldap.verifyUser(config, username, password, function (err, data) {
                if (err) {
                    //name  InvalidCredentialsError
                    //code  49
                    reject(err);
                } else {
                    //if (data.valid && !data.locked) {
                    // 目前登录成功返回用户名,email,电话号,工号
                    resolve({
                        displayName: data.raw.displayName,
                        email: data.raw.mail,
                        phone: data.raw.postOfficeBox || data.raw.telephoneNumber,
                        No: data.raw.postalCode
                    });
                    //} else {
                    //    reject(err);
                    //}
                    /*console.log('valid?', data.valid);
                     console.log('locked?', data.locked);
                     console.log('raw data available?', data.raw ? true : false);
                     console.log(data.raw)*/
                }
                //process.exit(data.status);
            });
        });
    }
};


module.exports = LDAP;