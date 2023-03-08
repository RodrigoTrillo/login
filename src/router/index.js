const viewsTemplateController = require('../viewsTemplate/controller.viewsTemplate')
const usersController = require('../users/controller.users')
const authController = require('../auth/controller.auth')


const router = app =>{
    app.use('/',viewsTemplateController)
    app.use('/users', usersController)
    app.use('/auth',authController)
}

module.exports = router