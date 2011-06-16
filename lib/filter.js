var validator = require("validator"),
    FilterPrototype = validator.Filter.prototype,
    object = require("object-additions").object;

function objBuilder(property, obj) {
  // Builds requested objects.
  var levels = property.split('.'); // Make array of properties.
  var first = levels.shift(); // Get current highest level and remove it from array.
  if (levels.length) { // ie: Not at the lowest level.
    if (typeof obj[first] !== "object") {
      obj[first] = {};
    }
    objBuilder(levels.join('.'), obj[first]); // Recursion
  } else { // Lowest level.
    if (!Array.isArray(obj[first]) && typeof obj[first] !== "string") {
      obj[first] = ""; // Default value.
    }
  }
  return obj; // return a reference to the object
}

function objGetter(property, obj, value) {
  // Assumes obj's property exists. Build first!
  var levels = property.split('.');
  for(var i = 0, len = levels.length; i < len; i++) {
    var p = levels[i];
    if (i + 1 === levels.length && value) {
      obj[p] = value; // Set value.
    }
    if (typeof obj[p] === "undefined") {
      return console.log("objGetter found undefined!");
    }
    obj = obj[p];
  }
  return obj;
}

function trim(value) {
  return validator.sanitize(value).trim();
}

function Filter(property) {
  var stack = [];

  this.add = function(func) {
    stack.push(func);
    return this;
  };
  
  this.run = function(reqBody, reqForm, autoTrim) {
    objBuilder(property, reqBody);
    objBuilder(property, reqForm);
    var value = objGetter(property, reqBody);
    if(Array.isArray(value)) {
      value = value.slice(0); // kill references...
      for (var i = 0, len = value.length; i < len; i++) {
        if (autoTrim) {
          value[i] = trim(value[i]);
        }
        stack.forEach(function(filter) {
          value[i] = filter(value[i]);
        });
      }
    } else {
      if (autoTrim) {
        value = trim(value);
      }
      stack.forEach(function(filter) {
        value = filter(value);
      }); 
    }
    objGetter(property, reqForm, value);
  };
}

var externalFilter = new validator.Filter();

Object.keys(FilterPrototype).forEach(function(name) {
  if (name.match(/^ifNull$/)) // Skip built-in ifNull implementation.
    return;
  
  Filter.prototype[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    return this.add(function(value) {
      return FilterPrototype[name].apply(externalFilter.sanitize(value), args);
    });
  };
});

Filter.prototype.ifNull = function(replacement) {
  return this.add(function(value) {
    if (object.isUndefined(value) || null === value || '' === value) {
      return replacement;
    }
    return value;
  });
};

Filter.prototype.toUpper = Filter.prototype.toUpperCase = function() {
  return this.add(function(value) {
    return value.toUpperCase();
  });
};

Filter.prototype.toLower = Filter.prototype.toLowerCase = function() {
  return this.add(function(value) {
    return value.toLowerCase();
  });
};

Filter.prototype.truncate = function(length) {
  return this.add(function(value) {
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

Filter.prototype.custom = function(func) {
  return this.add(func);
};

module.exports = Filter;
