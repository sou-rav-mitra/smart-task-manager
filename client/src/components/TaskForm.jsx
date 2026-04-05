import {useState} from 'react'
import API from '../api/axios'
import { motion } from 'framer-motion'

function TaskForm({onTaskAdded}){
    const [title, setTitle]= useState('')
    const [notes, setNotes]= useState('')
    const [deadline, setDeadline]= useState('')
    const [priority, setPriority]= useState('low')
    const [tagInput, setTagInput]= useState('')
    const [tags, setTags]= useState([])

    const handleTagKeyDown= (e)=>{
        if(e.key==='Enter'){
            e.preventDefault()
            if(tagInput.trim() !== ''){
                setTags([...tags, tagInput.trim()])
                setTagInput('')
            }
        }
    }

    const handleSubmit= async(e)=>{
        e.preventDefault()
        await API.post('/tasks', {title, notes, deadline, priority, tags})
        onTaskAdded()
        setTitle('')
        setNotes('')
        setDeadline('')
        setPriority('low')
        setTags([])
        setTagInput('')
    }

    return (
    <div className="p-4 rounded-xl"
        style={{
            background: "rgba(10, 10, 30, 0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
        <p className="text-sm font-medium text-white mb-3">Add New Task</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                value={title}
                type="text"
                placeholder="Task title"
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            />
            <input
                value={notes}
                type="text"
                placeholder="Notes"
                onChange={(e) => setNotes(e.target.value)}
                className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            />
            <div className="flex gap-3">
                <input
                    value={deadline}
                    type="date"
                    onChange={(e) => setDeadline(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <input
                type="text"
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            />
            {/* Tags preview */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                            {tag}
                            <button
                                type="button"
                                onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                style={{ color: '#a78bfa' }}>
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <motion.button
                initial={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            }}
            whileHover={{
              background: "linear-gradient(135deg, #3afcff, #48ACF0)",
              scale: 1.02,
              boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)",
            }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="py-2 rounded-lg text-white text-sm font-medium"
                
            >
                Add Task
            </motion.button>
        </form>
    </div>
)
}

export default TaskForm;