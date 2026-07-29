import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function CreateTodo({ setTodos }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(`${API_URL}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        // Update local state with newly created todo
        setTodos((prev) => [newTodo.todo || newTodo, ...prev]);
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error("Error creating todo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddTodo}
      className="max-w-[750px] mx-auto bg-slate-900/65 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-4 transition-all focus-within:border-purple-500/40"
    >
      <h2 className="text-xl font-bold text-slate-100">Create New Task</h2>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Task Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-slate-950/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
        required
      />

      {/* Auto-expanding Description Textarea */}
      <textarea
        placeholder="Task Description (optional)..."
        value={description}
        rows={2}
        onChange={(e) => {
          setDescription(e.target.value);
          // Dynamically adjust height up to max-h-48 (12rem / 192px)
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 192)}px`;
        }}
        className="w-full px-5 py-3.5 min-h-[80px] max-h-48 rounded-xl border border-white/10 bg-slate-950/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all resize-none overflow-y-auto"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="self-end bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "+ Add Task"}
      </button>
    </form>
  );
}