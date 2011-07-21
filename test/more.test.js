var assert = require("assert")
  , form = require("../index")
  , field = form.field;

module.exports = {
  
  "field : arrays": function () {
    // Array transformations.
    var request = {
      body: {
        field1: "",
        field2: "Hello!",
        field3: ["Alpacas?", "Llamas!!?", "Vicunas!", "Guanacos!!!"]
      }
    };
    form(
      field("fieldx").array(),
      field("field1").array(),
      field("field2").array(),
      field("field3").array()
    )(request, {});
    assert.strictEqual(Array.isArray(request.form.fieldx), true);
    assert.strictEqual(request.form.fieldx.length, 0);
    assert.strictEqual(Array.isArray(request.form.field1), true);
    assert.strictEqual(request.form.field1.length, 0);
    assert.strictEqual(request.form.field2[0], "Hello!");
    assert.strictEqual(request.form.field2.length, 1);
    assert.strictEqual(request.form.field3[0], "Alpacas?");
    assert.strictEqual(request.form.field3[1], "Llamas!!?");
    assert.strictEqual(request.form.field3[2], "Vicunas!");
    assert.strictEqual(request.form.field3[3], "Guanacos!!!");
    assert.strictEqual(request.form.field3.length, 4);
    
    // No array flag!
    var request = { body: { field: ["red", "blue"] } };
    form(field("field"))(request, {});
    assert.strictEqual(request.form.field, "red");
    
    // Iterate and filter array.
    var request = { body: { field: ["david", "stephen", "greg"] } };
    form(field("field").array().toUpper())(request, {});
    assert.strictEqual(request.form.field[0], "DAVID");
    assert.strictEqual(request.form.field[1], "STEPHEN");
    assert.strictEqual(request.form.field[2], "GREG");
    assert.strictEqual(request.form.field.length, 3);
    
    // Iterate and validate array
    var request = { body: { field: [1, 2, "f"] } };
    form(field("field").array().isInt())(request, {});
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "field is not an integer");
  },
  "field : nesting": function () {  
    // Nesting with dot notation
    var request = {
      body: {
        field: {
          nest: "wow",
          child: "4",
          gb: {
            a: "a",
            b: "aaaa",
            c: {
              fruit: "deeper",
              must: {
                go: "deeperrrr"
              }
            }
          }
        }
      
      }
    };
    form(
      field("field.nest").toUpper(),
      field("field.child").toUpper(),
      field("field.gb.a").toUpper(),
      field("field.gb.b").toUpper(),
      field("field.gb.c.fruit").toUpper(),
      field("field.gb.c.must.go").toUpper()
    )(request, {});
    assert.strictEqual(request.form.field.nest, "WOW");
    assert.strictEqual(request.form.field.child, "4");
    assert.strictEqual(request.form.field.gb.a, "A");
    assert.strictEqual(request.form.field.gb.b, "AAAA");
    assert.strictEqual(request.form.field.gb.c.fruit, "DEEPER");
    assert.strictEqual(request.form.field.gb.c.must.go, "DEEPERRRR");
    
    // Nesting with square-bracket notation
    var request = {
      body: {
        field: {
          nest: "wow",
          child: "4",
          gb: {
            a: "a",
            b: "aaaa",
            c: {
              fruit: "deeper",
              must: {
                go: "deeperrrr"
              }
            }
          }
        }
      
      }
    };
    form(
      field("field[nest]").toUpper(),
      field("field[child]").toUpper(),
      field("field[gb][a]").toUpper(),
      field("field[gb][b]").toUpper(),
      field("field[gb][c][fruit]").toUpper(),
      field("field[gb][c][must][go]").toUpper()
    )(request, {});
    assert.strictEqual(request.form.field.nest, "WOW");
    assert.strictEqual(request.form.field.child, "4");
    assert.strictEqual(request.form.field.gb.a, "A");
    assert.strictEqual(request.form.field.gb.b, "AAAA");
    assert.strictEqual(request.form.field.gb.c.fruit, "DEEPER");
    assert.strictEqual(request.form.field.gb.c.must.go, "DEEPERRRR");
  },
  
  "field : filter/validate combo ordering": function () {
    // Can arrange filter and validate procs in any order.
    var request = {
      body: {
        field1: "    whatever    ",
        field2: "    some thing     "
      }
    };
    form(
      field("field1").trim().toUpper().maxLength(5),
      field("field2").minLength(12).trim()
    )(request, {});
    assert.strictEqual(request.form.field1, "WHATEVER");
    assert.strictEqual(request.form.field2, "some thing");
    assert.equal(request.form.errors.length, 1);
    assert.equal(request.form.errors[0], "field1 is too long");
  },
  
  "field : autoTrim": function () {
    // Auto-trim declared fields.
    form.configure({ autoTrim: true });
    var request = { body: {  field: "    whatever    " } };
    form(field("field"))(request, {});
    assert.strictEqual(request.form.field, "whatever");
    form.configure({ autoTrim: false });
  },
  
  "field : passThrough": function () {
    // request.form gets all values from sources.
    form.configure({ passThrough: true });
    var request = {
      body: {
        field1: "fdsa",
        field2: "asdf"
      }
    };
    form(field("field1"))(request, {});
    assert.strictEqual(request.form.field1, "fdsa");
    assert.strictEqual(request.form.field2, "asdf");
    
    // request.form only gets declared fields.
    form.configure({ passThrough: false });
    var request = { body: {
      field1: "fdsa",
      field2: "asdf"
    } };
    form(field("field1"))(request, {});
    assert.strictEqual(request.form.field1, "fdsa");
    assert.strictEqual(typeof request.form.field2, "undefined");
  },
  
  "form : getErrors() gives full map": function() {
    var request = {
      body: {
        field0: "win",
        field1: "fail",
        field2: "fail",
        field3: "fail"
      }
    };
    form(
      field("field0").equals("win"),
      field("field1").isEmail(),
      field("field2").isEmail().isUrl(),
      field("field3").isEmail().isUrl().isIP()
    )(request, {});
    assert.equal(request.form.isValid, false);
    assert.equal(request.form.errors.length, 6);
    assert.equal(typeof request.form.getErrors().field0, "undefined");
    assert.equal(request.form.getErrors().field1.length, 1);
    assert.equal(request.form.getErrors().field2.length, 2);
    assert.equal(request.form.getErrors().field3.length, 3);
  }

}