    // Include it:
    var form = require("connect-validation"),
      filter = form.filter,
      validate = form.validate;

    // Define a route:
    app.post(
      '/register',

      // Add validation route-middleware:
      form(
        filter("username").trim(),
        validate("username").alphaNumeric()
      ),

      function(req, res) {
        // Now we can inspect the errors!  
        if (!req.form.isValid) {
          // Handle errors
          console.log(req.form.errors);
        }
      }
    );  
