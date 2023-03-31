const {Router}=require('express')
const { authTokenCookie } = require('../utils/jwt.utils')

const router = Router()

router.get('/private',authTokenCookie, (req,res)=>{
    res.json({message: 'This is Privated'})
})

module.exports= router