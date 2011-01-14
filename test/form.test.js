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

    request.form.isValid = false;
    assert.strictEqual(request.form.isValid, true);
  }
};
