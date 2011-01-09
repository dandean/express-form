var assert = require("assert"),
    form = require("../index"),
    filter = form.filter,
    validate = form.validator;

module.exports = {

  'validate : isEmail': function() {
    // Skip validating empty values
    var request = { body: {} };
    var formValidator = form(validate("field").isEmail());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
    
    // Failure.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isEmail());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid email");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isEmail("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "me@dandean.com" }};
    var formValidator = form(validate("field").isEmail());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isUrl': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isUrl());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid URL");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isUrl("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "http://www.google.com" }};
    var formValidator = form(validate("field").isUrl());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isIP': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isIP());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid IP");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isIP("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "0.0.0.0" }};
    var formValidator = form(validate("field").isIP());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isAlpha': function() {
    // Failure.
    var request = { body: { field: "123456" }};
    var formValidator = form(validate("field").isAlpha());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "123456" }};
    var formValidator = form(validate("field").isAlpha("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "abcde" }};
    var formValidator = form(validate("field").isAlpha());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isAlphanumeric': function() {
    // Failure.
    var request = { body: { field: "------" }};
    var formValidator = form(validate("field").isAlphanumeric());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "------" }};
    var formValidator = form(validate("field").isAlphanumeric("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "abc123" }};
    var formValidator = form(validate("field").isAlphanumeric());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isNumeric': function() {
    // Failure.
    var request = { body: { field: "------" }};
    var formValidator = form(validate("field").isNumeric());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid number");

    // Failure w/ custom message.
    var request = { body: { field: "------" }};
    var formValidator = form(validate("field").isNumeric("!!! %s !!!"));
    formValidator(request, {});
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
    var formValidator = form(
      validate("integer").isNumeric(),
      validate("floating").isNumeric(),
      validate("negative").isNumeric(),
      validate("positive").isNumeric(),
      validate("padded").isNumeric()
    );
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isInt': function() {
    // Failure.
    var request = { body: { field: "------" }};
    var formValidator = form(validate("field").isInt());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid integer");

    // Failure w/ custom message.
    var request = { body: { field: "------" }};
    var formValidator = form(validate("field").isInt("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "50" }};
    var formValidator = form(validate("field").isInt());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isLowercase': function() {
    // Failure.
    var request = { body: { field: "FAIL" }};
    var formValidator = form(validate("field").isLowercase());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "FAIL" }};
    var formValidator = form(validate("field").isInt("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "win" }};
    var formValidator = form(validate("field").isLowercase());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isUppercase': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isUppercase());
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isUppercase("!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "WIN" }};
    var formValidator = form(validate("field").isUppercase());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isFloat': function() {
    // Failure.
    var request = { body: { field: "5000" }};
    var formValidator = form(validate("field").isFloat());
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid decimal");

    // Failure w/ custom message.
    var request = { body: { field: "5000" }};
    var formValidator = form(validate("field").isFloat("!!! %s !!!"));
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "5000.00" }};
    var formValidator = form(validate("field").isFloat());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notNull': function() {
    // Failure.
    var request = { body: { field: "" }};
    var formValidator = form(validate("field").notNull());
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "" }};
    var formValidator = form(validate("field").notNull("!!! %s !!!"));
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "win" }};
    var formValidator = form(validate("field").notNull());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : isNull': function() {
    // Failure.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isNull());
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "fail" }};
    var formValidator = form(validate("field").isNull("!!! %s !!!"));
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "" }};
    var formValidator = form(validate("field").isNull());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notEmpty': function() {
    // Failure.
    var request = { body: { field: "  \t" }};
    var formValidator = form(validate("field").notEmpty());
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "String is whitespace");

    // Failure w/ custom message.
    var request = { body: { field: "  \t" }};
    var formValidator = form(validate("field").notEmpty("!!! %s !!!"));
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "win" }};
    var formValidator = form(validate("field").notEmpty());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : equals': function() {
    // Failure.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").equals("other"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Not equal");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").equals("other", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").equals("value"));
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : contains': function() {
    // Failure.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").contains("other"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").contains("other", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").contains("alu"));
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validate : notContains': function() {
    // Failure.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notContains("alu"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure w/ custom message.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notContains("alu", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notContains("win"));
    formValidator(request, {});
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
    var formValidator = form(validate("field").regex(/^\d+$/));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure: RegExp with custom message.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").regex(/^\d+$/, "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with default args.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").regex("^\d+$"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Success: String with modifiers
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").regex("^VALUE$", "i"));
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);

    // Failure: String with custom message
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").regex("^\d+$", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with modifiers and custom message
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").regex("^\d+$", "i", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");


    // Success
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").regex(/^value$/));
    formValidator(request, {});
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
    var formValidator = form(validate("field").notRegex(/^value$/));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Failure: RegExp with custom message.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notRegex(/^value$/, "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with default args.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notRegex("^value$"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Invalid characters");

    // Success: String with modifiers
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notRegex("^win$", "i"));
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);

    // Failure: String with custom message
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notRegex("^value$", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Failure: String with modifiers and custom message
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notRegex("^value$", "i", "!!! %s !!!"));
    formValidator(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").notRegex(/^win$/));
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'validation : required': function() {
    // Failure.
    var request = { body: {} };
    var formValidator = form(validate("field").required());
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "Missing value");

    // Failure w/ placeholder value and custom message.
    var request = { body: { field: "value" }};
    var formValidator = form(validate("field").required("value", "!!! %s !!!"));
    formValidator(request, {});
    assert.ok(Array.isArray(request.form.errors));
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "!!! field !!!");

    // Success
    var request = { body: { field: "5000.00" }};
    var formValidator = form(validate("field").required());
    formValidator(request, {});
    assert.equal(request.form.errors, undefined);
  },

  'filter : trim': function() {
    var request = { body: { field: "\r\n  value   \t" }};
    var formValidator = form(filter("field").trim());
    formValidator(request, {});
    assert.equal(request.body.field, "value");
  },
  
  'filter : ltrim': function() {
    var request = { body: { field: "\r\n  value   \t" }};
    var formValidator = form(filter("field").ltrim());
    formValidator(request, {});
    assert.equal(request.body.field, "value   \t");
  },

  'filter : rtrim': function() {
    var request = { body: { field: "\r\n  value   \t" }};
    var formValidator = form(filter("field").rtrim());
    formValidator(request, {});
    assert.equal(request.body.field, "\r\n  value");
  },

  'filter : ifNull': function() {
    // Replace missing value with "value"
    var request = { body: {} };
    var formValidator = form(filter("field").ifNull("value"));
    formValidator(request, {});
    assert.equal(request.body.field, "value");

    // Replace empty string with value
    var request = { body: { field: "" }};
    var formValidator = form(filter("field").ifNull("value"));
    formValidator(request, {});
    assert.equal(request.body.field, "value");

    // Replace NULL with value
    var request = { body: { field: null }};
    var formValidator = form(filter("field").ifNull("value"));
    formValidator(request, {});
    assert.equal(request.body.field, "value");

    // Replace undefined with value
    var request = { body: { field: undefined }};
    var formValidator = form(filter("field").ifNull("value"));
    formValidator(request, {});
    assert.equal(request.body.field, "value");

    // DO NOT replace false
    var request = { body: { field: false }};
    var formValidator = form(filter("field").ifNull("value"));
    formValidator(request, {});
    assert.equal(request.body.field, false);

    // DO NOT replace zero
    var request = { body: { field: 0 }};
    var formValidator = form(filter("field").ifNull("value"));
    formValidator(request, {});
    assert.equal(request.body.field, 0);
  },

  'filter : toFloat': function() {
    var request = { body: { field: "50.01" }};
    var formValidator = form(filter("field").toFloat());
    formValidator(request, {});
    assert.ok(typeof request.body.field == "number");
    assert.equal(request.body.field, 50.01);

    var request = { body: { field: "fail" }};
    var formValidator = form(filter("field").toFloat());
    formValidator(request, {});
    assert.ok(typeof request.body.field == "number");
    assert.ok(isNaN(request.body.field));
  },

  'filter : toInt': function() {
    var request = { body: { field: "50.01" }};
    var formValidator = form(filter("field").toInt());
    formValidator(request, {});
    assert.ok(typeof request.body.field == "number");
    assert.equal(request.body.field, 50);

    var request = { body: { field: "fail" }};
    var formValidator = form(filter("field").toInt());
    formValidator(request, {});
    assert.ok(typeof request.body.field == "number");
    assert.ok(isNaN(request.body.field));
  },

  'filter : toBoolean': function() {
    // Truthy values
    var request = { body: {
      field1: true,
      field2: "true",
      field3: "hi",
      field4: new Date(),
      field5: 50,
      field6: -1,
      field7: "3000"
    }};
    var formValidator = form(
      filter("field1").toBoolean(),
      filter("field2").toBoolean(),
      filter("field3").toBoolean(),
      filter("field4").toBoolean(),
      filter("field5").toBoolean(),
      filter("field6").toBoolean(),
      filter("field7").toBoolean()
    );
    formValidator(request, {});
    "1234567".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.body[name], "boolean");
      assert.strictEqual(request.body[name], true);
    });

    // Falsy values
    var request = { body: {
      field1: false,
      field2: "false",
      field3: null,
      field4: undefined,
      field5: 0,
      field6: "0",
      field7: ""
    }};
    var formValidator = form(
      filter("field1").toBoolean(),
      filter("field2").toBoolean(),
      filter("field3").toBoolean(),
      filter("field4").toBoolean(),
      filter("field5").toBoolean(),
      filter("field6").toBoolean(),
      filter("field7").toBoolean()
    );
    formValidator(request, {});
    "1234567".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.body[name], "boolean");
      assert.strictEqual(request.body[name], false);
    });
  },

  'filter : toBooleanStrict': function() {
    // Truthy values
    var request = { body: {
      field1: true,
      field2: "true",
      field3: 1,
      field4: "1"
    }};
    var formValidator = form(
      filter("field1").toBooleanStrict(),
      filter("field2").toBooleanStrict(),
      filter("field3").toBooleanStrict(),
      filter("field4").toBooleanStrict()
    );
    formValidator(request, {});
    "1234".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.body[name], "boolean");
      assert.strictEqual(request.body[name], true);
    });

    // Falsy values
    var request = { body: {
      field1: false,
      field2: "false",
      field3: null,
      field4: undefined,
      field5: 0,
      field6: "0",
      field7: "",
      field8: new Date(),
      field9: 50,
      field0: -1,
      fielda: "3000"
    }};
    var formValidator = form(
      filter("field1").toBooleanStrict(),
      filter("field2").toBooleanStrict(),
      filter("field3").toBooleanStrict(),
      filter("field4").toBooleanStrict(),
      filter("field5").toBooleanStrict(),
      filter("field6").toBooleanStrict(),
      filter("field7").toBooleanStrict(),
      filter("field8").toBooleanStrict(),
      filter("field9").toBooleanStrict(),
      filter("field0").toBooleanStrict(),
      filter("fielda").toBooleanStrict()
    );
    formValidator(request, {});
    "1234567890a".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.body[name], "boolean");
      assert.strictEqual(request.body[name], false);
    });
  },

  'filter : entityEncode': function() {
    // NOTE: single quotes are not encoded
    var request = { body: { field: "&\"<>hello!" }};
    var formValidator = form(filter("field").entityEncode());
    formValidator(request, {});
    assert.equal(request.body.field, "&amp;&quot;&lt;&gt;hello!");
  },

  'filter : entityDecode': function() {
    var request = { body: { field: "&amp;&quot;&lt;&gt;hello!" }};
    var formValidator = form(filter("field").entityDecode());
    formValidator(request, {});
    assert.equal(request.body.field, "&\"<>hello!");
  },

  'filter : toUpper': function() {
    var request = { body: { field: "hellö!" }};
    var formValidator = form(filter("field").toUpper());
    formValidator(request, {});
    assert.equal(request.body.field, "HELLÖ!");
  },

  'filter : toLower': function() {
    var request = { body: { field: "HELLÖ!" }};
    var formValidator = form(filter("field").toLower());
    formValidator(request, {});
    assert.equal(request.body.field, "hellö!");
  },

  'filter : truncate': function() {
    var request = { body: {
      field1: "1234567890",
      field2: "",
      field3: "123",
      field4: "123456",
      field5: "1234567890"
    }};
    var formValidator = form(
      filter("field1").truncate(3), // ...
      filter("field2").truncate(3), // EMPTY
      filter("field3").truncate(3), // 123
      filter("field4").truncate(5), // 12...
      filter("field5").truncate(7)  // 1234...
    );
    formValidator(request, {});
    assert.equal(request.body.field1, "...");
    assert.equal(request.body.field2, "");
    assert.equal(request.body.field3, "123");
    assert.equal(request.body.field4, "12...");
    assert.equal(request.body.field5, "1234...");
  },

  'filter : custom': function() {
    var request = { body: { field: "value!" }};
    var formValidator = form(filter("field").custom(function(value) {
      return "!!!";
    }));
    formValidator(request, {});
    assert.equal(request.body.field, "!!!");
  },

  "": ""
};