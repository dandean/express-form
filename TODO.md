TODO
================================================================================


Features
--------

* configurability
* Should data get pulled from all sources into form object? If so, precedence?
  * body.id --> req.form.id
  * url?page=5 --> req.form.page
  * url/:page --> req.form.page
* req.form could contain all filtered/merged data, leaving originals in place
* how does this work with req.param() ?
  
  References
  
  * Zend Filter Input
  * Rails
  * django
  * .Net


Testing and Compatibility
-------------------------

* Formidable and Connect-Form
* express-contrib/flash
* auto-locals


Other
-----

* Add notes on how to extend the filters and validators
* Change node-validator toUppercase/toLowercase to use standard JS caps: toUpper**C**ase, toLower**C**ase.
