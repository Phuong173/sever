var express = require('express');
var router = express.Router();
var spController = require('../app/controller/post.controller')



router.get('/',  spController.post);


module.exports = router;