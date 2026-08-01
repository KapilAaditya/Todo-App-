require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// require("./cron");

const { createtodo } = require("./types");
const { Todo } = require("./database/db");

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "https://todo-app-axsl.onrender.com",
    "http://localhost:5173",
    "http://localhost:5000"
];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed"));
            }
        },
        credentials: true
    })
);

app.use(express.json());

/* ---------------- HEALTH ---------------- */

// app.get("/health", (req, res) => {
//     res.status(200).json({
//         status: "OK",
//         message: "Server is healthy",
//         time: new Date().toISOString()
//     });
// });

/* ---------------- CREATE TODO ---------------- */

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

/* ---------------- GET TODOS ---------------- */

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find({});

        res.json({
            todos
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

/* ---------------- COMPLETE TODO ---------------- */

app.put("/completed", async (req, res) => {
    try {
        const { id, completed } = req.body;

        if (!id) {
            return res.status(400).json({
                msg: "Todo ID is required"
            });
        }

        await Todo.updateOne(
            {
                _id: id
            },
            {
                completed: completed ?? true
            }
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

/* ---------------- SEARCH ---------------- */

app.get("/search", async (req, res) => {

    try {

        const search = req.query.search || "";

        const todos = await Todo.find({

            $or: [

                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        });

        res.json({
            todos
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

/* ---------------- DELETE ---------------- */

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

/* ---------------- SERVE REACT ---------------- */

const publicDir = path.join(__dirname, "public");

if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/*path", (req, res) => {
        res.sendFile(path.join(publicDir, "index.html"));
    });
}

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});