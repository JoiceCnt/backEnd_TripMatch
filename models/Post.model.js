const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const feedPostSchema = new Schema(
  {
    title: { type: String, required: true },
    comment: { type: String },
    author: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    trip: { 
      type: Schema.Types.ObjectId, 
      ref: 'Trip', 
      required: false 
    },
    includePreferences: { type: Boolean, default: true },
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
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

feedPostSchema.index({ author: 1, createdAt: -1 });

const FeedPost = model("FeedPost", feedPostSchema);
module.exports = FeedPost;
