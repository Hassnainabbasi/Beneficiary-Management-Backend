import express from "express";
import UserModel from "../models/Users.js";
import AdminModel from "../models/AdminModal.js";
import userClear from "../models/OnlineUsers.js";
import AnnouncementModel from "../models/Announcment.js";
import CommentModel from "../models/Comments.js";
import ReportsModel from "../models/Report.js";

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
  
router.get("/register", async (req, res) => {
  try {
    const allUsers = await UserModel.find(); // Fetch all users from the database
    res.status(200).json({
      message: "All Users Data",
      users: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/register/:id", async (req, res) => {
  const { id } = req.params; // Make sure this matches the URL path
  const { name, cnic, phone, address, purpose, tokenNo } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, cnic, phone, address, purpose, tokenNo },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/register/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admins" ,async (req,res) =>{

  const {email, password} = req.body
  if (!email || !password ) {
    return res.status(400).json({
      success: false,
      message: "All fields (userId, remarks, updateStatus) are required.",
    });
  }

  try {
    // Ensure you await the result of the database query
    const admin = await AdminModel.findOne({ email });
  
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }
  
    // Check if the provided password matches the one stored in the database
    if (admin.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }
  
    // If the email and password match
    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      data: admin,
    });
  } catch (error) {
    console.error(error); // Log the error to the server console for debugging
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      data: null,
    });
  }
  
})

router.get("/admins", async (req, res) => {
  try {
    const alladmin = await AdminModel.find(); // Fetch all users from the database
    res.status(200).json({
      message: "All Users Data",
      users: alladmin
    });
  } catch (error) {
    console.error("Error fetching users:", error);
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

router.post("/announcment", async (req, res) => {
  const { title, summary, reason, } = req.body;
  try {
    if ((!title, !summary, !reason)) {
      return res.status(400).json({ message: "All Fields are required" });
    }
   const newAnnouncement = new AnnouncementModel({
    title, summary, reason
    });
    await newAnnouncement.save();

    res.status(201).json({ message: "Announcement S successfully", data: newAnnouncement });
  }
  catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
   
});

router.get("/announcment", async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find();

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ message: "No announcements found" });
    }

    res
      .status(200)
      .json({
        message: "Announcements fetched successfully",
        data: announcements,
      });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/comments", async (req, res) => {
  const { userId, username, content } = req.body;
  try {
    const newComment = new CommentModel({
     userId,
     content,
     username
    });
    await newComment.save();

    res.status(201).json({ message: "Comment registered successfully", data: newComment });
  } catch (error) {
    console.error("Error registering Comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/comments", async (req, res) => {
  try {
    const comments = await CommentModel.find();

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json({ message: "Comments fetched successfully", data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/report", async (req, res) => {
  const { formname, description, detailmsg } = req.body;
  try {
    const newReport = new ReportsModel({
     formname,
     description,
     detailmsg
    });
    await newReport.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: newReport });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/report", async (req, res) => {
  try {
    const reports = await ReportsModel.find();

    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }

    res
      .status(200)
      .json({ message: "Reports fetched successfully", data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/onlineUsers", async (req, res) => {
  try {
    const onlineUsers = await userClear.find(); // Fetch all users from the database
    res.status(200).json({
      message: "All Online Users Data",
      onlineUsers: onlineUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
})





export default router; 