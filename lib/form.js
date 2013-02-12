/*!
 * Express - Form
 * Copyright(c) 2010 Dan Dean <me@dandean.com>
 * MIT Licensed
 */

var utils = require("./utils")
  , Field = require("./field");

function form() {
  var routines = Array.prototype.slice.call(arguments)
    , options = form._options;
  
  return function (req, res, next) {
    var map = {}
      , flashed = {}
      , mergedSource = {};
    
    if (!req.form) req.form = {};
    
    options.dataSources.forEach(function (source) {
      utils.merge(mergedSource, req[source]);
    });
    
    if (options.passThrough) req.form = utils.clone(mergedSource);
    
    if (options.autoLocals) {
      for (var prop in req.body) {
        if (!req.body.hasOwnProperty(prop)) continue;
        
        if (res.local && typeof res.locals === "function") { // Express 2.0 Support
          res.local(utils.camelize(prop), req.body[prop]);
        } else if (typeof res.locals === "function") { // Express 3.0
          res.locals(utils.camelize(prop), req.body[prop]);
        } else {
          if (!res.locals) res.locals = {};
          res.locals[utils.camelize(prop)] = req.body[prop];
        }
      }
    }
    
    Object.defineProperties(req.form, {
      "errors": {
        value: [],
        enumerable: false
      },
      "getErrors": {
        value: function (name) {
          if(!name) return map;
          
          return map[name] || [];
        },
        enumerable: false
      },
      "isValid": {
        get: function () {
          return this.errors.length === 0;
        },
        enumerable: false
      },
      "flashErrors": {
        value: function () {
          if (typeof req.flash !== "function") return;
          this.errors.forEach(function (error) {
            if (flashed[error]) return;
            
            flashed[error] = true;
            req.flash("error", error);
          });
        },
        enumerable: false
      }
    });
    
    routines.forEach(function (routine) {
      var result = routine.run(mergedSource, req.form, options);
      
      if (!Array.isArray(result) || !result.length) return;
        
      var errors = req.form.errors = req.form.errors || []
        , name = routine.name;
      
      map[name] = map[name] || [];
      
      result.forEach(function (error) {
        errors.push(error);
        map[name].push(error);
      });
    });
    
    if (options.flashErrors) req.form.flashErrors();
    
    if (next) next();
  }
}

form.field = function (property, label) {
  return new Field(property, label);
};

form.filter = form.validate = form.field;

form._options = {
  dataSources: ["body", "query", "params"],
  autoTrim: false,
  autoLocals: true,
  passThrough: false,
  flashErrors: true
};

form.configure = function (options) {
  for (var p in options) {
    if (!Array.isArray(options[p]) && p === "dataSources") {
      options[p] = [options[p]];
    }
    this._options[p] = options[p];
  }
  return this;
}

module.exports = form;