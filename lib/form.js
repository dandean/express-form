var validator = require("validator"),
    object = require("object-additions").object;
    
/*!
 * Express - Form
 * Copyright(c) 2010 Dan Dean <me@dandean.com>
 * MIT Licensed
 */

var Filter = require("./filter");
var Validator = require("./validator");

var dataSources = ["body", "query", "params"];

function form() {
  var routines = Array.prototype.slice.call(arguments);
  
  return function(req, res, next) {
    if (!req.form) {
      req.form = {};
    }
    
    dataSources.forEach(function(source) {
      if (req[source] && !object.isString(req[source])) {
        Object.keys(req[source]).forEach(function(name) {
          req.form[name] = req[source][name];
        });
      }
    });
    
    var map = {};
    
    Object.defineProperties(req.form, {
      "errors": {
        value: [],
        enumerable: false
      },
      "getErrors": {
        value: function(name) {
          return map[name] || [];
        },
        enumerable: false
      },
      "isValid": {
        get: function() {
          return this.errors.length == 0;
        },
        enumerable: false
      }
    });

    routines.forEach(function(routine) {
      var result = routine.run(req.form);
      
      if (Array.isArray(result) && result.length) {
        var errors = req.form.errors = req.form.errors || [],
            name = routine.name;
        
        map[name] = map[name] || [];
        
        result.forEach(function(error) {
          errors.push(error);
          map[name].push(error);
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

form.configure = function(options) {
  if (options) {
    if ("dataSources" in options) {
      dataSources = [];
      var sources = options.dataSources;
      if (object.isString(sources)) {
        dataSources.push(sources);
      } else if (Array.isArray(sources)) {
        sources.forEach(function(source) { dataSources.push(source); });
      }
    }
  }
  return this;
};

module.exports = form;
