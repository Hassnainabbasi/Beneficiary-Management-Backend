import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    cnic: { type: String, unique: true, required: true }, // CNIC as a unique identifier
    phone: { type: String, required: true }, // Phone number
    address: { type: String, required: true }, // Address of the user
    purpose: { 
      type: String, 
      required: true 
    },
    tokenNo: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
