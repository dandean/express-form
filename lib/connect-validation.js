var validator = require("validator"),
    object = require("object-additions").object;
    

/*!
 * Connect - Validation
 * Copyright(c) 2010 Dan Dean <me@dandean.com>
 * MIT Licensed
 */

function example_usage() {
  // Include it:
  var form = require("connect-validation"),
      filter = form.filter,
      validate = form.validate;

  form.addFilter("capitalize", function(value) {
    this.value = this.value.toUpperCase();
  });

  // Define a route:
  app.post(
    '/register',

    // Add validation route-middleware:
    form(
      filter("username").trim().toInt(),
      validate("username").alphaNumeric("%s must contain only letters and numbers.")
    ),

    function(req, res) {
      // Now we can inspect the errors!  
      if (req.form.errors) {
        // redirect or something
      }
      req.form.isValid; // --> true/false
      req.form.getError("username"); // --> false/message
    }
  );  
}

var Filter = require("./filter");
var Validator = require("./validator");

function form() {
  var routines = Array.prototype.slice.call(arguments);
  
  return function(req, res, next) {
    if (!req.form) {
      req.form = {};
    }
    
    routines.forEach(function(routine) {
      var result = routine.run(req.body);
      
      if (Array.isArray(result) && result.length) {
        var errors = req.form.errors = req.form.errors || [];
        result.forEach(function(error) {
          errors.push(error);
        });
      }
    });
    
    if (next) next();
  };
}

form.filter = function(fieldname) {
  return new Filter(fieldname);
};

form.validator = function(fieldname, label) {
  return new Validator(fieldname, label);
};

module.exports = form;

// Options:
// * flash errors (false)
// * persist fields as locals (true)
// * debug (false)
module.exports.configure = function(options) {
};

