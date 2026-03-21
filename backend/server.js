const mongoose = require('mongoose');
const Goal = require("./models/Goal");
mongoose.connect("mongodb://aditi:Adi2205@ac-4adycx9-shard-00-00.smvhc8h.mongodb.net:27017,ac-4adycx9-shard-00-01.smvhc8h.mongodb.net:27017,ac-4adycx9-shard-00-02.smvhc8h.mongodb.net:27017/?ssl=true&replicaSet=atlas-ysqi6e-shard-0&authSource=admin&appName=Cluster0")
.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

app.post("/addGoal", async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.send("Goal added successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/updateGoal/:name", async (req, res) => {
  try {
    const goal = await Goal.findOne({ name: req.params.name });

    if (!goal) {
      return res.send("Goal not found");
    }

    goal.savedAmount += req.body.amount;
    await goal.save();

    res.send("Savings updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/reminders", async (req, res) => {
  try {
    const goals = await Goal.find()
      .sort({ dueDate: 1 })   // nearest date first
     //.limit(3);              // only top 3

    res.json(goals);
  } catch (err) {
    res.status(500).send(err);
  }
});

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