var validator = require("validator"),
    check = validator.check,
    sanitize = validator.sanitize;

/*!
 * Connect - Validation
 * Copyright(c) 2010 Dan Dean <me@dandean.com>
 * MIT Licensed
 */

module.exports = function(options){
  options = options || {};

  return function(req, res, next){

    var dataSources = {},
        hasBody = !!req.body,
        hasForm = !!req.form;

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
        req.dataSources[name] = source;
      }
      return source || {};
    };

    if (!hasForm) req.form = {};
    
    req.form.get = function(name) {
      getDataSource(name)[name];
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

    next();
  };
};



