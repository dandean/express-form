var validator = require("validator"),
    FilterBase = validator.Filter.prototype,
    ValidatorBase = validator.Validator.prototype,
    check = validator.check,
    sanitize = validator.sanitize,
    object = require("object-additions").object;
    

/*!
 * Connect - Validation
 * Copyright(c) 2010 Dan Dean <me@dandean.com>
 * MIT Licensed
 */

//  Usage:
//  ======
//
//  // Include it:
//  var form = require("connect-validation");
//
//  // Define a route:
//  app.post(
//    '/register',
//
//    // Add validation route-middleware:
//    validation({
//      "username": {
//        filter: ["trim", "toInt"],
//        validate: "alphanumeric: %s "
//      }
//    }, {flash: true, retain: true}),
//
//    function(req, res) {
//      // Now we can inspect the errors!  
//      if (req.form.errors) {
//        // redirect or something
//      }
//      req.form.isValid; --> true/false
//      req.form.getError("username") --> false/message
//    }
//  );

function parseFilters(definition) {
  var filters = [],
      base = FilterBase;

  var push = function(obj) {
    
    // Filter must be a string
    if (object.isString(obj)) {
      
      // Find the filter name
      var name = (obj.match(/^\w+/) || [])[0];

      // If filter exists
      if (name && base[name]) {
        
        // Create a script for extracting the arguments of the filter def.
        var script = 'function ' + name + '() { return Array.prototype.slice.call(arguments); };';
        script += obj;
        if (!obj.match(/\(/)) script += "();";
        
        // Extract the arguments
        var args = process.compile(script, "args.js");
        
        filters.push(function(value) {
          return base[name].apply(sanitize(value), args);
        });
      }

    } else if (object.isFunction(obj)) {
      filters.push(obj);
    }

  };
  
  if (Array.isArray(definition)) {
    definition.map(push);
  } else push(definition);
  
  return filters;
}

module.exports = function(options){
  options = options || {};

  return function(req, res, next){

    var dataSources = {},
        hasBody = !!req.body,
        hasForm = !!req.form;

    // TODO: none of the may be necessary if we use *either* connect-form
    // TODO: or bodyDecoder alone.
    var getDataSource = function(name) {
      var source;
      if (dataSources[name]) {
        source = dataSources[name];
      } else {
        if (hasForm && (name in req.form)) {
          source = req.form;
        } else if (hasBody && (name in req.body)) {
          source = req.body;
        }
        dataSources[name] = source;
      }
      return source || {};
    };

    if (!hasForm) req.form = {};
    
    req.form.get = function(name) {
      return getDataSource(name)[name];
    };

    req.form.set = function(name, value) {
      getDataSource(name)[name] = value;
    };
    
    // TODO: will this stuff work with connect-form?
    // -- play with connect-form to see how it works beside other middleware.
    // -- How will it work with body decoder?
    //
    // I'm afraid there might be some async nightmares waiting for me with
    // file uploads and connect-form/formidable
    
    Object.keys(options).forEach(function(fieldname) {
      // Get the value
      var value = req.form.get(fieldname);
      
      // Get an array of filters
      var filters = parseFilters(options[fieldname].filter);
      
      filters.forEach(function(filter) {
        value = filter(value);
      });
      
      req.form.set(fieldname, value);
      
      // TODO: var validators = parseValidators(options[fieldname].validate);
    });
    
    if (next) next();
  };
};

// Options:
// * flash errors (false)
// * persist fields as locals (true)
// * debug (false)
module.exports.configure = function(options) {
};

