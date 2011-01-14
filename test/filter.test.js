var assert = require("assert"),
    form = require("../index"),
    filter = form.filter;

module.exports = {
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
  }

};