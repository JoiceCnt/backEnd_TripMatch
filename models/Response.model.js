const { Schema, model } = require('mongoose');

const responseSchema = new Schema (
    {
        content: { type: String, required: true },
        author: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true },
        post: { 
            type: Schema.Types.ObjectId, 
            ref: 'Post', 
            required: true }
    },
    {
        timestamps: true
    }
);

const Response = model("Response", responseSchema);

module.exports = Response;