import {useState} from 'react'
import API from '../api/axios'

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
                <input type="text"
                placeholder='Add tag and press Enter'
                value={tagInput}
                onChange={(e)=> setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                />
                {tags.map((tag,index)=> (
                    <span key={index}>
                        {tag} <button type="button" onClick={()=> setTags(tags.filter((_, i)=> i !== index))}>x</button>
                    </span>
                ))}
            <button>Add</button>
            </form>
        </div>
    )
}

export default TaskForm;