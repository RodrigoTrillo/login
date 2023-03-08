const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const router = require('./router')
const { response } = require('express')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname +'/public'))
app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://RodrigoTrillo:Rolly1560@clustercoder.gkuf5cv.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions:{useNewUrlParser: true,useUnifiedTopology:true}
    }) ,
    secret:'asdasdasd12312',
    resave:false,
    saveUninitialized:false,
}))


app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views')


mongoose.connect('mongodb+srv://RodrigoTrillo:Rolly1560@clustercoder.gkuf5cv.mongodb.net/?retryWrites=true&w=majority')
.then(response=> console.log('db is connected'))
.catch(error => console.log(error))



router(app)

app.listen(3000, ()=>{
    console.log(`Server on 3000 `)
})