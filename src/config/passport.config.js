const passport = require('passport')
const local = require('passport-local')
const GitHubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user.model')
const { createHash, isValidPassword } = require('../utils/cryptPassword')
const jwt = require('passport-jwt')
const cookieExtractor = require('../utils/cookieExtractor')



const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

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

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.8551e8561070a3ec',
        clientSecret:'41eafac10fe53df09b6f4de289fbe9b68c0718f4',
        callbackURL:'http://localhost:300/auth/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=>{
        try {
            console.log(profile)
            const user = await User.findOne({email:profile._json.email})
            if(!user){
                const newUserInfo = {
                    first_name: profile._json.name,
                    last_name:'',
                    age:18,
                    email:profile._json.email,
                    password:''
                }
                const newUser = await User.create(newUserInfo)
            return done(null, newUser )
            }
            done(null, user)
        } catch (error) {
            return done(error)            
        }
    }))

    passport.use('google',new GoogleStrategy({
        clientID:'146914544979-h7ctitmea5vfq0eiivjvg1g40id7u1pt.apps.googleusercontent.com' ,
        clientSecret:'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' ,
        callbackURL:'http://localhost:3000/auth/google/callback'
    },async(accesToken,refreshToken,profile,done)=>{
        try {
            console.log(profile)
            const user = User.findOne({googleId: profile._json.sub})
            if(!user){
                const newUserInfo={
                    googleId: profile._json.sub,
                    first_name:profile._json.given_name,
                    last_name:profile._json.family_name,
                    age:18,
                    email:profile._json.email,
                    password:'',
                    cart:id.cart,
                    role:admin
                }
                const newUser = await User.create(newUserInfo)
                return done(null, newUser)
            }
            done(null,user)
        } catch (error) {
            return done(error)
        }
    }))
    
    
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:'coderSecret'
    },async(jwt_payload, done)=>{
        try {
            done(null,jwt_payload)
        } catch (error) {
            done(error)
        }
        
    }))




}




module.exports = initializePassport