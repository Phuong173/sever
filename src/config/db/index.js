const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.connect('mongodb+srv://daophuong01072003:aS866N4miT3FymRs@cluster0.opyc2h1.mongodb.net/CookBook?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connection successful');
    }
    catch (err) {
        console.log('connection failed: ' + err.message);
    }
}

module.exports = { connect };