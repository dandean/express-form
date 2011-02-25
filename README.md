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
        validate("password").required().is(/^[0-9]+$/),
        filter("email").trim(),
        validate("email").isEmail()
      ),
      
      // Express request-handler now receives filtered and validated data
      function(req, res){
        if (!req.form.isValid) {
          // Handle errors
          console.log(req.form.errors);

        } else {
          // Or, use filtered form data from the form object:
          console.log("Username:", req.form.username);
          console.log("Password:", req.form.password);
          console.log("Email:", req.form.email);
        }
      }
    );

Documentation:
--------------

### Module

The Express Form **module** returns an Express [Route Middleware](http://expressjs.com/guide.html#Route-Middleware) function. You specify filtering and validation by passing filters and validators as arguments to the main module function. For example:

    var form = require("express-form");

    app.post('/user',
      
      // Express Form Route Middleware: trims whitespace off of
      // the `username` field.
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

The API is chainable, so you can keep calling filter methods one after the other:

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
    
        Filters the field value using custom logic.
    
        Example:
        If the `name` field has a value of "hello there", this would
        transform it to "hello-there". 

        filter("name").custom(function(value) {
          return value.replace(/\s+/g, "-");
        });
    

### Validators

The `validate` property of the module creates a validator object tied to a specific field.

    validate(fieldname[, label]);
    // -> Validator

The API is chainable, so you can keep calling validator methods one after the other:

    validate("username").required().isAlphanumeric()


#### Validator API:

**Validation messages**: each validator has its own default validation message. These can easily be overridden at runtime by passing a custom validation message to the validator. The custom message is always the **last** argument passed to the validator.

Use "%s" in the message to have the field name or label printed in the message:

    validate("username").required()
    // -> "username is required"
    
    validate("username").required("What is your %s?")
    // -> "What is your username?"
    
    validate("username", "Username").required("What is your %s?")
    // -> "What is your Username?"


**Validation Methods**

*By Regular Expressions*

    regex(pattern[, modifiers[, message]])
    - pattern (RegExp|String): RegExp (with flags) or String pattern.
    - modifiers (String): Optional, and only if `pattern` is a String.
    - message (String): Optional validation message.
    
        alias: is

        Checks that the value matches the given regular expression.
    
        Example:

        validate("username").is("[a-z]", "i", "Only letters are valid in %s")
        validate("username").is(/[a-z]/i, "Only letters are valid in %s")
    
    
    notRegex(pattern[, modifiers[, message]])
    - pattern (RegExp|String): RegExp (with flags) or String pattern.
    - modifiers (String): Optional, and only if `pattern` is a String.
    - message (String): Optional validation message.
    
        alias: not

        Checks that the value does NOT match the given regular expression.
    
        Example:

        validate("username").not("[a-z]", "i", "Letters are not valid in %s")
        validate("username").not(/[a-z]/i, "Letters are not valid in %s")


*By Type*

    isNumeric([message])

    isInt([message])

    isDecimal([message])

    isFloat([message])


*By Format*

    isEmail([message])

    isUrl([message])

    isIP([message])

    isAlpha([message])

    isAlphanumeric([message])

    isLowercase([message])

    isUppercase([message])


*By Content*

    notEmpty([message])
    
        Checks if the value is not just whitespace.
        

    equals( value [, message] )
    - value (String): A value that should match the field value OR a fieldname
                      token to match another field, ie, `field::password`.
        
        Compares the field to `value`.
    
        Example:
        validate("username").equals("admin")

        validate("password").is(/^\w{6,20}$/)
        validate("password_confirmation").equals("field::password")


    contains(value[, message])
    - value (String): The value to test for.
        
        Checks if the field contains `value`.
        

    notContains(string[, message])
    - value (String): A value that should not exist in the field.

        Checks if the field does NOT contain `value`.


*Other*
    
    required([message])
    
        Checks that the field is present in form data, and has a value.
        
        
    custom(function[, message])
    - function (Function): A custom validation function.
    
        Validates the field using a custom validation function. If the function
        throws, and `message` is not provided, the thrown error message is used.
        
        Example:
        
        validate("username").custom(function(value) {
            if (value !== "admin") {
                throw new Error("%s must be 'admin'.");
            }
        });



### http.ServerRequest.prototype.form

Express Form adds a `form` object with various properties to the request.

    isValid -> Boolean

    errors  -> Array

    flashErrors(name) -> undefined
    
        Flashes all errors. Configurable, enabled by default.
    
    getErrors(name) -> Array
    - fieldname (String): The name of the field
    
        Gets all errors for the field with the given name.

    Example request handler:
    
    function(req, res) {
      if (req.isValid == false) {
        console.log(req.errors);
        console.log(req.getErrors("username"))
      }
    }


Installation:
-------------

    npm install express-form


Credits
-------

Currently, Express Form uses many of the validation and filtering functions provided by Chris O'Hara's [node-validator](https://github.com/chriso/node-validator).
