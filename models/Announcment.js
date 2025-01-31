import mongoose from "mongoose";

const { Schema } = mongoose;

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AnnouncementModel = mongoose.model("announcements", announcementSchema);

export default AnnouncementModel;
