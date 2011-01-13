var validator = require("validator"),
    FilterPrototype = validator.Filter.prototype,
    object = require("object-additions").object;

function Filter(fieldname) {
  var stack = [];

  this.add = function(func) {
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
    if (object.isUndefined(value) || value === null || value === '') {
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
