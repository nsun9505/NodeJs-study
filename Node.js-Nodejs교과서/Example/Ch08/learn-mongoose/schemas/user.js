const mongoose = require('mongoose');

const { Schema } = mongoose;
const userShema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    married: {
        type: Boolean,
        required: true
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userShema);