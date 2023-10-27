const express = require('express');
const router = express.Router();
const userController = require('../app/controller/UserController');
const upload = require('../app/util/upload_file');

router.get('/', userController.getAllUser);

router.get('/:id', userController.getOneUser);

router.put('/setup/:id',upload.single('file'),userController.update);

router.put('/edit/:id',upload.single('file'),userController.edit);

router.delete('/:id', userController.delete)

router.post('/login',userController.login);

router.post('/register', userController.register);

module.exports = router;