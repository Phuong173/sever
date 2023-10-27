const { type } = require("@hapi/joi/lib/extend")
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{required: true, type:String},
    email:{required: true, type:String},
    password:{required: true, type:String},
    phone:{required: true, type: Number},
    date:{required:true, type:String},
    avatar:{required:true, type: String},
})
// Biên dịch mô hình từ schema
module.exports = mongoose.model('User', userSchema)