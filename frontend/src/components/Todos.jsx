import { useState } from "react";
import "./todos.css";

export function Todos({ todos, setTodos }) {
  const [expanded, setExpanded] = useState({});

  function markCompleted(id) {
    fetch("http://localhost:5000/completed", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    }).then(() => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, completed: true } : todo
        )
      );
    });
  }

 function deleteTodo(id){

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this todo?"
    );


    if(!confirmDelete){
        return;
    }


    fetch(`http://localhost:5000/todo/${id}`,{

        method:"DELETE"

    })

    .then(()=>{

        setTodos(prev =>
            prev.filter(todo => todo._id !== id)
        );

    })

    .catch(err => console.log(err));

}

  return (
    <div className="todos-container">
      {todos.map((todo) => {
        const desc = todo.description || "";
        const isExpanded = expanded[todo._id];

        return (
          <div className="todo-card" key={todo._id}>
            <h2>{todo.title}</h2>

            <p>
              {isExpanded ? desc : desc.slice(0, 120)}

              {desc.length > 120 && (
                <span
                  className="read-more"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [todo._id]: !prev[todo._id]
                    }))
                  }
                >
                  {isExpanded ? " Read Less" : "... Read More"}
                </span>
              )}
            </p>

            <div className="btn-group">
              <button
                className={`complete-btn ${todo.completed ? "completed" : ""}`}
                onClick={() => markCompleted(todo._id)}
              >
                {todo.completed ? "Completed" : "Mark Complete"}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}