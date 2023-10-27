const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
//nguyên liệu
const ingredientSchema = new Schema({
    name: { type: String },
    img_url: { type: String },
    quantity: { type: String },
});
//commen hoặc là bình luận
const reviewSchema = new Schema({
    star: { type: String },
    _id_user: { type: Schema.Types.ObjectId },
    comment: { type: String },
});

const Recipes = new Schema({
    _id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _id_post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    name_food: { type: String },
    img_url: { type: String },
    video_url: { type: String },
    time: { type: String },
    making:{type: String},
    ingredient: [ingredientSchema],
    evaluate: [reviewSchema],
}, {
    timestamps: true,
});
Recipes.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
module.exports = mongoose.model('recipes', Recipes);