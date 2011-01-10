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

### Module

The Express Form **module** returns an Express [Route Middleware](http://expressjs.com/guide.html#Route-Middleware) function. You specify filtering and validation by passing filters and validators as arguments to the main module function. For example:

    var form = require("express-form");

    app.post('/user',
      
      // Express Form Route Middleware: trims whitespace off of the `username` field.
      form(form.filter("username").trim()),
      
      // standard Express handler
      function(req, res) {
        // ...
      }
    );

### Filters

The `filter` property of the module creates a filter object tied to a specific field.

    filter(fieldname);
    // -> Filter

The API is chainable, so you can keep calling filters one after the other:

    filter("username").trim().toLower().truncate(5)

#### Filter API:

Type Coercion

    toFloat()           -> Number
    toInt()             -> Number, rounded down
    toBoolean()         -> Boolean from truthy and falsy values
    toBooleanStrict()   -> Only true, "true", 1 and "1" are `true`
    ifNull(replacement) -> "", undefined and null get replaced by `replacement`
    
HTML Encoding for `& " < >`

    entityEncode() -> encodes HTML entities
    entityDecode() -> decodes HTML entities 

String Transformations

    trim(chars)                 -> `chars` defaults to whitespace
    ltrim(chars)
    rtrim(chars)
    toLower() / toLowerCase()
    toUpper() / toUpperCase()
    truncate(length)            -> Chops value at (length - 3), appends `...`
    
Custom Filters

    custom(function)
    
    // Example
    // If the `name` field has a value of "hello there",
    // this would transform it to "hello-there". 
    filter("name").custom(function(value) {
      return value.replace(/\s+/g, "-");
    });
    

### Validators

Documentation coming soon


### http.ServerRequest.prototype.form

Documentation coming soon


Installation:
-------------

    npm install express-form


Credits
-------

Currently, Express Form uses many of the validation and filtering functions provided by Chris O'Hara's [node-validator](https://github.com/chriso/node-validator).
