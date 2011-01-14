var assert = require("assert"),
    form = require("../index"),
    filter = form.filter;

module.exports = {
  'filter : trim': function() {
    var request = { body: { field: "\r\n  value   \t" }};
    form(filter("field").trim())(request, {});
    assert.equal(request.form.field, "value");
  },
  
  'filter : ltrim': function() {
    var request = { body: { field: "\r\n  value   \t" }};
    form(filter("field").ltrim())(request, {});
    assert.equal(request.form.field, "value   \t");
  },

  'filter : rtrim': function() {
    var request = { body: { field: "\r\n  value   \t" }};
    form(filter("field").rtrim())(request, {});
    assert.equal(request.form.field, "\r\n  value");
  },

  'filter : ifNull': function() {
    // Replace missing value with "value"
    var request = { body: {} };
    form(filter("field").ifNull("value"))(request, {});
    assert.equal(request.form.field, "value");

    // Replace empty string with value
    var request = { body: { field: "" }};
    form(filter("field").ifNull("value"))(request, {});
    assert.equal(request.form.field, "value");

    // Replace NULL with value
    var request = { body: { field: null }};
    form(filter("field").ifNull("value"))(request, {});
    assert.equal(request.form.field, "value");

    // Replace undefined with value
    var request = { body: { field: undefined }};
    form(filter("field").ifNull("value"))(request, {});
    assert.equal(request.form.field, "value");

    // DO NOT replace false
    var request = { body: { field: false }};
    form(filter("field").ifNull("value"))(request, {});
    assert.equal(request.form.field, false);

    // DO NOT replace zero
    var request = { body: { field: 0 }};
    form(filter("field").ifNull("value"))(request, {});
    assert.equal(request.form.field, 0);
  },

  'filter : toFloat': function() {
    var request = { body: { field: "50.01" }};
    form(filter("field").toFloat())(request, {});
    assert.ok(typeof request.form.field == "number");
    assert.equal(request.form.field, 50.01);

    var request = { body: { field: "fail" }};
    form(filter("field").toFloat())(request, {});
    assert.ok(typeof request.form.field == "number");
    assert.ok(isNaN(request.form.field));
  },

  'filter : toInt': function() {
    var request = { body: { field: "50.01" }};
    form(filter("field").toInt())(request, {});
    assert.ok(typeof request.form.field == "number");
    assert.equal(request.form.field, 50);

    var request = { body: { field: "fail" }};
    form(filter("field").toInt())(request, {});
    assert.ok(typeof request.form.field == "number");
    assert.ok(isNaN(request.form.field));
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
    form(
      filter("field1").toBoolean(),
      filter("field2").toBoolean(),
      filter("field3").toBoolean(),
      filter("field4").toBoolean(),
      filter("field5").toBoolean(),
      filter("field6").toBoolean(),
      filter("field7").toBoolean()
    )(request, {});
    "1234567".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.form[name], "boolean");
      assert.strictEqual(request.form[name], true);
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
    form(
      filter("field1").toBoolean(),
      filter("field2").toBoolean(),
      filter("field3").toBoolean(),
      filter("field4").toBoolean(),
      filter("field5").toBoolean(),
      filter("field6").toBoolean(),
      filter("field7").toBoolean()
    )(request, {});
    "1234567".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.form[name], "boolean");
      assert.strictEqual(request.form[name], false);
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
    form(
      filter("field1").toBooleanStrict(),
      filter("field2").toBooleanStrict(),
      filter("field3").toBooleanStrict(),
      filter("field4").toBooleanStrict()
    )(request, {});
    "1234".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.form[name], "boolean");
      assert.strictEqual(request.form[name], true);
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
    form(
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
    )(request, {});
    "1234567890a".split("").forEach(function(i) {
      var name = "field" + i;
      assert.strictEqual(typeof request.form[name], "boolean");
      assert.strictEqual(request.form[name], false);
    });
  },

  'filter : entityEncode': function() {
    // NOTE: single quotes are not encoded
    var request = { body: { field: "&\"<>hello!" }};
    form(filter("field").entityEncode())(request, {});
    assert.equal(request.form.field, "&amp;&quot;&lt;&gt;hello!");
  },

  'filter : entityDecode': function() {
    var request = { body: { field: "&amp;&quot;&lt;&gt;hello!" }};
    form(filter("field").entityDecode())(request, {});
    assert.equal(request.form.field, "&\"<>hello!");
  },

  'filter : toUpper': function() {
    var request = { body: { field: "hellö!" }};
    form(filter("field").toUpper())(request, {});
    assert.equal(request.form.field, "HELLÖ!");
  },

  'filter : toLower': function() {
    var request = { body: { field: "HELLÖ!" }};
    form(filter("field").toLower())(request, {});
    assert.equal(request.form.field, "hellö!");
  },

  'filter : truncate': function() {
    var request = { body: {
      field1: "1234567890",
      field2: "",
      field3: "123",
      field4: "123456",
      field5: "1234567890"
    }};
    form(
      filter("field1").truncate(3), // ...
      filter("field2").truncate(3), // EMPTY
      filter("field3").truncate(3), // 123
      filter("field4").truncate(5), // 12...
      filter("field5").truncate(7)  // 1234...
    )(request, {});
    assert.equal(request.form.field1, "...");
    assert.equal(request.form.field2, "");
    assert.equal(request.form.field3, "123");
    assert.equal(request.form.field4, "12...");
    assert.equal(request.form.field5, "1234...");
  },

  'filter : custom': function() {
    var request = { body: { field: "value!" }};
    form(filter("field").custom(function(value) {
      return "!!!";
    }))(request, {});
    assert.equal(request.form.field, "!!!");
  }

};