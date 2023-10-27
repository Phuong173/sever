const express = require('express');
const router = express.Router();
const topicController = require('../app/controller/TopicController');

router.delete('/:id', topicController.delete)

router.put('/:id', topicController.update);

router.post('/', topicController.add);

router.get('/:id', topicController.getOneTopic);

router.get('/', topicController.index);

module.exports = router;