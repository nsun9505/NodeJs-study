const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const commentsSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    comments: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Comment', commentsSchema);