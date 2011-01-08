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
  var stack = [];
  
  this.extend = function(func) {
    stack.push(func);
    return this;
  };
  
  this.run = function(formData) {
    stack.forEach(function(filter) {
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


var externalValidator = new validator.Validator();

function Validator(fieldname, label) {
  var stack = [];
  var fieldLabel = label || fieldname;
  
  this.extend = function(func) {
    stack.push(func);
    return this;
  };
  
  this.run = function(formData) {
    var errors = [];

    stack.forEach(function(validate) {
      try {
        validate(formData[fieldname]);
      } catch(e) {
        var message = (e.message || e).toString().replace("%s", fieldLabel);
        errors.push(message);
      }
    });
    
    if (errors.length) return errors;
  };
}

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
      if (typeof value == "undefined" || value === undefined) {
        return value;
      }
      return ValidatorPrototype[name].apply(externalValidator.check(value, message), args);
    });
  };
});

// Alias "len" validator to more readable "length"
Validator.prototype.length = Validator.prototype.len;

// node-validator's numeric validator seems unintuitive. All numeric values should be valid, not just int.
Validator.prototype.isNumeric = function(message) {
  return this.extend(function(value) {
    if (object.isNumber(value) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.?[0-9]+$/))) {
    } else {
      throw new Error(message || "Invalid number");
    }
  });
};

// node-validator's decimal/float validator incorrectly thinks Ints are valid.
Validator.prototype.isDecimal = function(message) {
  return this.extend(function(value) {
    if ((object.isNumber(value) && value % 1 == 0) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.[0-9]+$/))) {
    } else {
      throw new Error(message || "Invalid decimal");
    }
  });
};

Validator.prototype.isFloat = Validator.prototype.isDecimal;

Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers, message) {
  // regex(/pattern/)
  // regex(/pattern/, "message")
  // regex("pattern")
  // regex("pattern", "modifiers")
  // regex("pattern", "message")
  // regex("pattern", "modifiers", "message")
  
  if (pattern instanceof RegExp) {
    if (object.isString(modifiers) && modifiers.match(/^[gimy]+$/)) {
      throw new Error("Invalid arguments: `modifiers` can only be passed in if `pattern` is a string.");
    }

    message = modifiers;
    modifiers = undefined;
  
  } else if (object.isString(pattern)) {
    if (arguments.length == 2 && !modifiers.match(/^[gimy]+$/)) {
      // 2nd arg doesn't look like modifier flags, it's the message (might also be undefined)
      message = modifiers;
      modifiers = undefined;
    }
    pattern = new RegExp(pattern, modifiers);
  }
  
  return this.extend(function(value) {
    if (pattern.test(value) === false) {
      throw new Error(message || "Invalid characters");
    }
  });
};

Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers, message) {
  // notRegex(/pattern/)
  // notRegex(/pattern/, "message")
  // notRegex("pattern")
  // notRegex("pattern", "modifiers")
  // notRegex("pattern", "message")
  // notRegex("pattern", "modifiers", "message")
  
  if (pattern instanceof RegExp) {
    if (object.isString(modifiers) && modifiers.match(/^[gimy]+$/)) {
      throw new Error("Invalid arguments: `modifiers` can only be passed in if `pattern` is a string.");
    }

    message = modifiers;
    modifiers = undefined;
  
  } else if (object.isString(pattern)) {
    if (arguments.length == 2 && !modifiers.match(/^[gimy]+$/)) {
      // 2nd arg doesn't look like modifier flags, it's the message (might also be undefined)
      message = modifiers;
      modifiers = undefined;
    }
    pattern = new RegExp(pattern, modifiers);
  }
  
  return this.extend(function(value) {
    if (pattern.test(value) === true) {
      throw new Error(message || "Invalid characters");
    }
  });
};

Validator.prototype.required = function(placeholderValue, message) {
  return this.extend(function(value) {
    if (object.isUndefined(value) || value == null || value === '' || value == placeholderValue) {
      throw new Error(message || "%s is a required field");
    }
  });
};

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

