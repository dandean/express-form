---
layout: default
title: Basic Usage
---

{% highlight javascript %}
var app = express.createServer(),
    form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

app.configure(function() {
  app.use(express.bodyDecoder());
  app.use(app.router);
});

app.post( '/user', // Route
  
  form( // Form filter and validation middleware
    filter("username").trim(),
    validate("username").required().is(/^[a-z]+$/),
    filter("password").trim(),
    validate("password").required().is(/^[0-9]+$/),
    filter("email").trim(),
    validate("email").isEmail()
  ),
  
  // Express request-handler gets filtered and validated data
  function(req, res){
    if (!req.form.isValid) {
      // Handle errors
      console.log(req.form.errors);

    } else {
      // Or, use filtered form data from the form object:
      console.log("Username:", req.form.username);
      console.log("Password:", req.form.password);
      console.log("Email:", req.form.email);
    }
  }
);
{% endhighlight %}