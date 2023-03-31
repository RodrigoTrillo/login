const {Router} = require('express')
const passport = require('passport')
const User = require('../models/user.model')
const { isValidPassword, createHash } = require('../utils/cryptPassword')
const { generateToken } = require('../utils/jwt.utils')

const router = Router()

router.post('/login', (req,res)=>{
  const {email,password} = req.body

  const token = generateToken(email)
  
  res
  .cookie('authToken',token,{maxAge: 6000,httpOnly:true})
  .json({message:'Secion init'})
  
})

router.post('/',passport.authenticate('login',{failureRedirect:'/failLogin'}), async (req, res)=>{
   try {
    if(!req.user) return res.status(400).json({error:'Credenciales invalidad'})

    req.session.user={
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email
    }
    res.json({message:req.user})

   } catch (error) {
    res.status(500).json({error: 'Internal Server Error'})
   }
})

router.get('/failLogin',(req,res)=>{
  res.json({error:'No se pudo iniciar sesión'})
})

router.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),async (req,res)=>{
  req.session.user = req.user
  req.redirect('/')
})


router.get('/google', passport.authenticate('google',{scope:['profile']}),async(req,res)=>{})

router.get('/google/callback', passport.authenticate('google',{failureRedirect:'/login'},async(req,res)=>{
  req.session.user = req.user
  req.redirect('/')
}))


router.get('/logout', (req, res)=>{
    req.session.destroy(error=>{
        if(error) return res.json({error})
        res.redirect('/login')
    })
})

router.patch('/forgotPassword',async (req,res)=>{
  try {
    const {email, password} = req.body
    const passwordEncrypter = createHash(password)

    await User.updateOne({email},{password: passwordEncrypter})
    res.json({message : 'Contraseña Actualizada'})
  } catch (error) {
    
  }
})

module.exports= router