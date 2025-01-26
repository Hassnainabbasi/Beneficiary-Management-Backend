import express from "express";
import userClear from "../models/OnlineUsers.js";
import UserModel from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, cnic, phone, address, purpose, tokenNo } = req.body;
  try {
    const existingUser = await UserModel.findOne({ cnic });
    if (existingUser) {
      return res.status(400).json({ message: "User with this CNIC already exists" });
    }

    const newUser = new UserModel({ name, cnic, phone, address, purpose, tokenNo });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/departmentStaff", async (req, res) => {
  const { tokenNo } = req.body;

  try {
    if (!tokenNo) {
      return res.status(400).json({ message: "Token number is required" });
    }

    const userData = await UserModel.findOne({ tokenNo });
    if (!userData) {
      return res.status(404).json({ message: "No user found with this token number" });
    }

    res.status(200).json({ message: "User data retrieved successfully", userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/userClear", async (req, res) => {
  const { userId, remarks, updateStatus } = req.body;

  if (!userId || !remarks || !updateStatus) {
    return res.status(400).json({
      success: false,
      message: "All fields (userId, remarks, updateStatus) are required.",
    });
  }

  try {
    const newUserClear = new userClear({
      userId,
      remarks,
      updateStatus,
    });

    const savedRecord = await newUserClear.save();

    return res.status(201).json({
      success: true,
      message: "User clearance updated successfully.",
      data: savedRecord,
    });
  } catch (error) {
    console.error("Error saving user clearance:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating user clearance.",
    });
  }
});

router.get("/register", async (req, res) => {
  try {
    const allUsers = await UserModel.find(); // Fetch all users from the database
    res.status(200).json({
      message: "All Users Data",
      users: allUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/onlineUsers", async (req, res) => {
  try {
    const onlineUsers = await OnlineUserModal.find(); // Fetch all users from the database
    res.status(200).json({
      message: "All Online Users Data",
      onlineUsers: onlineUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
})

router.delete("/login", async (req, res) => {
  const { user } = req.query

  const offlineUser = await OnlineUserModal.deleteOne({ userId: user[0].user._id });
  console.log("deleteUser=>", user[0].user._id)

  res.status(201).json({ message: "Signout successfully" });
})




export default router; 