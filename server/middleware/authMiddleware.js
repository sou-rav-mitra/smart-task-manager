const jwt = require('jsonwebtoken')
const User = require('../models/User')


const protect = async (req, res, next)=>{
    try{
        if(!req.headers.authorization){
            return res.status(401).json({message: 'Not authorized'})
        }
        else{
            const token= req.headers.authorization.split(' ')[1]
            const decoded= jwt.verify(token, process.env.JWT_SECRET)
            if(decoded){
                req.user = await User.findById(decoded.id).select('-password')
                next()
            }
            else{
                return res.status(401).json({message: 'Not authorized'})
            }
    }
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

module.exports= protect;