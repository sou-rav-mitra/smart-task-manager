const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const registerUser= async (req, res)=>{
    try{
        let name= req.body.name;
        let email= req.body.email;
        let password= req.body.password;

        const userExists= await User.findOne({email})
        if(userExists){
            return res.status(400).json({message: "User already exists"})
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword= await bcrypt.hash(password, salt)

            const user= await User.create({
                name,
                email,
                password: hashedPassword
            })
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        }
    } catch(error){
        res.status(500).json({message: error.message})
    }

}

const loginUser= async (req, res)=>{
    try{
        let email= req.body.email;
        let password= req.body.password;

        const userCheck= await User.findOne({email})
        if(!userCheck){
            return res.status(400).json({message: "Invalid credentials"})
        }
        else{
            const isMatch = await bcrypt.compare(password, userCheck.password)
            if(isMatch){
                const token = jwt.sign(
                    { id: userCheck._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                )
                return res.status(200).json({
                    token,
                    user: {
                        id: userCheck._id,
                        name: userCheck.name,
                        email: userCheck.email
                    }
                })
            }
            else{
                return res.status(400).json({ message: "Invalid credentials" })
            }
        }
    } catch(error){
        res.status(500).json({message: error.message})
    }

}

    
module.exports = { registerUser, loginUser }
