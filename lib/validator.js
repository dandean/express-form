var validator = require("validator"),
    ValidatorPrototype = validator.Validator.prototype,
    object = require("object-additions").object;

var externalValidator = new validator.Validator();

function hasValue(value) {
  return !(undefined === value || null === value || "" === value);
}

function Validator(fieldname, label) {
  var stack = [];
  var fieldLabel = label || fieldname;
  
  this.name = fieldname;
  this.__required = false;
  
  this.add = function(func) {
    stack.push(func);
    return this;
  };
  
  this.run = function(formData) {
    var errors = [];

    stack.forEach(function(validate) {
      validate.getValue = function(name) {
        var match = name.match(/^([^\[]*)(?:\[(.*)\])*$/);
        var value = formData[match[1] || name];
        if(match.length > 2) { // if complex property (e.g. user[info][password])
          for(var mi = 2, mval; mval = match[mi]; mi++) value = value[mval];
        }
        return value;
      };
      var value = validate.getValue(fieldname);
      
      if (false === this.__required && false === hasValue(value)) {
        // If this field is not required and it doesn't have a value,
        // don't run the validator on its value.
        return;
      }
      
      try {
        validate(value);

      } catch(e) {
        var message = (e.message || e).toString().replace("%s", fieldLabel);
        errors.push(message);
      }
    }.bind(this));
    
    if (errors.length) return errors;
  };
}

const MESSAGES = {
  isEmail: "%s is not an email address",
  isUrl: "%s is not a URL",
  isIP: "%s is not an IP address",
  isAlpha: "%s contains non-letter characters",
  isAlphanumeric: "%s contains non alpha-numeric characters",
  isNumeric: "%s is not numeric",
  isLowercase: "%s contains uppercase letters",
  isUppercase: "%s contains lowercase letters",
  isInt: "%s is not an integer",
  notEmpty: "%s has no value or is only whitespace",
  contains: "%s does not contain required characters",
  notContains: "%s contains invalid characters"
};

Object.keys(ValidatorPrototype).forEach(function(name) {
  if (name.match(/^(equals|check|validate|assert|error|len|isNumeric|isDecimal|isFloat|regex|notRegex|is|not|notNull|isNull)$/))
    return;

  Validator.prototype[name] = function() {
    var args = Array.prototype.slice.call(arguments);

    var message = undefined;

    if (args.length) {
      switch(name) {
        case "contains":
        case "notContains":
          message = args[1];
          break;
        default:
          message = args[0];
      }
    }
    
    message = message || MESSAGES[name];

    return this.add(function(value) {
      return ValidatorPrototype[name].apply(externalValidator.check(value, message), args);
    });
  };
});

Validator.prototype.equals = function(other, message) {
  if (object.isString(other) && other.match(/^field::/)) {
    this.__required = true;
  }

  return this.add(function(value) {
    // If other is a field token (field::fieldname), grab the value of fieldname
    // and use that as the OTHER value.
    if (object.isString(other) && other.match(/^field::/)) {
      other = arguments.callee.getValue(other.replace(/^field::/, ''));
    }
    if (value != other) {
      throw new Error(message || "%s does not equal " + String(other));
    }
  });
};

// node-validator's numeric validator seems unintuitive. All numeric values should be valid, not just int.
Validator.prototype.isNumeric = function(message) {
  return this.add(function(value) {
    if (object.isNumber(value) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.?[0-9]+$/))) {
    } else {
      throw new Error(message || "%s is not a number");
    }
  });
};

// node-validator's decimal/float validator incorrectly thinks Ints are valid.
Validator.prototype.isDecimal = function(message) {
  return this.add(function(value) {
    if ((object.isNumber(value) && value % 1 == 0) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.[0-9]+$/))) {
    } else {
      throw new Error(message || "%s is not a decimal");
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
      throw new Error(message || "%s has invalid characters");
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
      throw new Error(message || "%s has invalid characters");
    }
  });
};

Validator.prototype.required = function(placeholderValue, message) {
  this.__required = true;
  return this.add(function(value) {
    if (!hasValue(value) || value == placeholderValue) {
      throw new Error(message || "%s is required");
    }
  });
};

Validator.prototype.minLength = function(length, message) {
  return this.add(function(value) {
    if (value.toString().length < length) {
      throw new Error(message || "%s is too short");
    }
  });
};

Validator.prototype.maxLength = function(length, message) {
  return this.add(function(value) {
    if (value.toString().length > length) {
      throw new Error(message || "%s is too long");
    }
  });
};

Validator.prototype.custom = function(func, message) {
  return this.add(function(value) {
    try {
      func(value);
    } catch (e) {
      throw new Error(message || e.message || "%s is invalid");
    }
  });
};

module.exports = Validator;
