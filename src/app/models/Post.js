const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const likeArr = new Schema({
    _id_users:{type:Schema.Types.ObjectId}
});
const CommentArr = new Schema({
    _id_users:{type:Schema.Types.ObjectId},
    comment:{type:String}
});
const Post = new Schema({
    _id_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{type:String},
    content:{type:String},
    time:{type:Date},
    img:{type:String},
    video:{type:String},
    likes:[likeArr],
    comments:[CommentArr]
},{
    timestamps:true,
});
Post.plugin(mongooseDelete,{ 
    overrideMethods: 'all',
    deletedAt : true 
 });
module.exports = mongoose.model('posts',Post);