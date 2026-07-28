import { useEffect, useState } from "react";
import "./App.css";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data.todos || []))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="app-wrapper">
      {/* Main Form & Todo List */}
      <CreateTodo setTodos={setTodos} />

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search Todo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Todos todos={filteredTodos} setTodos={setTodos} />

      {/* Upgraded Modern Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <span className="footer-badge">✨ Featured Project</span>
            <p className="footer-text">
              Check out my real-time chat application for live messaging
            </p>
          </div>

          <a
            href="https://bizz-realtime-chat-application-4.onrender.com/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
          >
            <span>Visit Bizz Chat</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="external-icon"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;