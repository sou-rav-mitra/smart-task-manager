import {useState} from 'react'
import API from '../api/axios'

function TaskForm({onTaskAdded}){
    const [title, setTitle]= useState('')
    const [notes, setNotes]= useState('')
    const [deadline, setDeadline]= useState('')
    const [priority, setPriority]= useState('')

    const handleSubmit= async(e)=>{
        e.preventDefault()
        await API.post('/tasks', {title, notes, deadline, priority})
        onTaskAdded()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={title} type="text" placeholder='Title' onChange={(e)=>setTitle(e.target.value)}/>
                <input value={notes} type="text" placeholder='Notes' onChange={(e)=>setNotes(e.target.value)}/>
                <input value={deadline} type="date" placeholder='Deadline' onChange={(e)=>setDeadline(e.target.value)} />
                <select value={priority} onChange={(e)=> setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
            </select>
            <button>Add</button>
            </form>
        </div>
    )
}

export default TaskForm;