import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";
import authRoutes from "./routers/auth.js";
import UserModal from "./models/Users.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", async (req, res) => {
  let users = await UserModal.find();
  res.status(200).json({ message: "users fetched successfully", users: users });
});

app.post("/", async (req, res) => {
  const { todo, user } = req.body;

  if (!todo) {
    return res.status(400).json({ message: "Todo cannot be empty" });
  }

  try {
    // Use $push to add the new todo to the todos array
    const updatedUser = await UserModal.findByIdAndUpdate(
      user[0].user._id, // The user's ID
      { $push: { todos: todo } }, // Add the new todo to the array
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Todo added successfully",
      user: updatedUser, // Return the updated user document
    });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/", async (req, res) => {
  const { todo, user } = req.query;

  try {
    // Use $push to add the new todo to the todos array
    const updatedUser = await UserModal.findByIdAndUpdate(
      user[0].user._id, // The user's ID
      { $pull: { todos: todo } }, // Add the new todo to the array
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Todo Deleted successfully",
      user: updatedUser, // Return the updated user document
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/clearAll", async (req, res) => {
  const { user } = req.query;

  try {
    const updatedUser = await UserModal.findByIdAndUpdate(
      user[0].user._id, // The user's ID
      { $set: { todos: [] } }, // Add the new todo to the array
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Todo Deleted successfully",
      user: updatedUser, // Return the updated user document
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/updateTodo", async (req, res) => {
  const { user, updateTodo, selectedTodo } = req.body;

  if (!updateTodo) {
    return res.status(400).json({ message: "Todo cannot be empty" });
  }

  try {
    const updatedUser = await UserModal.findOneAndUpdate(
      {
        _id: user[0].user._id,
        todos: selectedTodo, // Match the specific todo to replace
      },
      {
        $set: { "todos.$": updateTodo }, // Replace the matched todo with the new value
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Todo updated successfully",
      user: updatedUser, // Return the updated user document
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
