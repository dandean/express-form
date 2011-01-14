var assert = require("assert"),
    form = require("../index"),
    validate = form.validator;

module.exports = {
  'validate : isEmail': function() {
    // Skip validating empty values
    var request = { body: {} };
    form(validate("field").isEmail())(request, {});
    assert.equal(request.form.errors, undefined);
    
    // Failure.
    var request = { body: { field: "fail" }};
    form(validate("field").isEmail())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid email");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    form(validate("field").isEmail("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "me@dandean.com" }};
    form(validate("field").isEmail())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isUrl': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    form(validate("field").isUrl())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid URL");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    form(validate("field").isUrl("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "http://www.google.com" }};
    form(validate("field").isUrl())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isIP': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    form(validate("field").isIP())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid IP");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    form(validate("field").isIP("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "0.0.0.0" }};
    form(validate("field").isIP())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isAlpha': function() {
    // Failure.
    var request = { body: { field: "123456" }};
    form(validate("field").isAlpha())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "123456" }};
    form(validate("field").isAlpha("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "abcde" }};
    form(validate("field").isAlpha())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isAlphanumeric': function() {
    // Failure.
    var request = { body: { field: "------" }};
    form(validate("field").isAlphanumeric())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "------" }};
    form(validate("field").isAlphanumeric("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "abc123" }};
    form(validate("field").isAlphanumeric())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isNumeric': function() {
    // Failure.
    var request = { body: { field: "------" }};
    form(validate("field").isNumeric())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid number");

    // Failure w/ custom message.
    var request = { body: { field: "------" }};
    form(validate("field").isNumeric("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success Int
    var request = { body: {
      integer: "123456",
      floating: "123456.45",
      negative: "-123456.45",
      positive: "+123456.45",
      padded: "000045.343"
    }};
    form(
      validate("integer").isNumeric(),
      validate("floating").isNumeric(),
      validate("negative").isNumeric(),
      validate("positive").isNumeric(),
      validate("padded").isNumeric()
    )(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isInt': function() {
    // Failure.
    var request = { body: { field: "------" }};
    form(validate("field").isInt())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid integer");

    // Failure w/ custom message.
    var request = { body: { field: "------" }};
    form(validate("field").isInt("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "50" }};
    form(validate("field").isInt())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isLowercase': function() {
    // Failure.
    var request = { body: { field: "FAIL" }};
    form(validate("field").isLowercase())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "FAIL" }};
    form(validate("field").isInt("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "win" }};
    form(validate("field").isLowercase())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isUppercase': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    form(validate("field").isUppercase())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    form(validate("field").isUppercase("!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "WIN" }};
    form(validate("field").isUppercase())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isFloat': function() {
    // Failure.
    var request = { body: { field: "5000" }};
    form(validate("field").isFloat())(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid decimal");

    // Failure w/ custom message.
    var request = { body: { field: "5000" }};
    form(validate("field").isFloat("!!! %s !!!"))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "5000.00" }};
    form(validate("field").isFloat())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notNull': function() {
    // Failure.
    var request = { body: { field: "" }};
    form(validate("field").notNull())(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "" }};
    form(validate("field").notNull("!!! %s !!!"))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "win" }};
    form(validate("field").notNull())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isNull': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    form(validate("field").isNull())(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    form(validate("field").isNull("!!! %s !!!"))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "" }};
    form(validate("field").isNull())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notEmpty': function() {
    // Failure.
    var request = { body: { field: "  \t" }};
    form(validate("field").notEmpty())(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "String is whitespace");

    // Failure w/ custom message.
    var request = { body: { field: "  \t" }};
    form(validate("field").notEmpty("!!! %s !!!"))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "win" }};
    form(validate("field").notEmpty())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : equals': function() {
    // Failure.
    var request = { body: { field: "value" }};
    form(validate("field").equals("other"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Not equal");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    form(validate("field").equals("other", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").equals("value"))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : contains': function() {
    // Failure.
    var request = { body: { field: "value" }};
    form(validate("field").contains("other"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    form(validate("field").contains("other", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").contains("alu"))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notContains': function() {
    // Failure.
    var request = { body: { field: "value" }};
    form(validate("field").notContains("alu"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    form(validate("field").notContains("alu", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").notContains("win"))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : regex/is': function() {
    // regex(/pattern/)
    // regex(/pattern/, "message")
    // regex("pattern")
    // regex("pattern", "modifiers")
    // regex("pattern", "message")
    // regex("pattern", "modifiers", "message")

    // Failure: RegExp with default args
    var request = { body: { field: "value" }};
    form(validate("field").regex(/^\d+$/))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure: RegExp with custom message.
    var request = { body: { field: "value" }};
    form(validate("field").regex(/^\d+$/, "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with default args.
    var request = { body: { field: "value" }};
    form(validate("field").regex("^\d+$"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Success: String with modifiers
    var request = { body: { field: "value" }};
    form(validate("field").regex("^VALUE$", "i"))(request, {});
    assert.equal(request.form.errors, undefined);

    // Failure: String with custom message
    var request = { body: { field: "value" }};
    form(validate("field").regex("^\d+$", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with modifiers and custom message
    var request = { body: { field: "value" }};
    form(validate("field").regex("^\d+$", "i", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");


    // Success
    var request = { body: { field: "value" }};
    form(validate("field").regex(/^value$/))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notRegex/not': function() {
    // notRegex(/pattern/)
    // notRegex(/pattern/, "message")
    // notRegex("pattern")
    // notRegex("pattern", "modifiers")
    // notRegex("pattern", "message")
    // notRegex("pattern", "modifiers", "message")

    // Failure: RegExp with default args
    var request = { body: { field: "value" }};
    form(validate("field").notRegex(/^value$/))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure: RegExp with custom message.
    var request = { body: { field: "value" }};
    form(validate("field").notRegex(/^value$/, "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with default args.
    var request = { body: { field: "value" }};
    form(validate("field").notRegex("^value$"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Success: String with modifiers
    var request = { body: { field: "value" }};
    form(validate("field").notRegex("^win$", "i"))(request, {});
    assert.equal(request.form.errors, undefined);

    // Failure: String with custom message
    var request = { body: { field: "value" }};
    form(validate("field").notRegex("^value$", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with modifiers and custom message
    var request = { body: { field: "value" }};
    form(validate("field").notRegex("^value$", "i", "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").notRegex(/^win$/))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validation : minLength': function() {
    // Failure.
    var request = { body: { field: "value" }};
    form(validate("field").minLength(10))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Too short");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    form(validate("field").minLength(10, "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").minLength(1))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validation : maxLength': function() {
    // Failure.
    var request = { body: { field: "value" }};
    form(validate("field").maxLength(1))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Too long");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    form(validate("field").maxLength(1, "!!! %s !!!"))(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").maxLength(5))(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validation : required': function() {
    // Failure.
    var request = { body: {} };
    form(validate("field").required())(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Missing value");

    // Failure w/ placeholder value and custom message.
    var request = { body: { field: "value" }};
    form(validate("field").required("value", "!!! %s !!!"))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "5000.00" }};
    form(validate("field").required())(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validation : custom': function() {
    // Failure.
    var request = { body: { field: "value" }};
    form(validate("field").custom(function(value) {
      throw new Error();
    }))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid field");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    form(validate("field").custom(function(value) {
      throw new Error();
    }, "!!! %s !!!"))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure w/ custom message from internal error.
    var request = { body: { field: "value" }};
    form(validate("field").custom(function(value) {
      throw new Error("Radical %s");
    }))(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Radical field");

    // Success
    var request = { body: { field: "value" }};
    form(validate("field").custom(function(validate) {}))(request, {});
    assert.equal(request.form.errors, undefined);
  },
};
