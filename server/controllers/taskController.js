const Task = require('../models/Task')


const getTasks= async(req, res)=>{
    try{
        const findTasks= await Task.find({user: req.user._id})
        return res.status(200).json(findTasks)
    } catch(error){
        res.status(500).json({ message: error.message })
    }
}


const createTask = async (req, res) => {
    try{
        let title= req.body.title;
        let notes= req.body.notes;
        let tags= req.body.tags;
        let deadline= req.body.deadline;
        let priority= req.body.priority;

        const task= await Task.create({
            title,
            notes,
            tags,
            deadline,
            priority,
            user: req.user._id
        })
        return res.status(201).json({task})

    } catch(error){
        res.status(500).json({message: error.message})
    }
}


const updateTask = async (req, res) => {
    try{
        const taskId= req.params.id;
        const task= await Task.findById(taskId)
        if(!task){
            return res.status(404).json({message: "Task not found"})
        }
        else if( task.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "This task does not belong to you"})
        }
        else{
            const taskUpdate= await Task.findByIdAndUpdate(taskId, req.body, { new: true })
            return res.status(200).json({message: "Task was updated", taskUpdate})
        }

    } catch(error){
        res.status(500).json({message: error.message})
    }
}


const deleteTask = async (req, res) => {
    try{
        const taskId= req.params.id;
        const task= await Task.findById(taskId)
        if(!task){
            return res.status(404).json({message: "Task not found"})
        }
        else if( task.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "This task does not belong to you"})
        }
        else{
            await Task.findByIdAndDelete(taskId)
            return res.status(200).json({message: "Task was deleted", })
        }

    } catch(error){
        res.status(500).json({message: error.message})
    }
}


module.exports = { getTasks, createTask, updateTask, deleteTask }

