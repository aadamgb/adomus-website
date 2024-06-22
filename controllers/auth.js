const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');



const adomus_db = mysql.createConnection({
    host: process.env.database_host,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database
});


exports.login = async (req, res, next) => {

    console.log(req.body);
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).render("login", {
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists && password is correct
    adomus_db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      // console.log(results);
      console.log(password);
      const isMatch = await bcrypt.compare(password, results[0].password);
      console.log(isMatch);
      if(!results || !isMatch ) {
        return res.status(401).render("login", {
          message: 'Incorrect email or password'
        });
      } else {
        // 3) If everything ok, send token to client
        const id = results[0].id;
        console.log(id);
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        };
        res.cookie('jwt', token, cookieOptions);

        res.status(200).redirect("/browse");
      }
    });
}

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies);
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );

        // console.log("decoded");
        // console.log(decoded);

        // 2) Check if user still exists
        // console.log('Middleware 1 called');
        adomus_db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        //   console.log(result)
          if(!result) {
            return next();
          }
          // THERE IS A LOGGED IN USER
          req.user = result[0];
          // res.locals.user = result[0];
          // console.log("next")
          return next();
        });


      } catch (err) {
        return next();
      }
    } else {
      next();
    }
};

exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, pass, re_pass} = req.body;

    adomus_db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if( results.length > 0 ) {
            return res.render('register', {
                message: 'Email already in use'
            })
        }else if( pass !== re_pass) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(pass, 9);
        console.log(hashedPassword);
        adomus_db.query('INSERT users SET ? ',{username: name, email: email, password: hashedPassword }, (error, results) =>{
            if(error) {
                console.log(error);
            } else {
                console.log(results)
                return res.render('register', {
                    message: 'Successfully registered'
                });
            }
        })
    });


}

exports.logout = (req, res) => {
  res.clearCookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/");
};


exports.productsInfo =  (req, res, next) => {
  // console.log('Middleware 2 called');
  const CustomerID = req.user.id;
  // if(!req.session.cart){
    // console.log("loggin cart")
    // console.log(req.session.cart)
   // Clear the cart
  //  req.session.cart = [];
  //  req.session.message = 'Order placed successfully';
   const fetchOrdersQuery = `
     SELECT Orders.OrderID, DATE_FORMAT(RequiredDate, '%Y-%m-%d') AS RequiredDate, OrderDetails.ProductID, OrderDetails.Quantity, OrderDetails.UnitPrice, Products.ProductName,  Products.CategoryID, Products.ProductImage
     FROM Orders 
     JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID 
     JOIN Products ON OrderDetails.ProductID = Products.ProductID 
     WHERE Orders.CustomerID = ?
 `;

 adomus_db.query(fetchOrdersQuery, [CustomerID], (err, results) => {
     if (err) {
         console.error('Error fetching orders:', err);
         return res.status(500).send('Failed to fetch orders');
     }

     // Group products by RequiredDate
     const groupedOrders = results.reduce((acc, order) => {
         let {RequiredDate, ProductID, Quantity, UnitPrice, ProductName, CategoryID ,ProductImage  } = order;
         let date = new Date(RequiredDate).toISOString().split('T', 1)[0];
         if (!acc[date]) {
             acc[date] = [];
         }
         acc[date].push({ ProductID, Quantity, UnitPrice, ProductName, CategoryID  ,ProductImage });
         return acc;
     }, {});

     // Save grouped orders in the session cart
     req.session.orders = groupedOrders;
});
  // }
  adomus_db.query('SELECT * FROM products', (error, results) => {
    //  console.log(results); // Log results to verify

     req.products = results;
     return next();
  });

};

exports.test =  (req, res) => {
  // const { orderDate, orderedDate} = req.body;
  // console.log(req.body);
  // console.log(orderDate);
  // console.log(orderedDate);
  req.days = req.body;
  console.log(req.days);

  req.session.days = req.body;
  res.status(200).redirect('/menu');

};

exports.addCart =  (req, res) => {
  console.log(req.body);
  // if(!req.session.cart){
  //   req.session.cart = [];
  // }
  // req.session.cart = req.body
  let count = 0;
  // for(let i = 0; i < req.session.cart.length; i++){
  //   if(req.session.cart[i].ProductID == req.body.ProductID){
  //     count++;
  //   }
  // }
  if(count == 0){

    const emptyCart = 'No items added';
  }    
  // const cartData = req.body;
  const cartData = {
    ProductID: req.body.ProductID,
    Quantity: 1,
    UnitPrice: req.body.UnitPrice,
    ProductName: req.body.ProductName,
    ProductImage: req.body.ProductImage,
    CategoryID: req.body.CategoryID
  }
  const date = req.body.orderDate;
  if (!req.session.cart) {
    req.session.cart = {};
  }
  if (!req.session.cart[date]) {
    req.session.cart[date] = [];
  }
  // const existingProduct = req.session.cart[date].find(p => p.ProductID === req.body.ProductID);

  // if (existingProduct) {
  //   // Si el producto ya está en el carrito, incrementa su cantidad
  //   existingProduct.Quantity += req.body.Quantity;
  // } else {
  //   // Si el producto no está en el carrito, añádelo
  //   req.session.cart[date].push(product);
  // }
  req.session.cart[date].push(cartData);
  console.log("add to cart")
  
  res.redirect("/menu");

};

