const {Router} = require('express')
const User = require('../models/user.model')

const router = Router()

router.post('/', async(req,res)=>{
    try {
        const {first_name,last_name,age,email,password} = req.body
    
        const newUserInfo = {
            first_name,
            last_name,
            age,
            email,
            password
        }
    
        const newUser = await User.create(newUserInfo)
    
        res.status(201).json({message: newUser})
    } catch (error) {
        console.log(error)
        if(error.code === 11000) return res.status(400).json({eroor: 'El usuario ya existe'})
        res.status(500).json({error: 'Error interno del servidor'})
    }
})

module.exports = router