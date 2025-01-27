import mongoose from "mongoose";

const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.model("admins", adminSchema);

export default AdminModel;
