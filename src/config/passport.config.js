const passport = require('passport')
const local = require('passport-local')
const User = require('../models/user.model')
const { createHash, isValidPassword } = require('../utils/cryptPassword')

const LocalStrategy = local.Strategy;
const initializePassport= () =>{
    passport.use('register', new LocalStrategy(
        {
            passReqtoCallback:true,
            usernameField:'email',
        }, async (req, username,password,done)=>{
            const {first_name, last_name,email,age} = req.body
            try {
                const user= await User.findOne({email:username});
                if(user){
                    console.log({message: 'El usuario ya existe'})
                    return done(null,false)
                }
                const newUserInfo ={
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }
                const newUser = await User.create(newUserInfo)
                
                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    passport.deserializeUser(async(id,done)=>{
        const user = await User.findById(id)
        done(null, user)
    })


    passport.use('login', new LocalStrategy({usernameField:'email'},async(username, password,done)=>{
        try {
            const user = await User.findOne({email: username})

            if(!user){
                console.log('Usuario no existe')
                return done(null, false)
            }
            if(!isValidPassword(user,password)) return done(null, false)

            return done(null,user)
        } catch (error) {
            return done(error)
            
        }
    }))
}


module.exports = initializePassport