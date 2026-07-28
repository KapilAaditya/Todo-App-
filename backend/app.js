require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { createtodo, showtodo } = require("./types");
const { Todo } = require("./database/db");
const { Query } = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

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
        console.log(err);

        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

// Get Todos
app.get("/todos", async (req, res) => {

    try {

        const todos = await Todo.find({});

        res.json({
            todos
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

// Mark Completed
app.put("/completed", async (req, res) => {

    try {

        const parsedPayload = showtodo.safeParse(req.body);

        if (!parsedPayload.success) {
            return res.status(400).json({
                msg: "Invalid Input"
            });
        }

        await Todo.updateOne(
            {
                _id: req.body.id
            },
            {
                completed: true
            }
        );

        res.json({
            msg: "Todo Updated"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});
app.get("/search", async (req, res) => {
    const search = req.query.search
    try {

        const todos = await Todo.find({
            title: {
                $regex: search,
                $option: "i"
            },
            description: {
                $regex: search,
                $option: "i"
            }
        })
    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

})

app.delete("/todo/:id", async (req, res) => {

    try {

        await Todo.deleteOne({
            _id: req.params.id
        });

        res.json({
            msg: "Todo Deleted"
        });

    } catch (err) {

        res.status(500).json({
            msg: "Internal Server Error"
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});