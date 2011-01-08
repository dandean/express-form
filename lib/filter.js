var validator = require("validator"),
    FilterPrototype = validator.Filter.prototype,
    object = require("object-additions").object;

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

module.exports = Filter;
