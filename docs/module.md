---
layout: default
title: Form Module
---

<div class="doc" markdown="1">
<div class="article" markdown="1">
`form( processors ... ) -> Function(req, res)`

  * `processors` (`Filter|Validator`): N number of form.filters and form.validators.

The Express Form **module** returns an Express
[Route Middleware](http://expressjs.com/guide.html#Route-Middleware) function.
You specify filtering and validation by passing filters and validators as
arguments to the main module function.

{% highlight javascript %}
var form = require("express-form");

app.post('/user',
  
  // Express Form Route Middleware...
  form(
    form.filter("username").trim(),
    form.filter("password").trim()
  ),
  
  function(req, res) {
    // ...
  }
);
{% endhighlight %}
</div>

## Configuration

Express Form has various configuration options, but aims for sensible defaults
for a typical Express application.

<div class="article" markdown="1">
`form.configure(options) -> self`

  * `options` (`Object`): An object with configuration options.
</div>

### Options:

`flashErrors` (`Boolean`): If validation errors should be automatically passed
to Express' `flash()` method. Default: `true`.

`autoLocals` (`Boolean`): If field values from Express' `request.body` should be
passed into Express' `response.locals` object. This is helpful when a form is
invalid an you want to repopulate the form elements with their submitted values.
Default: `true`.

Note: if a field name dash-separated, the name used for the locals object will
be in camelCase.

`dataSources` (`Array`): An array of Express request properties to use as data
sources when filtering and validating data. Default: `["body", "query", "params"]`.
</div>
