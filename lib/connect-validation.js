var validator = require("validator"),
    object = require("object-additions").object;
    

/*!
 * Connect - Validation
 * Copyright(c) 2010 Dan Dean <me@dandean.com>
 * MIT Licensed
 */

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
    
    Object.defineProperty(req.form, "isValid", {
      value: req.form.errors === undefined,
      enumerable: true
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
