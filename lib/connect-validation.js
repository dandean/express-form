//var validator = require("../../node-validator"),
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

ValidatorBase.required = function(placeholderValue) {
  if (object.isUndefined(this.str) || this.str == null || this.str === '' || this.str == placeholderValue) {
    this.error(this.msg || "Field does not have a value.");
  }
  return this;
};

function parseFilters(definition) {
  var filters = [],
      base = FilterBase;

  var push = function(obj) {
    
    // Filter must be a string
    if (object.isString(obj)) {
      
      // Find the filter name
      var name = (obj.match(/^\w+/) || [])[0];

      if (name) {
        // If filter exists
        if (base[name]) {
          // Create a script for extracting the arguments of the filter def.
          var script = 'function ' + name + '() { return Array.prototype.slice.call(arguments); };';
          script += obj;
          if (!obj.match(/\(/)) script += "();";

          // Extract the arguments
          var args = process.compile(script, "args.js");

          filters.push(function(value) {
            return base[name].apply(sanitize(value), args);
          });

        } else {
          throw new Error("Unknown filter: '" + name + "'");
        }

      } else {
        throw new Error("Undefined filter name.");
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

function parseValidators(definition) {
  var validators = [],
      base = ValidatorBase;
    
  var push = function(obj) {
    
    // Validator is a string
    if (object.isString(obj) || object.isFunction(obj)) {
      
      if (object.isString(obj)) {
        // Find the validator name (function name)
        var name = (obj.match(/^\w+/) || [])[0];
        var message = undefined;
        
        // TODO: extract custom message from validator...
        // TODO: content after 1st colon...

        if (name) {
          
          var messageIndex = obj.indexOf("->");

          if (obj.indexOf("->") > -1) {
            message = obj.substr(messageIndex).replace("->", "").trim();
            obj = obj.replace(message, "").replace("->", "").trim();
            console.log(message);
          }

          // If validator exists
          if (base[name]) {
            // Create a script for extracting the arguments of the validator def.
            var script = 'function ' + name + '() { return Array.prototype.slice.call(arguments); };';
            script += obj;
            if (!obj.match(/\(/)) script += "();";

            // Extract the arguments
            var args = process.compile(script, "args.js");

            validators.push(function(value) {
              // TODO: pass custom message in as 2nd value
              return base[name].apply(check(value, message), args);
            });

          } else {
            throw new Error("Unknown validator: '" + name + "'");
          }
        } else {
          throw new Error("Undefined validator name.");
        }

      } else {
        // TODO: how does a custom runtime validator pass its errors?
        validators.push(obj);
      }

    }

  };
  
  if (Array.isArray(definition)) {
    definition.map(push);
  } else push(definition);
  
  return validators;
}


module.exports = function(rules){
  rules = rules || {};

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
    
    var addError = function(message) {
      req.form.errors = req.form.errors || [];
      req.form.errors.push(message);
    };
    
    // TODO: will this stuff work with connect-form?
    // -- play with connect-form to see how it works beside other middleware.
    // -- How will it work with body decoder?
    //
    // I'm afraid there might be some async nightmares waiting for me with
    // file uploads and connect-form/formidable
    
    Object.keys(rules).forEach(function(fieldname) {
      
      // Get the value
      var value = req.form.get(fieldname);
      
      // Get an array of filters
      var filters = parseFilters(rules[fieldname].filter);
      
      filters.forEach(function(filter) {
        value = filter(value);
      });
      
      req.form.set(fieldname, value);
      
      var validators = parseValidators(rules[fieldname].validate);
      validators.forEach(function(validate) {
        
        if (validate == "required") {
          console.log("%s is a required field.", fieldname);
        } else {
          try {
            validate(value);
          } catch(e) {
            addError(e.toString());
          }
        }
      });
      
    });
    
    console.log(req.form.errors);
    
    if (next) next();
  };
};

// Options:
// * flash errors (false)
// * persist fields as locals (true)
// * debug (false)
module.exports.configure = function(options) {
};

