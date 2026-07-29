import { useEffect, useState } from "react";
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";

const API_URL = import.meta.env.VITE_API_URL || "https://todo-app-axsl.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTodos(data.todos || []);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    }

    fetchTodos();
  }, [isLoaded, isSignedIn]);

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(search.toLowerCase()));

    if (filter === "pending") return matchesSearch && !todo.completed;
    if (filter === "completed") return matchesSearch && todo.completed;
    return matchesSearch;
  });

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400 font-medium">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
        <span>Authenticating...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1350px] mx-auto p-4 sm:p-6 md:p-10 flex flex-col min-h-screen">
      {/* Top Navbar Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl mb-8 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]"></span>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            TaskFlow
          </h1>
        </div>

        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30 hover:-translate-y-0.5">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <SignedIn>
          {/* Create Todo Form */}
          <CreateTodo setTodos={setTodos} />

          {/* Search & Filter Controls */}
          <div className="flex flex-col items-center gap-6 my-10 w-full">
            <div className="w-full flex justify-center">
              <input
                className="w-full max-w-[600px] px-6 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all backdrop-blur-md shadow-xl"
                type="text"
                placeholder="🔍 Search Todo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Buttons with Count Badges */}
            <div className="inline-flex gap-2 bg-slate-900/70 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
              <button
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === "all"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
                onClick={() => setFilter("all")}
              >
                All
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                  {todos.length}
                </span>
              </button>

              <button
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === "pending"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                  {todos.filter((t) => !t.completed).length}
                </span>
              </button>

              <button
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  filter === "completed"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                  {todos.filter((t) => t.completed).length}
                </span>
              </button>
            </div>
          </div>

          <Todos todos={filteredTodos} setTodos={setTodos} />
        </SignedIn>

        {/* Signed Out Landing Page */}
        <SignedOut>
          <div className="text-center py-20 px-4 max-w-[800px] mx-auto animate-fadeIn">
            <span className="inline-block text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-6">
              ⚡ Cloud Connected Workspace
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-6 leading-tight">
              Organize your tasks with ultimate privacy.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
              Sign in to unlock your personal workspace. Every account receives an isolated, encrypted task list.
            </p>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-10 py-4 rounded-2xl text-lg shadow-xl shadow-purple-600/40 hover:-translate-y-1 transition-all">
                Get Started Free
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>

      {/* Footer */}
      <footer className="mt-16 mb-4 w-full max-w-[800px] mx-auto bg-slate-900/65 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-purple-500/30 transition-all">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-[11px] font-bold tracking-wider uppercase text-purple-400 bg-purple-500/15 border border-purple-500/25 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
              ✨ Featured Project
            </span>
            <p className="text-sm font-medium text-slate-300">
              Check out my real-time chat application for live messaging
            </p>
          </div>

          <a
            href="https://bizz-realtime-chat-application-4.onrender.com/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/30 hover:-translate-y-0.5 transition-all whitespace-nowrap"
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