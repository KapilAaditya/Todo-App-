import "./todos.css"
export function Todos({ todos, setTodos }) {
    return (
        <>
            <div className="todos-container">
                {todos.map((singleTodo, index) => {
                    return (
                        <div key={index} className="todo-card">
                            <h1 className="todo-title"
                            >Title :- {singleTodo.title}</h1>
                            <h2 className="todo-description">Description :- {singleTodo.description}</h2>
                            
                            <button onClick={() => {
                                fetch("http://localhost:4000/completed", {
                                    method: "PUT",
                                    body: JSON.stringify({
                                        id: singleTodo._id
                                    }),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                })
                                .then((response) => {
                                    if (response.ok) {
                                        setTodos(prevTodo =>
                                            prevTodo.map(item =>
                                                item._id === singleTodo._id ? { ...item, complete: true } : item
                                            )
                                        );
                                        alert("Saved in database!");
                                    } else {
                                        alert("Cannot save in the database");
                                    }
                                })
                                .catch((err) => console.log(err));
                            }}>
                                {singleTodo.complete === true ? "Completed" : "Mark as complete"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}