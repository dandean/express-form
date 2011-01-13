var validator = require("validator"),
    ValidatorPrototype = validator.Validator.prototype,
    object = require("object-additions").object;

var externalValidator = new validator.Validator();

function Validator(fieldname, label) {
  var stack = [];
  var fieldLabel = label || fieldname;
  
  this.add = function(func) {
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
  if (name.match(/^(check|validate|assert|error|len|isNumeric|isDecimal|isFloat|regex|notRegex|is|not)$/))
    return;

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
        default:
          message = args[0];
      }
    }

    return this.add(function(value) {
      if (typeof value == "undefined" || value === undefined) {
        return value;
      }
      return ValidatorPrototype[name].apply(externalValidator.check(value, message), args);
    });
  };
});

// node-validator's numeric validator seems unintuitive. All numeric values should be valid, not just int.
Validator.prototype.isNumeric = function(message) {
  return this.add(function(value) {
    if (object.isNumber(value) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.?[0-9]+$/))) {
    } else {
      throw new Error(message || "Invalid number");
    }
  });
};

// node-validator's decimal/float validator incorrectly thinks Ints are valid.
Validator.prototype.isDecimal = function(message) {
  return this.add(function(value) {
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
  
  return this.add(function(value) {
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
  
  return this.add(function(value) {
    if (pattern.test(value) === true) {
      throw new Error(message || "Invalid characters");
    }
  });
};

Validator.prototype.required = function(placeholderValue, message) {
  return this.add(function(value) {
    if (object.isUndefined(value) || value == null || value === '' || value == placeholderValue) {
      throw new Error(message || "Missing value");
    }
  });
};

Validator.prototype.custom = function(func, message) {
  return this.add(function(value) {
    try {
      func(value);
    } catch (e) {
      throw new Error(message || e.message || "Invalid field");
    }
  });
};

module.exports = Validator;
