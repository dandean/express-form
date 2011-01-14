TODO
================================================================================


Features
--------

### request.form values

Precedence: url param -> query param -> request body

TODO: check how this compares to other solutions: rails, zend, django, .net.
TODO: how does this work with request.param() ? May need to override that so
      to ensure that it pulls form request.form.

### Configurability

What configuration options should be available?

* Debugging?
* Default message overrides?
* Connection to express-contrib/flash?
* Auto-local each of the form props?


Testing and Compatibility
-------------------------

* Formidable and Connect-Form
* express-contrib/flash
* auto-locals


Other
-----

* Add notes on how to extend the filters and validators
* Change node-validator toUppercase/toLowercase to use standard JS caps: toUpper**C**ase, toLower**C**ase.
