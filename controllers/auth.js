const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const session = require('express-session');
const flash = require('connect-flash');

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
        console.log('Middleware 1 called');
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
  console.log('Middleware 2 called');
  adomus_db.query('SELECT * FROM products', (error, results) =>{
    //  console.log(results); // Log results to verify
     req.products = results[1];
     return next();
  });

};
exports.test =  async (req, res) => {
  // const { orderDate, orderedDate} = req.body;
  // console.log(req.body);
  // console.log(orderDate);
  // console.log(orderedDate);
  req.days = req.body;
  console.log(req.days);

  req.session.message = req.body;
  res.redirect('/menu');

};