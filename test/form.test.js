var assert = require("assert"),
    form = require("../index"),
    validate = form.validator;

module.exports = {
  'form : isValid': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isEmail());
    formValidator(request, {});
    assert.strictEqual(request.form.isValid, false);

    // Success
    var request = { body: { field: "me@dandean.com" }};
    var formValidator = form(validate("field").isEmail());
    formValidator(request, {});
    assert.strictEqual(request.form.isValid, true);

    request.form.isValid = false;
    assert.strictEqual(request.form.isValid, true);
  }
};
