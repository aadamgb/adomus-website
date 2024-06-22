const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/test', authController.test);
router.post('/addCart', authController.addCart);
router.post('/loadCart', authController.loadCart);
router.post('/addOrder', authController.addOrder);
router.post('/details', authController.details);


module.exports = router;