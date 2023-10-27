
const Topic = require("../models/topic");

class TopicController {
  // [GET] /topics/
  async index(req, res) {
    const topics = await Topic.find({}).lean().exec();
    return await res.json(topics);
  }

  // [GET] /topics/:id
  async getOneTopic(req, res) {
    const topic = await Topic.findOne({ _id: req.params.id }).lean().exec();
    return await res.json(topic);
  }

  // [POST] /topics/
  async add(req, res) {
    const topic = new Topic( req.body );
    await topic.save();

    return res.redirect('/topics');
  }

  // [PUT] /topics/:id
  async update(req, res) {
    await Topic.updateOne({ _id: req.params.id }, { $set: req.body });
    return res.redirect('/topics');
  }

  // [DELETE] /topics/:id
  async delete(req, res) {
    await Topic.deleteOne({ _id: req.params.id });
    return res.redirect('/topics');
  }

}

module.exports = new TopicController();
