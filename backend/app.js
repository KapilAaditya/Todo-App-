require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { createtodo, showtodo } = require("./types");
const { Todo } = require("./database/db");

const app = express();

// 1. Configure CORS at the top before routes
const allowedOrigins = [
  'https://todo-app-axsl.onrender.com',
  'http://localhost:5173',
  'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Create Todo
app.post("/todo", async (req, res) => {
  try {
    const parsedPayload = createtodo.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(400).json({
        msg: "Invalid Input"
      });
    }

    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      completed: false
    });

    res.status(201).json({
      msg: "Todo Created",
      todo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
});

// Get Todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json({ todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
});

// Toggle / Mark Completed
app.put("/completed", async (req, res) => {
  try {
    const parsedPayload = showtodo.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(400).json({
        msg: "Invalid Input"
      });
    }

    // Support toggling completed state directly
    const completedState = typeof req.body.completed === "boolean" 
      ? req.body.completed 
      : true;

    await Todo.updateOne(
      { _id: req.body.id },
      { completed: completedState }
    );

    res.json({
      msg: "Todo Updated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
});

// Search Route (Fixed MongoDB $options and response return)
app.get("/search", async (req, res) => {
  const search = req.query.search || "";
  try {
    const todos = await Todo.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    });

    res.json({ todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
});

// Delete Todo
app.delete("/todo/:id", async (req, res) => {
  try {
    await Todo.deleteOne({
      _id: req.params.id
    });

    res.json({
      msg: "Todo Deleted"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
});

// Serve static frontend build if hosted together
const publicDir = path.join(__dirname, "public");

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

    app.get("{*splat}", (req, res) => {
        res.sendFile(path.join(publicDir, "index.html"));
    });

}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});