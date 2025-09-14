const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true },
        trip: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Trip', 
            required: true }
    },
    {
        timestamps: true
    }
);

const Post = model("Post", postSchema);

module.exports = Post;