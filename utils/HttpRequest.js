/**
 * Created by leiyao on 16/12/12.
 */

var request = require('request');

module.exports = {
    get: request.get,
    post: request.post,
    put: request.put,
    "delete": request.delete
};