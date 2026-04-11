import { useState } from "react";
import { useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import { motion } from 'framer-motion';

import TaskForm from "../components/TaskForm";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import SortableTask from "../components/SortableTask";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  //filter and search
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTag, setFilterTag] = useState("");

  //for editing tasks
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editPriority, setEditPriority] = useState("low");
  const [editDeadline, setEditDeadline] = useState("");

  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const sensors= useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  useEffect(() => {
    vantaEffect.current = window.VANTA.HALO({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      backgroundColor: 0x0a0a1a,
      baseColor: 0x1a59,
    });
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  const fetchTasks = async () => {
    const response = await API.get("/tasks");
    const sorted= response.data.sort((a,b)=> a.order-b.order)
    setTasks(sorted)
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId))
    try {
        await API.delete('/tasks/' + taskId)
    } catch (error) {
        fetchTasks()
    }
}

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const saveTask = async (taskId) => {
    await API.put("/tasks/" + taskId, {
      title: editTitle,
      notes: editNotes,
      priority: editPriority,
      deadline: editDeadline,
    });
    setEditingTask(null);
    fetchTasks();
  };

  const toggleComplete = async (taskId, currentStatus) => {
    setTasks(tasks.map(task => 
        task._id === taskId 
            ? { ...task, completed: !currentStatus }
            : task
    ))
    try {
        await API.put('/tasks/' + taskId, { completed: !currentStatus })
    } catch (error) {
        // If server fails, revert the UI change
        setTasks(tasks.map(task => 
            task._id === taskId 
                ? { ...task, completed: currentStatus }
                : task
        ))
    }
}

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesTag = filterTag === "" || task.tags.includes(filterTag);
    return matchesSearch && matchesPriority && matchesTag;
  });



  const onDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = tasks.findIndex(t => t._id === active.id)
    const newIndex = tasks.findIndex(t => t._id === over.id)

    const reordered = arrayMove(tasks, oldIndex, newIndex)
    setTasks(reordered)

    await Promise.all(
        reordered.map((task, index) =>
            API.put('/tasks/' + task._id, { order: index })
        )
    )
}

  return (
    <div
      ref={vantaRef}
      className="flex min-h-screen"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="flex w-full" style={{ zIndex: 1, position: "relative" }}>
        {/* SIDEBAR */}
        <div
          className="w-64 flex flex-col justify-between p-6 shrink-0"
          style={{
            backgroundColor: "rgba(13, 13, 26, 0.85)",
            backdropFilter: "blur(12px)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Top section */}
          <div>
            {/* Logo */}
            <h1
              className="text-4xl font-bold mb-10"
              style={{ color: "#ffffff" }}
            >
              Docket.
            </h1>

            {/* Navigation */}
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#4b5563" }}
            >
              Filters
            </p>

            {/* Priority filter */}
            <div className="flex flex-col gap-1 mb-6">
              {["all", "low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className="text-left px-3 py-2 rounded-lg text-sm capitalize transition-all"
                  style={{
                    backgroundColor:
                      filterPriority === p
                        ? "rgba(124, 58, 237, 0.2)"
                        : "transparent",
                    color: filterPriority === p ? "#a78bfa" : "#6b7280",
                  }}
                >
                  {p === "all" ? "All Tasks" : p}
                </button>
              ))}
            </div>

            {/* Tag filter */}
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#4b5563" }}
            >
              Filter by Tag
            </p>
            <input
              type="text"
              placeholder="Search tag..."
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
            />
          </div>

          {/* Bottom section — user + logout */}
          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            className="pt-4"
          >
            <p className="text-sm font-medium text-white mb-3">{user?.name}</p>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-2 rounded-lg w-full text-left transition-all"
              style={{ color: "#6b7280" }}
              onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
            >
              Logout
            </button>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white">My Tasks</h2>
            {/* Search */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
                width: "260px",
              }}
            />
          </div>

          {/* Task list */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={filteredTasks.map(task => task._id)}
              strategy={verticalListSortingStrategy}
            >
            <div className="flex flex-col gap-3">
              {filteredTasks.map((task) => (
                <SortableTask key={task._id} id={task._id}>
                    <div
                        className="p-4 rounded-xl transition-all"
                        style={{
                            background: "rgba(10, 10, 30, 0.55)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                {editingTask?._id === task._id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <input
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => saveTask(task._id)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: "#7c3aed" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.08)",
                          color: "#6b7280",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    {/* Priority indicator */}
                    <div
                      className="w-1 rounded-full mt-1 shrink-0"
                      style={{
                        height: "40px",
                        backgroundColor:
                          task.priority === "high"
                            ? "#ef4444"
                            : task.priority === "medium"
                              ? "#f59e0b"
                              : "#22c55e",
                      }}
                    />

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id, task.completed)}
                      className="mt-1 accent-purple-500 shrink-0"
                    />

                    {/* Task content */}
                    <div className="flex-1">
                      <h3
                        className="text-white font-medium text-sm"
                        style={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          opacity: task.completed ? 0.5 : 1,
                        }}
                      >
                        {task.title}
                      </h3>
                      {task.notes && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#6b7280" }}
                        >
                          {task.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Deadline */}
                        {task.deadline && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.06)",
                              color: "#6b7280",
                            }}
                          >
                            {task.deadline.slice(0, 10)}
                          </span>
                        )}
                        {/* Tags */}
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "rgba(124, 58, 237, 0.2)",
                              color: "#a78bfa",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setEditTitle(task.title);
                          setEditNotes(task.notes);
                          setEditPriority(task.priority);
                          setEditDeadline(
                            task.deadline ? task.deadline.slice(0, 10) : "",
                          );
                        }}
                        className="text-xs px-3 py-1 rounded-lg transition-all"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          color: "#6b7280",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-xs px-3 py-1 rounded-lg transition-all"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </SortableTask>
            ))}
          </div>
          </SortableContext>     
          </DndContext>
        </div>
      </div>


      {/* Fixed + button */}
      <motion.button
        initial={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            }}
            whileHover={{
              background: "linear-gradient(135deg, #3afcff, #48ACF0)",
              scale: 1.02,
              boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)",
            }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white text-2xl font-light flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
          zIndex: 50,
        }}
      >
        +
      </motion.button>

      {showModal && (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(4px)' }}
        onClick={() => setShowModal(false)}
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md p-1 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <TaskForm onTaskAdded={() => {
              fetchTasks()
              setShowModal(false)
        }} />
        </motion.div>
    </motion.div>
)}
    </div>
  );
}

export default Dashboard;
