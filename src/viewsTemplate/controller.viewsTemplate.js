const {Router} = require('express')
const { privateAccess, publicAccess } = require('../middlewares')



const router = Router()

router.get('/',privateAccess,(req,res)=>{
    const {user} = req.session
    res.render('profile.handlebars',{user})
})

router.get('/signup',publicAccess,(req, res)=>{
    res.render('signup.handlebars')
})

router.get('/login',(req, res)=>{
    res.render('login.handlebars')
})

router.get('/forgotPasswor',(req, res)=>{
    res.render('forgotPassword.handlebars')
})

module.exports = router