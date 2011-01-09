Express Form provides data filtering and validation as route middleware to your Express applications.

Usage:
------

    var form = require("express-form"),
        filter = form.filter,
        validate = form.validate;

    var app = express.createServer();

    app.configure(function() {
      app.use(express.bodyDecoder());
      app.use(app.router);
    });

    app.post(

      // Route
      '/user',
      
      // Form filter and validation middleware
      form(
        filter("username").trim(),
        validate("username").required().is(/^[a-z]+$/),
        filter("password").trim(),
        validate("password").required().is(/^[0-9]+$/)
      ),
      
      // Express request handler now gets filtered and validated body
      function(req, res){
        // Now we can inspect the errors!  
        if (!req.form.isValid) {
          // Handle errors
          console.log(req.form.errors);
        }
      }
    );

Documentation:
--------------

Coming soon! For now, just read the source.


Installation:
-------------

    npm install express-form
