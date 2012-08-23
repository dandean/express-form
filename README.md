[![build status](https://secure.travis-ci.org/dandean/express-form.png)](http://travis-ci.org/dandean/express-form)
**<span style="color:red;">NOTE:</span> I am no longer maintaining this project. Let me know if you'd like to take it on, and I'll give you publishing rights for it on NPM.**

---

Express Form provides data filtering and validation as route middleware to your Express applications.

Usage:
------

    var form = require("express-form"),
        field = form.field;

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
        field("username").trim().required().is(/^[a-z]+$/),
        field("password").trim().required().is(/^[0-9]+$/),
        field("email").trim().isEmail()
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
      form(form.field("username").trim()),
      
      // standard Express handler
      function(req, res) {
        // ...
      }
    );


### Fields

The `field` property of the module creates a filter/validator object tied to a specific field.

    field(fieldname[, label]);

You can access nested properties with either dot or square-bracket notation.
    
    field("post.content").minLength(50),
    field("post[user][id]").isInt(),
    field("post.super.nested.property").required()

Simply specifying a property like this, makes sure it exists. So, even if `req.body.post` was undefined, `req.form.post.content` would be defined. This helps avoid any unwanted errors in your code.

The API is chainable, so you can keep calling filter/validator methods one after the other:

    filter("username").trim().toLower().truncate(5).required().isAlphanumeric()

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
        
### Array Method

    array()
        Using the array() flag means that field always gives an array. If the field value is an array, but there is no flag, then the first value in that array is used instead.

        This means that you don't have to worry about unexpected post data that might break your code. Eg/ when you call an array method on what is actually a string.

        field("project.users").array(),
        // undefined => [], "" => [], "q" => ["q"], ["a", "b"] => ["a", "b"]

        field("project.block"),
        // project.block: ["a", "b"] => "a". No "array()", so only first value used.

        In addition, any other methods called with the array method, are applied to every value within the array.

        field("post.users").array().toUpper()
        // post.users: ["one", "two", "three"] => ["ONE", "TWO", "THREE"]

### Custom Methods

    custom(function[, message])
    - function (Function): A custom filter or validation function.

        This method can be utilised as either a filter or validator method.

        If the function throws an error, then an error is added to the form. (If `message` is not provided, the thrown error message is used.)

        If the function returns a value, then it is considered a filter method, with the field then becoming the returned value.

        If the function returns undefined, then the method has no effect on the field.
    
        Examples:

        If the `name` field has a value of "hello there", this would
        transform it to "hello-there". 

        field("name").custom(function(value) {
          return value.replace(/\s+/g, "-");
        });

        Throws an error if `username` field does not have value "admin".
        
        field("username").custom(function(value) {
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

    getErrors(name) -> Array or Object if no name given
    - fieldname (String): The name of the field
    
        Gets all errors for the field with the given name.

        You can also call this method with no parameters to get a map of errors for all of the fields.

    Example request handler:
    
    function(req, res) {
      if (!req.form.isValid) {
        console.log(req.errors);
        console.log(req.getErrors("username"));
        console.log(req.getErrors());
      }
    }

### Configuration

Express Form has various configuration options, but aims for sensible defaults for a typical Express application.

    form.configure(options) -> self
    - options (Object): An object with configuration options.

    flashErrors (Boolean): If validation errors should be automatically passed to Express’ flash() method. Default: true.

    autoLocals (Boolean): If field values from Express’ request.body should be passed into Express’ response.locals object. This is helpful when a form is invalid an you want to repopulate the form elements with their submitted values. Default: true.

    Note: if a field name dash-separated, the name used for the locals object will be in camelCase.

    dataSources (Array): An array of Express request properties to use as data sources when filtering and validating data. Default: ["body", "query", "params"].

    autoTrim (Boolean): If true, all fields will be automatically trimmed. Default: false.

    passThrough (Boolean): If true, all data sources will be merged with `req.form`. Default: false.


Installation:
-------------

    npm install express-form


Credits
-------

Currently, Express Form uses many of the validation and filtering functions provided by Chris O'Hara's [node-validator](https://github.com/chriso/node-validator).
