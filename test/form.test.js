var assert = require("assert"),
    form = require("../index"),
    validate = form.validator;

module.exports = {
  'form : isValid': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    form(validate("field").isEmail())(request, {});
    assert.strictEqual(request.form.isValid, false);

    // Success
    var request = { body: { field: "me@dandean.com" }};
    form(validate("field").isEmail())(request, {});
    assert.strictEqual(request.form.isValid, true);
    
    assert["throws"](function() {
      request.form.isValid = false;
    });

    assert.strictEqual(request.form.isValid, true);
  },
  
  'form : getErrors': function() {
    var request = {
      body: {
        field0: "win",
        field1: "fail",
        field2: "fail",
        field3: "fail"
      }
    };
    
    form(
      validate("field0").equals("win"),
      validate("field1").isEmail(),
      validate("field2").isEmail().isUrl(),
      validate("field3").isEmail().isUrl().isIP()
    )(request, {});
    
    assert.equal(request.form.isValid, false);
    assert.equal(request.form.errors.length, 6);

    assert.equal(request.form.getErrors("field0").length, 0);
    assert.equal(request.form.getErrors("field1").length, 1);
    assert.equal(request.form.getErrors("field2").length, 2);
    assert.equal(request.form.getErrors("field3").length, 3);
    error_object = request.form.getErrors();
    expected_error_object = {
      field1: [ 'field1 is not an email address' ]
    , field2: 
       [ 'field2 is not an email address'
       , 'field2 is not a URL'
       ]
    , field3: 
       [ 'field3 is not an email address'
       , 'field3 is not a URL'
       , 'field3 is not an IP address'
       ]
    }
    assert.deepEqual(error_object, expected_error_object);
  },
  
  'form : configure : dataSources': function() {
    form.configure({ dataSources: 'other' });

    var request = { other: { field: "me@dandean.com" }};
    form(validate("field").isEmail())(request, {});
    assert.strictEqual(request.form.isValid, true);
    assert.equal(request.form.field, "me@dandean.com");

    form.configure({ dataSources: ['body', "query", "params"] });
  }
};
