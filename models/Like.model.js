const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, post: 1 }, { unique: true }); 
// evita que un user dé like dos veces al mismo post

const Like = model("Like", likeSchema);
module.exports = Like;
