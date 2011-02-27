---
layout: default
title: Input Filtering
---

<div class="doc" markdown="1">
<div class="article" markdown="1">
`filter(fieldname) -> Filter`

  * `fieldname` (`String`): The name of the field to act on.

The `filter` property of the module creates a filter object tied to a specific field.

The API is chainable, so you can keep calling filter methods one after the other.

{% highlight javascript %}
filter("username").trim().toLower().truncate(5)
{% endhighlight %}
</div>

## Filter Methods

### Type Coercion

<div class="article" markdown="1">
`toFloat() -> Number`

Converts a numeric string into a `Number`, decimals are preserved.

{% highlight javascript %}
filter("age").toFloat();
// "3.1415926535" --> 3.1415926535
{% endhighlight %}
</div>

<div class="article" markdown="1">
`toInt() -> Number`

The result will be an integer, rounded down if necessary.

{% highlight javascript %}
filter("age").toInt();
// "3.1415926535" --> 3
{% endhighlight %}
</div>

<div class="article" markdown="1">
`toBoolean() -> Boolean`

Converts any value to either `true` or `false`.

{% highlight javascript %}
filter("whatever").toBoolean();
// undefined --> false
// "50" --> true
{% endhighlight %}
</div>

<div class="article" markdown="1">
`toBooleanStrict() -> Boolean`

Only true, "true", 1 and "1" are `true`

{% highlight javascript %}
filter("whatever").toBooleanStrict();
// undefined --> false
// "50" --> false
{% endhighlight %}
</div>

<div class="article" markdown="1">
`ifNull(replacement) -> Boolean`

  * `replacement` (`?`): The object to be used if the field has no value.

{% highlight javascript %}
filter("name").ifNull("John Doe");
// "" --> "John Doe"
{% endhighlight %}
</div>


### HTML Encoding

<div class="article" markdown="1">
`entityEncode() -> String`

Encodes HTML entities.
</div>

<div class="article" markdown="1">
`entityDecode() -> String`

Decodes HTML entities.
</div>


### String Transformations

<div class="article" markdown="1">
`trim([chars=\w]) -> String`

  * `chars` (`String`): The characters that qualify for trimming. Default is whitespace.
</div>

<div class="article" markdown="1">
`ltrim([chars=\w]) -> String`

  * `chars` (`String`): The characters that qualify for trimming. Default is whitespace.
</div>

<div class="article" markdown="1">
`rtrim([chars=\w]) -> String`

  * `chars` (`String`): The characters that qualify for trimming. Default is whitespace.
</div>

<div class="article" markdown="1">
`toLower()`

alias: `toLowercase()`
</div>

<div class="article" markdown="1">
`toUpper()`

alias: `toUppercase()`
</div>

<div class="article" markdown="1">
`truncate(length)`

  * `length` (`Number`): The length to truncate the value to.

Chops value at (length - 3) and appends "..."
</div>

### Custom Filters

<div class="article" markdown="1">
`custom(function)`

  * `function` (`Function`): A custom validation function.

Filters the field value using custom logic.


{% highlight javascript %}
filter("name").custom(function(value) {
  return value.replace(/\s+/g, "-");
});
// "Dan Dean" --> "dan-dean"
{% endhighlight %}
</div>
</div>
