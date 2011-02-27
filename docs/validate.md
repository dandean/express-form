---
layout: default
title: Form Validation
---

<div class="doc" markdown="1">
<div class="article" markdown="1">
`validate(fieldname[, label]) -> Validator`

  * `fieldname` (`String`): The name of the field to validate.
  * `label` (`String`): Optional, can be used for friendlier validation messaging.

The `validate` function creates a validator object for a specific field.

The API is chainable, so you can keep calling validation methods one after the other.

{% highlight javascript %}
validate("username").required().isAlphanumeric()
{% endhighlight %}
</div>

### Validation Messages

<div class="article" markdown="1">
Each validator has its own default validation message. These can be overridden
by passing a custom message to the validate function. The custom message is
always the **last** argument.

Use "`%s`" in the message to have the field name (or label if provided) printed in
the message:

{% highlight javascript %}
validate("username").required()
// -> "username is required"

validate("username").required("What is your %s?")
// -> "What is your username?"

validate("username", "Username").required("What is your %s?")
// -> "What is your Username?"
{% endhighlight %}
</div>

## Validation Methods

### Regular Expressions Validators

<div class="article" markdown="1">
`regex(pattern[, modifiers[, message]])`

  * `pattern` (`RegExp|String`): `RegExp` (with flags) or `String` pattern.
  * `modifiers` (`String`): Optional, and only if pattern is a `String`.
  * `message` (`String`): Optional custom validation message.

alias: `is()`

Checks that the value matches the given regular expression.

{% highlight javascript %}
validate("username").regex("[a-z]", "i", "Only letters are valid in %s")
validate("username").regex(/[a-z]/i, "Only letters are valid in %s")
{% endhighlight %}    
</div>

<div class="article" markdown="1">
`notRegex(pattern[, modifiers[, message]])`

  * `pattern` (`RegExp|String`): `RegExp` (with flags) or `String` pattern.
  * `modifiers` (`String`): Optional, and only if pattern is a `String`.
  * `message` (`String`): Optional validation message.

alias: `not()`

Checks that the value does NOT match the given regular expression.

{% highlight javascript %}
validate("username").not("[a-z]", "i", "Letters are not valid in %s")
validate("username").not(/[a-z]/i, "Letters are not valid in %s")
{% endhighlight %}
</div>


### Type Validators

<div class="article" markdown="1">
`isNumeric([message])`

* `message` (`String`): Optional validation message.

Checks is the value is numeric in any way.
</div>

<div class="article" markdown="1">
`isInt([message])`

* `message` (`String`): Optional validation message.

Checks if the value is an integer.
</div>

<div class="article" markdown="1">
`isDecimal([message])`

* `message` (`String`): Optional validation message.

alias: `isFloat()`

Checks if the value is a number with a decimal point.
</div>


### Format Validators

<div class="article" markdown="1">
`isEmail([message])`

* `message` (`String`): Optional validation message.
</div>

<div class="article" markdown="1">
`isUrl([message])`

* `message` (`String`): Optional validation message.
</div>

<div class="article" markdown="1">
`isIP([message])`

* `message` (`String`): Optional validation message.
</div>

<div class="article" markdown="1">
`isAlpha([message])`

* `message` (`String`): Optional validation message.
</div>

<div class="article" markdown="1">
`isAlphanumeric([message])`

* `message` (`String`): Optional validation message.
</div>

<div class="article" markdown="1">
`isLowercase([message])`

* `message` (`String`): Optional validation message.
</div>

<div class="article" markdown="1">
`isUppercase([message])`

* `message` (`String`): Optional validation message.
</div>


### Content Validators

<div class="article" markdown="1">
`notEmpty([message])`

* `message` (`String`): Optional validation message.

Checks if the value is not just whitespace.
</div>

<div class="article" markdown="1">
`equals(value [, message])`

  * `value` (`String`): A value that should match the field value OR a fieldname
    token to match another field, ie, field::password.


Compares the field to value.

{% highlight javascript %}
validate("password").is(/^\w{6,20}$/)
validate("password_confirmation").equals("field::password")
{% endhighlight %}
</div>

<div class="article" markdown="1">
`contains(value[, message])`

  * `value` (`String`): The value to test for.
    
Checks if the field contains value.
</div>    

<div class="article" markdown="1">
`notContains(string[, message])`

  * `value` (`String`): A value that should not exist in the field.

Checks if the field does NOT contain value.
</div>


### Other Validators

<div class="article" markdown="1">
`required([message])`

  * `message` (`String`): Optional validation message.

Checks that the field is present in form data, and has a value.
</div>

<div class="article" markdown="1">
custom(function[, message])

  * function (Function): A custom validation function.
  * `message` (`String`): Optional validation message.

Validates the field using a custom validation function. If the function throws,
and message is not provided, the thrown error message is used.

{% highlight javascript %}
validate("username").custom(function(value) {
  if (value !== "admin") {
    throw new Error("%s must be 'admin'.");
  }
});
{% endhighlight %}
</div>
</div>
