import { useState } from "react";
import "./CreateTodo.css";

export function CreateTodo({ setTodos }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTodo = () => {
    if (!title.trim()) return;

    fetch("http://localhost:5000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos((prev) => [...prev, data.todo]);
        setTitle("");
        setDescription("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="create-card">
      <h1 className="heading">Todo Application</h1>

      {/* This form-group div fixes the placement of input and textarea */}
      <div className="form-group">
        <input
          className="input-field"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="textarea-field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-primary" onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>
    </div>
  );
}