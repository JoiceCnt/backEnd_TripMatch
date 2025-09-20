const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');


const feedPostSchema = new Schema(
    {
        title: { type: String, required: true },
        comment: { type: String },
        author: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true },
        trip: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Trip', 
            required: true },
        includePreferences: { type: Boolean, default: true},
        snapshot: {
            title: String,
            city: String,
            country: String,
            startDate: Date,
            endDate: Date,
            preferences: [String],
            heroImageUrl: String,
        },
        visibility: { type: String, enum: ["public", "friends", "private"], default: "public" },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        comments: [{
            user: { type: Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now }
            }],
    },
    {
        timestamps: true
    }
);

feedPostSchema.index({ author: 1, createdAt: -1 });

const feedPost = model("feedPost", feedPostSchema);

module.exports = feedPost;