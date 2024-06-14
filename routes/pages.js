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
    // const days = req.session.message;
     res.render('menu', {
       user: req.user,
       products: req.products,
       cart: req.session.cart,
       days: req.session.message
     });
   } else {
     res.redirect("/login");
   }
 })
router.get('/remove_item', (req, res, next) => {
  const ProductID = req.query.id;
  console.log(ProductID);
  let i = 0;
  console.log(req.session.cart.length);
  while (i < req.session.cart.length) {
      console.log(i);
      if (req.session.cart[i].ProductID === ProductID) {
        req.session.cart.splice(i, 1);
          break; // exit the loop when i is 5
      }
      i++;
  }
  console.log("Loop has been terminated.");
  setTimeout(() => {
    res.redirect("/menu");
  }, 400);
  


})

router.get('/calendar', authController.isLoggedIn, authController.productsInfo, (req, res) =>{
  if(req.user) {
    res.render('calendar', {
      user: req.user,
      products: req.products,
      cart: req.session.cart
    });
  } else {
    res.redirect("/login");
  }
})


module.exports = router;