var assert = require("assert"),
    form = require("../index"),
    filter = form.filter,
    validate = form.validate,
    express = require("express"),
    app = express.createServer();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(app.router);
});

module.exports = {
  'express : middleware : valid-form': function() {
    app.post(
      '/user',
      form(
        filter("username").trim(),
        validate("username").required().is(/^[a-z]+$/),
        filter("password").trim(),
        validate("password").required().is(/^[0-9]+$/)
      ),
      function(req, res){
        assert.strictEqual(req.form.username, "dandean");
        assert.strictEqual(req.form.password, "12345");
        assert.strictEqual(req.form.isValid, true);
        assert.strictEqual(req.form.errors.length, 0);
        res.send(JSON.stringify(req.form));
      }
    );    

    assert.response(app,
      {
        url: '/user',
        method: 'POST',
        body: JSON.stringify({
          username: "   dandean   \n\n\t",
          password: " 12345 "
        }),
        headers: { 'Content-Type': 'application/json' }
      },
      { status: 200 }
    );
  },

  'express : middleware : merged-data': function() {
    app.post(
      '/user/:id',
      form(
        filter("id").toInt(),
        filter("stuff").toUpper(),
        filter("rad").toUpper()
      ),
      function(req, res){
        // Validate filtered form data
        assert.strictEqual(req.form.id, 5);     // from param
        assert.equal(req.form.stuff, "THINGS"); // from query param
        assert.equal(req.form.rad, "COOL");     // from body
        
        // Check that originl values are still in place
        assert.ok(typeof req.params.id, "string");
        assert.equal(req.query.stuff, "things");
        assert.equal(req.body.rad, "cool");
        
        res.send(JSON.stringify(req.form));
      }
    );    

    assert.response(app,
      {
        url: '/user/5?stuff=things&id=overridden',
        method: 'POST',
        body: JSON.stringify({
          id: "overridden by url param",
          stuff: "overridden by query param",
          rad: "cool"
        }),
        headers: { 'Content-Type': 'application/json' }
      },
      { status: 200 }
    );
  }


};