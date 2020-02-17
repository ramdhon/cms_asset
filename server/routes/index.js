const router = require('express').Router()
const userRouter = require('./user')
const AuthController = require('../controllers/auth')
const UploadController = require('../controllers/upload')
const Authenticate = require('../middlewares/authentication')
const AdminAuthorize = require('../middlewares/adminAuthorization')
const FindOneUser = require('../middlewares/findOneUser')
const multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now()+ '.jpeg')
    }
})
const upload = multer({ storage })
const carRouter = require('./car')
const rentitemRouter = require('./rentitem')
const rentlistRouter = require('./rentlist')
//sulap-route-source
//add 
//`const ${modelname}Router = require('./${modelname})`

router.post('/register', AuthController.register);
router.post('/admin/register', (req, res, next) => {
    if (req.headers.hasOwnProperty('code')) {
        const { code } = req.headers;

        if (code != 404) {
            const err = {
                status: 400,
                message: 'unauthorized code input'
            }
            
            return next(err);
        }

        next();
    } else {
        const err = {
            status: 400,
            message: 'you must set code in headers'
        }

        next(err);
    }
}, AuthController.registerAdmin);

router.post('/admin/users', Authenticate, AdminAuthorize, AuthController.add)
router.get('/admin/users', Authenticate, AdminAuthorize, AuthController.findAll)
router.get('/admin/users/:id', Authenticate, AdminAuthorize, FindOneUser, AuthController.findOne)
router.patch('/admin/users/:id', Authenticate, AdminAuthorize, FindOneUser, AuthController.update)
router.patch('/admin/users/:id/resetPassword', Authenticate, AdminAuthorize, FindOneUser, AuthController.resetPassword)
router.delete('/admin/users/:id', Authenticate, AdminAuthorize, FindOneUser, AuthController.delete)

router.post('/login', AuthController.login);
router.post('/upload', upload.single('file'), UploadController.uploadImage)
router.use('/user', userRouter)
router.use('/cars', carRouter) 
router.use('/rentitems', rentitemRouter) 
router.use('/rentlists', rentlistRouter) 
//sulap-add-route
/* please do not delete comment above  */

const err = {
    status: 404,
    message: 'not found 404'
}
router.get('/*', (req, res, next) => {
    next(err);
})
router.post('/*', (req, res, next) => {
    next(err);
})
router.put('/*', (req, res, next) => {
    next(err);
})
router.patch('/*', (req, res, next) => {
    next(err);
})
router.delete('/*', (req, res, next) => {
    next(err);
})

module.exports = router