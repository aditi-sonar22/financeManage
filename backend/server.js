const mongoose = require('mongoose');
const Goal = require("./models/Goal");
const express = require('express');
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect("mongodb://aditi:Adi2205@ac-4adycx9-shard-00-00.smvhc8h.mongodb.net:27017,ac-4adycx9-shard-00-01.smvhc8h.mongodb.net:27017,ac-4adycx9-shard-00-02.smvhc8h.mongodb.net:27017/?ssl=true&replicaSet=atlas-ysqi6e-shard-0&authSource=admin&appName=Cluster0")
.then(() => {
    console.log("✅ Connected to MongoDB");
})
.catch((err) => {
    console.error("❌ MongoDB Error:", err);
});

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is running");
});


// ==================== APIs ====================

// ➕ ADD GOAL
app.post("/addGoal", async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, dueDate } = req.body;

    // ❌ Check empty fields
    if (!name || !targetAmount || !savedAmount || !dueDate) {
      return res.status(400).send("All fields are required");
    }

    const goal = new Goal({
      name,
      targetAmount,
      savedAmount,
      dueDate
    });

    await goal.save();
    res.send("Goal added successfully");

  } catch (err) {
    res.status(500).send(err);
  }
});


// 🔄 UPDATE GOAL
app.put("/updateGoal/:name", async (req, res) => {
  try {
    const goal = await Goal.findOne({ name: req.params.name });

    if (!goal) {
      return res.status(404).send("Goal not found");
    }

    goal.savedAmount += req.body.amount;
    await goal.save();

    res.send("Savings updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});


// 📊 GET ALL GOALS
app.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).send(err);
  }
});


// 🗑 DELETE GOAL
app.delete("/deleteGoal/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.send("Goal deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});


// ⏰ PRIORITY (REMINDERS)
app.get("/reminders", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ dueDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).send(err);
  }
});


// 📉 SORT BY REMAINING AMOUNT
app.get("/sortedGoals", async (req, res) => {
  try {
    const goals = await Goal.find();

    const sorted = goals.sort((a, b) => {
      const remainingA = a.targetAmount - a.savedAmount;
      const remainingB = b.targetAmount - b.savedAmount;
      return remainingA - remainingB;
    });

    res.json(sorted);
  } catch (err) {
    res.status(500).send(err);
  }
});


// SERVER START (keep at bottom)
app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});