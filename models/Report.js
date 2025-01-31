import mongoose from "mongoose";

const { Schema } = mongoose;

const reportsSchema = new Schema(
  {
    formname: { type: String, required: true },
    description: { type: String, required: true },
    detailmsg: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ReportsModel = mongoose.model("reportss", reportsSchema);

export default ReportsModel;
