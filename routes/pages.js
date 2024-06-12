const express = require('express');
const authController = require('../controllers/auth');


const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    // res.render('index');
    if(req.user) {
        res.render('index', {
          user: req.user
        });
      } else {
        res.render('index');
      }
});

router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/browse', authController.isLoggedIn, (req, res) =>{
    console.log("inside");
    if(req.user) {
      res.render('browse', {
        user: req.user
      });
    } else {
      res.redirect("/login");
    }
})

 router.get('/menu', authController.isLoggedIn, authController.productsInfo,  (req, res) =>{
   if(req.user) {
    const days = req.session.message;
     res.render('menu', {
       user: req.user,
       products: req.products,
       days
     });
   } else {
     res.redirect("/login");
   }
 })


router.get('/calendar', authController.isLoggedIn, authController.productsInfo, (req, res) =>{
  if(req.user) {
    res.render('calendar', {
      user: req.user,
      products: req.products
    });
  } else {
    res.redirect("/login");
  }
})


module.exports = router;