var express = require('express');
var router = express.Router();
var spController = require('../app/controller/login.controller')


//lấy danh sách
router.get('/',  spController.login_i);


module.exports = router;