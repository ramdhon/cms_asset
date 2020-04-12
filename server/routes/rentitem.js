const controller = require('../controllers/rentitem');
const router = require('express').Router();
const authenticate = require('../middlewares/authentication');
const authorize = require('../middlewares/dataAdminAuthorization');

router.use(authenticate);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);

//authorization
router.use(authorize);
router.post('/', controller.create);

router.patch('/:id', controller.updateOnePatch);
router.put('/:id', controller.updateOnePut);
router.delete('/:id', controller.deleteOne);

module.exports = router;