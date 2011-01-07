//var validator = require("../../node-validator"),
var validator = require("validator"),
    FilterPrototype = validator.Filter.prototype,
    ValidatorPrototype = validator.Validator.prototype,
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

/**
 * - Populate filter class with filter methods
 * - Allow for runtime extension
**/

function Filter(fieldname) {
  this.stack = [];
  
  this.extend = function(func) {
    this.stack.push(func);
    return this;
  };
  
  this.run = function(formData) {
    this.stack.forEach(function(filter) {
      formData[fieldname] = filter(formData[fieldname]);
    });
  };
}

var externalFilter = new validator.Filter();

Object.keys(FilterPrototype).forEach(function(name) {
  Filter.prototype[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    return this.extend(function(value) {
      return FilterPrototype[name].apply(externalFilter.sanitize(value), args);
    });
  };
});

Filter.prototype.toUpper = function() {
  return this.extend(function(value) {
    return value.toUpperCase();
  });
};

Filter.prototype.truncate = function(length) {
  return this.extend(function(value) {
    if (value.length > length) {
      return value.substr(0,length);
    }
    return value;
  });
};

Filter.prototype.custom = function(func) {
  return this.extend(func);
};


function Validator(fieldname) {
  this.stack = [];
  
  this.extend = function(func) {
    this.stack.push(func);
    return this;
  };
  
  this.run = function(formData) {
    var errors = [];

    this.stack.forEach(function(validate) {
      try {
        validate(formData[fieldname]);
      } catch(e) {
        errors.push(e.toString());
      }
    });
    
    if (errors.length) return errors;
  };
}

var externalValidator = new validator.Validator();

Object.keys(ValidatorPrototype).forEach(function(name) {
  Validator.prototype[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    
    var message = undefined;
    
    if (args.length) {
      switch(name) {
        case "equals":
        case "contains":
        case "notContains":
          message = args[1];
          break;
        case "regex":
        case "notRegex":
        case "len":
          message = args[2];
          break;
        default:
          message = args[0];
      }
    }
    
    return this.extend(function(value) {
      return ValidatorPrototype[name].apply(externalValidator.check(value, message), args);
    });
  };
});

Validator.prototype.required = function(placeholderValue, message) {
  return this.extend(function(value) {
    if (object.isUndefined(value) || value == null || value === '' || value == placeholderValue) {
      throw new Error(message || "Field does not have a value.");
    }
  });
};

// TODO: fix object.isUndefined to also just compare to undefined

//ValidatorPrototype.required = function(placeholderValue) {
//  if (object.isUndefined(this.str) || this.str == null || this.str === '' || this.str == placeholderValue) {
//    this.error(this.msg || "Field does not have a value.");
//  }
//  return this;
//};




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
    
    console.log(req.form.errors);
    
    if (next) next();
  };
}

form.filter = function(fieldname) {
  return new Filter(fieldname);
};

form.validator = function(fieldname) {
  return new Validator(fieldname);
};

module.exports = form;









//ValidatorPrototype.required = function(placeholderValue) {
//  if (object.isUndefined(this.str) || this.str == null || this.str === '' || this.str == placeholderValue) {
//    this.error(this.msg || "Field does not have a value.");
//  }
//  return this;
//};

