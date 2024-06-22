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
    console.log(req.user);
    if(req.user) {
      res.render('browse', {
        user: req.user
      });
    } else {
      res.redirect("/login");
    }
})

 router.get('/menu', authController.isLoggedIn, authController.productsInfo, async (req, res) =>{
   if(req.user) {
    try {
      setTimeout(() => {
        res.render('menu', {
          user: req.user,
          products: req.products,
          orders: req.session.orders,
          cart: req.session.cart,
          days: req.session.days,
          message: req.session.message
        });
      }, 200);
  }catch (error) {
      // Handle errors here
      res.status(500).send('Error fetching data');
      };

   } else {
     res.redirect("/login");
   }
 });

 router.get('/details', authController.isLoggedIn, async (req, res) =>{
   if(req.user) {
    console.log(req.user);
    console.log(req.session.dishInfo);
        res.render('details', {
          user: req.user,
          dish: req.session.dish,
          dishInfo: req.session.dishInfo
        });
   } else {
     res.redirect("/login");
   }
 });

router.get('/remove_item', (req, res, next) => {
  console.log(req.query);
  const {id, date} = req.query;
  console.log(id);
  console.log(date);
  let i = 0;
  console.log(req.session.cart[date].length);
  req.session.cart[date] = req.session.cart[date].filter(item => item.ProductID != id);

  if (req.session.cart[date].length === 0) {
    delete req.session.cart[date];
  }
  console.log(req.session.cart[date]);
  // while (i < req.session.cart[orderDate].length) {
  //     console.log(i);
  //     if (req.session.cart[i].ProductID === ProductID) {
  //       req.session.cart.splice(i, 1);
  //         break; // exit the loop when i is 5
  //     }
  //     i++;
  // }
  // console.log("Loop has been terminated.");
    res.redirect("/menu");
})

router.get('/calendar', authController.isLoggedIn, authController.productsInfo, (req, res) =>{
  if(req.user) {
    res.render('calendar', {
      user: req.user,
      products: req.products,
      orders: req.session.orders,
      cart: req.session.cart
    });
  } else {
    res.redirect("/login");
  }
})


module.exports = router;