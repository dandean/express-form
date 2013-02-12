var validator = require("validator")
  , FilterPrototype = validator.Filter.prototype
  , ValidatorPrototype = validator.Validator.prototype
  , externalFilter = new validator.Filter()
  , externalValidator = new validator.Validator()
  , object = require("object-additions").object
  , utils = require("./utils");

function Field(property, label) {
  var stack = []
    , isArray = false
    , fieldLabel = label || property;

  this.name = property;
  this.__required = false;
  
  this.add = function(func) {
    stack.push(func);
    return this;
  };
  
  this.array = function() {
    isArray = true;
    return this;
  };
  
  this.run = function (source, form, options) {
    var self = this
      , errors = []
      , value = utils.getProp(property, form) || utils.getProp(property, source);
    
    if (options.autoTrim) {
      stack.unshift(function (value) {
        if (object.isString(value)) {
          return FilterPrototype.trim.apply(externalFilter.sanitize(value));
        }
        return value;
      });
    }
    
    function runStack(foo) {
      
      stack.forEach(function (proc) {
        var result = proc(foo, source); // Pass source for "equals" proc.
        if (result.valid) return;
        if (result.error) {
          // If this field is not required and it doesn't have a value, ignore error.
          if (!utils.hasValue(value) && !self.__required) return;
          
          return errors.push(result.error.replace("%s", fieldLabel));
        }
        foo = result;
      });
      
      return foo;  
    }
    
    if (isArray) {
      if (!utils.hasValue(value)) value = [];
      if (!Array.isArray(value)) value = [value];
      value = value.map(runStack);

    } else {
      if (Array.isArray(value)) value = value[0];
      value = runStack(value);
    }
    
    utils.setProp(property, form, value);
    
    if (errors.length) return errors;
  };
}

// ARRAY METHODS

Field.prototype.array = function () {
  return this.array();
};

Field.prototype.arrLength = function (from, to) {
  return this.add(function (arr) {
    if (value.length < from) {
      return { error: message || e.message || "%s is too short" };
    }
    if (value.length > to) {
      return { error: message || e.message || "%s is too long" };
    }
    return { valid: true };
  });
}

// HYBRID METHODS

Field.prototype.custom = function(func, message) {
  return this.add(function (value, source) {
    try {
      var result = func(value, source);
    } catch (e) {
      return { error: message || e.message || "%s is invalid" };
    }
    // Functions that return values are filters.
    if (result != null) return result;
    
    return { valid: true };
  });
};

// FILTER METHODS

Object.keys(FilterPrototype).forEach(function (name) {
  if (name.match(/^ifNull$/)) return;
  
  Field.prototype[name] = function () {
    var args = arguments;
    return this.add(function (value) {
      var a = FilterPrototype[name].apply(externalFilter.sanitize(value), args);
      return a;
    });
  };
});

Field.prototype.ifNull = function (replacement) {
  return this.add(function (value) {
    if (object.isUndefined(value) || null === value || '' === value) {
      return replacement;
    }
    return value;
  });
};

Field.prototype.toUpper = Field.prototype.toUpperCase = function () {
  return this.add(function (value) {
    return value.toUpperCase();
  });
};

Field.prototype.toLower = Field.prototype.toLowerCase = function () {
  return this.add(function (value) {
    return value.toLowerCase();
  });
};

Field.prototype.truncate = function (length) {
  return this.add(function (value) {
    if (value.length <= length) {
      return value;
    }
    
    if (length <= 3) return "...";
    
    if (value.length > length - 3) {
      return value.substr(0,length - 3) + "...";
    }
    
    return value;
  });
};

Field.prototype.customFilter = function (func) {
  return this.add(func);
};

// VALIDATE METHODS

var MESSAGES = {
  isDate: "%s is not a date",
  isEmail: "%s is not an email address",
  isUrl: "%s is not a URL",
  isIP: "%s is not an IP address",
  isAlpha: "%s contains non-letter characters",
  isAlphanumeric: "%s contains non alpha-numeric characters",
  isNumeric: "%s is not numeric",
  isLowercase: "%s contains uppercase letters",
  isUppercase: "%s contains lowercase letters",
  isInt: "%s is not an integer",
  notEmpty: "%s has no value or is only whitespace"
};