//function parseFilters(definition) {
//  var filters = [],
//      base = FilterPrototype;
//
//  var push = function(obj) {
//    
//    // Filter must be a string
//    if (object.isString(obj)) {
//      
//      // Find the filter name
//      var name = (obj.match(/^\w+/) || [])[0];
//
//      if (name) {
//        // If filter exists
//        if (base[name]) {
//          // Create a script for extracting the arguments of the filter def.
//          var script = 'function ' + name + '() { return Array.prototype.slice.call(arguments); };';
//          script += obj;
//          if (!obj.match(/\(/)) script += "();";
//
//          // Extract the arguments
//          var args = process.compile(script, "args.js");
//
//          filters.push(function(value) {
//            return base[name].apply(sanitize(value), args);
//          });
//
//        } else {
//          throw new Error("Unknown filter: '" + name + "'");
//        }
//
//      } else {
//        throw new Error("Undefined filter name.");
//      }
//
//    } else if (object.isFunction(obj)) {
//      filters.push(obj);
//    }
//
//  };
//  
//  if (Array.isArray(definition)) {
//    definition.map(push);
//  } else push(definition);
//  
//  return filters;
//}
//
//function parseValidators(definition) {
//  var validators = [],
//      base = ValidatorPrototype;
//    
//  var push = function(obj) {
//    
//    // Validator is a string
//    if (object.isString(obj) || object.isFunction(obj)) {
//      
//      if (object.isString(obj)) {
//        // Find the validator name (function name)
//        var name = (obj.match(/^\w+/) || [])[0];
//        var message = undefined;
//        
//        // TODO: extract custom message from validator...
//        // TODO: content after 1st colon...
//
//        if (name) {
//          
//          var messageIndex = obj.indexOf("->");
//
//          if (obj.indexOf("->") > -1) {
//            message = obj.substr(messageIndex).replace("->", "").trim();
//            obj = obj.replace(message, "").replace("->", "").trim();
//            console.log(message);
//          }
//
//          // If validator exists
//          if (base[name]) {
//            // Create a script for extracting the arguments of the validator def.
//            var script = 'function ' + name + '() { return Array.prototype.slice.call(arguments); };';
//            script += obj;
//            if (!obj.match(/\(/)) script += "();";
//
//            // Extract the arguments
//            var args = process.compile(script, "args.js");
//
//            validators.push(function(value) {
//              // TODO: pass custom message in as 2nd value
//              return base[name].apply(check(value, message), args);
//            });
//
//          } else {
//            throw new Error("Unknown validator: '" + name + "'");
//          }
//        } else {
//          throw new Error("Undefined validator name.");
//        }
//
//      } else {
//        // TODO: how does a custom runtime validator pass its errors?
//        validators.push(obj);
//      }
//
//    }
//
//  };
//  
//  if (Array.isArray(definition)) {
//    definition.map(push);
//  } else push(definition);
//  
//  return validators;
//}





//module.exports = function(rules){
//  rules = rules || {};
//
//  return function(req, res, next){
//
//    var dataSources = {},
//        hasBody = !!req.body,
//        hasForm = !!req.form;
//
//    // TODO: none of the may be necessary if we use *either* connect-form
//    // TODO: or bodyDecoder alone.
//    var getDataSource = function(name) {
//      var source;
//      if (dataSources[name]) {
//        source = dataSources[name];
//      } else {
//        if (hasForm && (name in req.form)) {
//          source = req.form;
//        } else if (hasBody && (name in req.body)) {
//          source = req.body;
//        }
//        dataSources[name] = source;
//      }
//      return source || {};
//    };
//
//    if (!hasForm) req.form = {};
//    
//    req.form.get = function(name) {
//      return getDataSource(name)[name];
//    };
//
//    req.form.set = function(name, value) {
//      getDataSource(name)[name] = value;
//    };
//    
//    var addError = function(message) {
//      req.form.errors = req.form.errors || [];
//      req.form.errors.push(message);
//    };
//    
//    // TODO: will this stuff work with connect-form?
//    // -- play with connect-form to see how it works beside other middleware.
//    // -- How will it work with body decoder?
//    //
//    // I'm afraid there might be some async nightmares waiting for me with
//    // file uploads and connect-form/formidable
//    
//    Object.keys(rules).forEach(function(fieldname) {
//      
//      // Get the value
//      var value = req.form.get(fieldname);
//      
//      // Get an array of filters
//      var filters = parseFilters(rules[fieldname].filter);
//      
//      filters.forEach(function(filter) {
//        value = filter(value);
//      });
//      
//      req.form.set(fieldname, value);
//      
//      var validators = parseValidators(rules[fieldname].validate);
//      validators.forEach(function(validate) {
//        
//        if (validate == "required") {
//          console.log("%s is a required field.", fieldname);
//        } else {
//          try {
//            validate(value);
//          } catch(e) {
//            addError(e.toString());
//          }
//        }
//      });
//      
//    });
//    
//    console.log(req.form.errors);
//    
//    if (next) next();
//  };
//};

// Options:
// * flash errors (false)
// * persist fields as locals (true)
// * debug (false)
module.exports.configure = function(options) {
};

