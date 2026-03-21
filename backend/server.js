const mongoose = require('mongoose');
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
