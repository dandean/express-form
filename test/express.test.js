var assert = require("assert"),
    form = require("../index"),
    filter = form.filter,
    validate = form.validator,
    express = require("express");

module.exports = {
  'express : middleware : valid-form': function() {
    var app = express.createServer();

    app.configure(function() {
      app.use(express.bodyDecoder());
      app.use(app.router);
    });

    app.post(
      '/user',
      form(
        filter("username").trim(),
        validate("username").required().is(/^[a-z]+$/),
        filter("password").trim(),
        validate("password").required().is(/^[0-9]+$/)
      ),
      function(req, res){
        assert.strictEqual(req.body.username, "dandean");
        assert.strictEqual(req.body.password, "12345");
        assert.strictEqual(req.form.isValid, true);
        assert.strictEqual(req.form.errors, undefined);
        res.send(JSON.stringify(req.body));
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
  }
};