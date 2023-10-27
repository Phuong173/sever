var express = require('express');
var router = express.Router();
var spController = require('../app/controller/home.controller')



router.get('/',  spController.index);


module.exports = router;