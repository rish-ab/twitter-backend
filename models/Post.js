const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    post: { type: String, required: true },
    image: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true}
});


module.exports = mongoose.model('Post', postSchema);