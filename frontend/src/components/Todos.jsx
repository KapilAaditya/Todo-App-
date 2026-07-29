import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function Todos({ todos, setTodos }) {
  const { getToken } = useAuth();

  // Toggle Completed Status
  const toggleComplete = async (id, currentStatus) => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/completed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, completed: !currentStatus }),
      });

      if (res.ok) {
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? { ...t, completed: !currentStatus } : t))
        );
      }
    } catch (err) {
      console.error("Error updating todo status:", err);
    }
  };

  // Delete Todo Handler
  const deleteTodo = async (id) => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/todo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Remove deleted todo from local state instantly
        setTodos((prev) => prev.filter((t) => (t._id || t.id) !== id));
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 font-medium text-base">
        No tasks found. Add a new task above!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-16">
      {todos.map((todo) => {
        const todoId = todo._id || todo.id;

        return (
          <div
            key={todoId}
            className="bg-slate-900/65 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/10 min-h-[190px] relative overflow-hidden group"
          >
            {/* Top glowing accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <h3
                className={`text-lg font-bold mb-2 leading-snug break-words ${
                  todo.completed ? "line-through text-slate-500" : "text-slate-100"
                }`}
              >
                {todo.title}
              </h3>

              {todo.description && (
                <p className="text-slate-400 text-sm leading-relaxed break-words mb-4">
                  {todo.description}
                </p>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
              {/* Mark Complete Button */}
              <button
                onClick={() => toggleComplete(todoId, todo.completed)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  todo.completed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-white/5 border-white/10 text-slate-200 hover:bg-purple-600 hover:border-purple-600 hover:text-white hover:shadow-md hover:shadow-purple-600/30"
                }`}
              >
                {todo.completed ? "✓ Done" : "Mark Done"}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todoId)}
                title="Delete task"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm hover:shadow-rose-500/30"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}