Object.keys(ValidatorPrototype).forEach(function (name) {
  if (name.match(/^(contains|notContains|equals|check|validate|assert|error|len|isNumeric|isDecimal|isFloat|regex|notRegex|is|not|notNull|isNull)$/)) {
    return;
  }

  Field.prototype[name] = function (message) {
    var args = arguments;
    message = message || MESSAGES[name];

    return this.add(function(value) {
      try {
        ValidatorPrototype[name].apply(externalValidator.check(value, message), args);
      } catch (e) {
        return { error: e.message || e.toString() };
      }
      return { valid: true };
    });
  };
});

Field.prototype.contains = function (test, message) {
  return this.add(function(value) {
    try {
      ValidatorPrototype.contains.call(externalValidator.check(value, message), test);
    } catch (e) {
      return { error: message || "%s does not contain required characters" };
    }
    return { valid: true };
  });
};

Field.prototype.notContains = function (test, message) {
  return this.add(function (value) {
    try {
      ValidatorPrototype.notContains.call(externalValidator.check(value, message), test);
    } catch (e) {
      return { error: message || "%s contains invalid characters" };
    }
    return { valid: true };
  });
};


Field.prototype.equals = function (other, message) {
  if (object.isString(other) && other.match(/^field::/)) {
    this.__required = true;
  }
  
  return this.add(function (value, source) {
    // If other is a field token (field::fieldname), grab the value of fieldname
    // and use that as the OTHER value.
    var test = other;
    if (object.isString(other) && other.match(/^field::/)) {
      test = utils.getProp(other.replace(/^field::/, ""), source);
    }
    if (value != test) {
      return { error: message || "%s does not equal " + String(test) };
    }
    return { valid: true };
  });
};

// node-validator's numeric validator seems unintuitive. All numeric values should be valid, not just int.
Field.prototype.isNumeric = function (message) {
  return this.add(function (value) {
    if (object.isNumber(value) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.?[0-9]+$/))) {
    } else {
      return { error: message || "%s is not a number" };
    }
    return { valid: true };
  });
};

// node-validator's decimal/float validator incorrectly thinks Ints are valid.
Field.prototype.isFloat = Field.prototype.isDecimal = function (message) {
  return this.add(function (value) {
    if ((object.isNumber(value) && value % 1 == 0) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.[0-9]+$/))) {
    } else {
      return { error: message || "%s is not a decimal" };
    }
    return { valid: true };
  });
};

Field.prototype.regex = Field.prototype.is = function (pattern, modifiers, message) {
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
  
  return this.add(function (value) {
    if (pattern.test(value) === false) {
      return { error: message || "%s has invalid characters" };
    }
    return { valid: true };
  });
};

Field.prototype.notRegex = Field.prototype.not = function(pattern, modifiers, message) {
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
      return { error: message || "%s has invalid characters" };
    }
    return { valid: true };
  });
};

Field.prototype.required = function (placeholderValue, message) {
  this.__required = true;
  return this.add(function (value) {
    if (!utils.hasValue(value) || value == placeholderValue) {
      return { error: message || "%s is required" };
    }
    return { valid: true };
  });
};

Field.prototype.minLength = function (length, message) {
  return this.add(function(value) {
    if (value.toString().length < length) {
      return { error: message || "%s is too short" };
    }
    return { valid: true };
  });
};

Field.prototype.maxLength = function (length, message) {
  return this.add(function(value) {
    if (value.toString().length > length) {    
      return { error: message || "%s is too long" };
    }
    return { valid: true };
  });
};

Field.prototype.customValidator = function(func, message) {
  return this.add(function(value, source) {
    try {
      func(value, source);
    } catch (e) {
      return { error: message || e.message || "%s is invalid" };
    }
    return { valid: true };
  });
};

module.exports = Field;