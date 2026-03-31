import { useState } from 'react'
import API from '../api/axios'
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

function Register() {
    const [name, setName]= useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]= useState('')

    const {login}= useAuth()
    const navigate= useNavigate()

    const handleSubmit= async(e)=>{
        e.preventDefault()
        const response = await API.post('/auth/register', { name, email, password})
        login(response.data.user, response.data.token)
        navigate('/')
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                />
                <input type="text" placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
                <input type="password" placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}  
                />
                <button>Submit</button>
            </form>
        </div>
    )
    
}





export default Register