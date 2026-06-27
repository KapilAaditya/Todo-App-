require('dotenv').config();
const express = require('express');
const { createtodo, showtodo } = require('./types');
const { Todo } = require('./database/db');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

// Create Todo
app.post('/todo', async (req, res) => {
    try {
        const createPayload = req.body;

        const parsedPayload = createtodo.safeParse(createPayload);

        if (!parsedPayload.success) {
            return res.status(400).json({
                msg: 'Check your inputs'
            });
        }

        const newTodo = await Todo.create({
            title: createPayload.title,
            description: createPayload.description,
            completed: false
        });

        res.status(201).json({
            msg: 'Todo has been created',
            todo: newTodo
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
});

// Get Todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find({});

        // console.log('Todos:', todos);

        res.json({
            todos
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
});

// Mark Completed
app.put('/completed', async (req, res) => {
    try {
        const updatePayload = req.body;

        const parsedPayload = showtodo.safeParse(updatePayload);

        if (!parsedPayload.success) {
            return res.status(400).json({
                msg: 'Something went wrong'
            });
        }

        await Todo.updateOne(
            {
                _id: req.body.id
            },
            {
                complete: true
            }
        );

        res.json({
            msg: 'Todo updated'
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});