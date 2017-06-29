var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session && req.session.user) {
        res.render('index', {title: 'Audience', layout: 'layout', curUser: JSON.stringify(req.session.user)});
    } else {
        res.render('index', {title: 'Audience', layout: 'layout', curUser: JSON.stringify({})});
    }
});


module.exports = router;
