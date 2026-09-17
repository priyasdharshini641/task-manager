'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, priority, dueDate: dueDate || null }),
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setShowForm(false);
    loadTasks();
  }

  async function toggleComplete(task) {
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  }

  async function saveEdit(id) {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    loadTasks();
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const priorityStyles = {
    high: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    medium: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Student</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Here's your task overview</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/20"
          >
            + New Task
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
            <p className="text-3xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-purple-300">{pendingCount}</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-pink-300">{completedCount}</p>
          </div>
        </div>

        {/* New task form (collapsible) */}
        {showForm && (
          <form
            onSubmit={addTask}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 mb-6 space-y-3"
          >
            <input
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400/50 placeholder-gray-500"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <input
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400/50 placeholder-gray-500"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-3 flex-wrap">
              <select
                className="bg-black/30 border border-white/10 rounded-xl p-3 outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <input
                type="date"
                className="bg-black/30 border border-white/10 rounded-xl p-3 outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition text-white px-5 py-2.5 rounded-xl font-medium"
              type="submit"
            >
              Add Task
            </button>
          </form>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 mb-5">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
                filter === f
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.length === 0 && (
            <p className="text-gray-500 text-center py-10">No tasks here yet.</p>
          )}
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleComplete(task)}
                  className={`w-5 h-5 shrink-0 rounded-full border-2 transition ${
                    task.completed
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
                      : 'border-gray-500'
                  }`}
                />
                <div className="min-w-0">
                  {editingId === task.id ? (
                    <input
                      className="bg-black/30 border border-white/10 rounded-lg p-1.5 w-full"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p className={`font-medium truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-400 truncate">{task.description}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.priority && (
                  <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${priorityStyles[task.priority] || priorityStyles.medium}`}>
                    {task.priority}
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}

                {editingId === task.id ? (
                  <button onClick={() => saveEdit(task.id)} className="text-sm text-green-400 hover:text-green-300">
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => { setEditingId(task.id); setEditTitle(task.title); }}
                    className="text-sm text-purple-300 hover:text-purple-200"
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => deleteTask(task.id)} className="text-sm text-pink-400 hover:text-pink-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}