TODO
================================================================================


Features
--------

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
* Do not assume data is a String. May need to drop `node-validator` dependency.


Other
-----

* Add notes on how to extend the filters and validators
* Change node-validator toUppercase/toLowercase to use standard JS caps: toUpper**C**ase, toLower**C**ase.
