import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("comments", commentSchema);

export default CommentModel;
