import {useState} from 'react'
import {useEffect} from 'react'
import API from '../api/axios'
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

import TaskForm from '../components/TaskForm'

function Dashboard(){
    const [tasks, setTasks]= useState([])
    const {user, logout}= useAuth()
    const navigate= useNavigate()

    //filter and search
    const [search, setSearch]= useState('')
    const [filterPriority, setFilterPriority]= useState('all')

    //for editing tasks
    const [editingTask, setEditingTask]= useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editNotes, setEditNotes] = useState('')
    const [editPriority, setEditPriority] = useState('low')
    const [editDeadline, setEditDeadline] = useState('')


    const fetchTasks= async ()=>{
        const response= await API.get('/tasks')
        setTasks(response.data)
    }

    useEffect(()=>{
        fetchTasks()
    }, [])

    const deleteTask= async (taskId)=>{
        await API.delete('/tasks/'+ taskId)
        fetchTasks()
    }


    const handleLogout= ()=>{
        logout()
        navigate('/login')
    }

    const saveTask= async (taskId)=> {
        await API.put('/tasks/'+ taskId, {
            title: editTitle,
            notes: editNotes,
            priority: editPriority,
            deadline: editDeadline
        })
        setEditingTask(null)
        fetchTasks()
    }

    const toggleComplete= async (taskId, currentStatus)=>{
        await API.put('/tasks/'+taskId, {completed: !currentStatus})
        fetchTasks()
    }

    const filteredTasks= tasks.filter((task)=>{
        const matchesSearch= task.title.toLowerCase().includes(search.toLowerCase())
        const matchesPriority= filterPriority==='all' || task.priority===filterPriority
        return matchesSearch && matchesPriority;
    })

    return(
        <div>
            <h1>Welcome, {user?.name}</h1>
            <input 
                type="text" 
                placeholder='Search Tasks...'
                value={search}   
                onChange={(e)=> setSearch(e.target.value)} 
            />
            <select value={filterPriority} onChange={(e)=> setFilterPriority(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            {filteredTasks.map((task)=>(
                <div key={task._id}>
                    {editingTask?._id === task._id ? (
                        //edit mode - shows inputs
                        <div>
                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                            <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <button onClick={()=> saveTask(task._id)}>Save</button>
                            <button onClick={()=> setEditingTask(null)}>Cancel</button>
                        </div>
                    ) : (
                        //normal mode - shows task info
                        <div>
                            <input 
                                type="checkbox"
                                checked={task.completed}
                                onChange={()=> toggleComplete(task._id, task.completed)}
                            />
                            <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none'}}>{task.title}</h3>
                            <p>{task.notes}</p>
                            <p>{task.priority}</p>
                            <div>
                                {task.tags.map((tag, index) => (
                                    <span key={index}>{tag}</span>
                                ))}
                            </div>
                            <p>{task.deadline ? task.deadline.slice(0, 10) : 'No deadline'}</p>
                            <button onClick={() => deleteTask(task._id)}>Delete</button>
                            <button onClick={() => {
                                setEditingTask(task)
                                setEditTitle(task.title)
                                setEditNotes(task.notes)
                                setEditPriority(task.priority)
                                setEditDeadline(task.deadline? task.deadline.slice(0,10) : '')
                            }}>Edit</button>
                        </div>
                    )}
                </div>
            ))}
            <TaskForm onTaskAdded={fetchTasks} />
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Dashboard;