import {useState} from 'react'
import {useEffect} from 'react'
import API from '../api/axios'
import {useAuth} from '../context/AuthContext'

import TaskForm from '../components/TaskForm'

function Dashboard(){
    const [tasks, setTasks]= useState([])
    const {user, logout}= useAuth()

        const fetchTasks= async ()=>{
            const response= await API.get('/tasks')
            setTasks(response.data)
        }

    useEffect(()=>{
        fetchTasks()
    }, [])

    return(
        <div>
            <h1>Welcome, {user?.name}</h1>
            {tasks.map((task)=>(
                <div key={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.notes}</p>
                    <p>{task.priority}</p>
                </div>
            ))}
            <TaskForm onTaskAdded={fetchTasks} />
        </div>
    )
}

export default Dashboard;