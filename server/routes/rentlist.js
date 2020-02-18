const controller = require('../controllers/rentlist');
const router = require('express').Router();
const authenticate = require('../middlewares/authentication');
// const authorize = require('../middlewares/rentlistAuth');

router.use(authenticate);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);

router.post('/', controller.create);

//authorization
// router.use('/:id', authorize);
router.patch('/:id', controller.updateOnePatch);
router.put('/:id', controller.updateOnePut);
router.delete('/:id', controller.deleteOne);

module.exports = router;