/**
 * Created by leiyao on 16/4/6.
 */
require('./DateUtils');
var Utils = {
    "response":function(res,status,content){
        var cnt = 0;
        if(status.code != conf.StatusCode.OK.code && content){
            if (content instanceof Error) {
                content = content.stack;
            }
        }else if (content && content.constructor == Array){
            cnt = content.length;
        }
        var response = {
            header:{
                code:status.code,
                msg:status.msg
            },
            body:content
        };
        if (cnt){
            response.header.count = cnt;
        }
        res.json(response);
    },
    "jsonp":function (res,status,content,callback) {
        var cnt = 0;
        if(status.code != conf.StatusCode.OK.code && content){
            if (content instanceof Error) {
                content = content.stack;
            }
        }else if (content && content.constructor == Array){
            cnt = content.length;
        }
        var response = {
            header:status,
            body:content
        };
        if (cnt){
            response.header.count = cnt;
        }
        callback = callback || 'unspecify';

        var s = callback + '(' + JSON.stringify(response) + ')';
        res.send(s);
    },
    "objectCopy":function(source,target){
        for(var key in target){
            if (target.hasOwnProperty(key)){
                source[key] = target[key];
            }
        }
    }
};

module.exports = Utils;
