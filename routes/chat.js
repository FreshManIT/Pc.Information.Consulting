var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res,next) {
  res.render('chat', { title: '欢迎咨询' });
});

module.exports=router;