exports.loadCart =  (req, res) => {
  const userId = 1; // Assuming the user is logged in and userId is stored in session
  const fetchOrdersQuery = `
  SELECT Orders.OrderID, Orders.RequiredDate, OrderDetails.ProductID, OrderDetails.Quantity, OrderDetails.UnitPrice, Products.ProductName,  Products.CategoryID, Products.ProductImage
  FROM Orders 
  JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID 
  JOIN Products ON OrderDetails.ProductID = Products.ProductID 
  WHERE Orders.CustomerID = ?
`;

adomus_db.query(fetchOrdersQuery, [CustomerID], (err, results) => {
  if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Failed to fetch orders');
  }

  // Group products by RequiredDate
  const groupedOrders = results.reduce((acc, order) => {
    console.log("logging all orders dates");
    console.log(order);
      let {RequiredDate, ProductID, Quantity, UnitPrice, ProductName, CategoryID ,ProductImage  } = order;
      let date = new Date(RequiredDate).toISOString().split('T', 1)[0];
      // RequiredDate = RequiredDatee.split('T', 1)[0];
      console.log("showing date");
      console.log(date);
      if (!acc[date]) {
          acc[date] = [];
      }
      acc[date].push({ ProductID, Quantity, UnitPrice, ProductName, CategoryID  ,ProductImage });
      return acc;
  }, {});

        // Save grouped orders in the session cart
        req.session.cart = groupedOrders;
        console.log("loadCart");
        console.log(req.session.cart);
        res.redirect('/menu');
    });

};

exports.addOrder =  (req, res, next) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.status(400).send('Cart is empty');
}
console.log(req.body);
const CustomerID = req.body.userID; // Assuming the user is logged in and userId is stored in session
const RequiredDate = req.body.orderDate;

const createOrderQuery = 'INSERT INTO orders (CustomerID, OrderedAt, RequiredDate) VALUES (?, NOW(), ?)';
// adomus_db.query('INSERT orders SET ? ',{CustomerID: CustomerID, OrderedAt: 'NOW()', RequiredDate: RequiredDate }, (err, result) =>{
 adomus_db.query(createOrderQuery, [CustomerID, RequiredDate],  (err, result) => {
    if (err) {
        console.error('Error creating order:', err);
        return res.status(500).send('Failed to create order');
    }

    const orderId = result.insertId;
    let datee = new Date(RequiredDate).toISOString().split('T', 1)[0];
    // Retrieve unit prices for products in the cart
    const productIds = req.session.cart[datee].map(item => item.ProductID);
    const productQuery = 'SELECT ProductID, UnitPrice FROM Products WHERE ProductID IN (?)';
    
    adomus_db.query(productQuery, [productIds], (err, products) => {
        if (err) {
            console.error('Error retrieving products:', err);
            return res.status(500).send('Failed to retrieve products');
        }

        const orderItems = req.session.cart[datee].map(cartItem => {
            const product = products.find(p => p.ProductID == cartItem.ProductID);
            return [orderId, cartItem.ProductID, product.UnitPrice, 1, 0]; // Assuming no discount and 1 quantity
        });

        const createOrderItemsQuery = 'INSERT INTO OrderDetails (OrderID, ProductID, UnitPrice, Quantity, Discount) VALUES ?';
        adomus_db.query(createOrderItemsQuery, [orderItems], (err) => {
            if (err) {
                console.error('Error creating order items:', err);
                return res.status(500).send('Failed to create order items');
            } else {
              // Clear the cart
              req.session.cart[datee] = [];
              res.redirect('/menu');
            }
        });
    });
});

};


exports.details = (req, res) => {
  // console.log(req.body);
  req.session.dish = req.body;
  console.log(req.session.dish);
  getDishInfo(req.body.ProductName, (err, dishInfo) => {
    if (err){
      throw err;
    }else{
      req.session.dishInfo = dishInfo;
      res.redirect('/details');
    }

    console.log(dishInfo);
  });
};



function getDishInfo(dishName, callback) {
  const dishQuery = `
    SELECT r.Quantity, i.Protein, i.Fat, i.Carbohydrates, i.Calories, i.Name, i.ImagePath
    FROM products p
    JOIN recipes r ON p.ProductID = r.ProductID
    JOIN ingredients i ON r.IngredientID = i.IngredientID
    WHERE p.ProductName = ?;
  `;

  adomus_db.query(dishQuery, [dishName], (err, results) => {
    if (err) return callback(err);

    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalCalories = 0;

    results.forEach(row => {
      totalProtein += (row.Protein * row.Quantity);
      totalFat += (row.Fat * row.Quantity);
      totalCarbs += (row.Carbohydrates * row.Quantity);
      totalCalories += (row.Calories * row.Quantity);
    });

    const dishInfo = {
      totalProtein: totalProtein.toFixed(2),
      totalFat: totalFat.toFixed(2),
      totalCarbs: totalCarbs.toFixed(2),
      totalCalories: totalCalories.toFixed(2),
      ingredients: results
    };

    callback(null, dishInfo);
  });
}