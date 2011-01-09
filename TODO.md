TODO
================================================================================


Features
--------

* minLength and maxLength validators
* configurability
* Should params and query values get mixed in?
* Should data get pulled from all sources into form object? If so, precedence?
  * body.id --> req.form.id
  * url?page=5 --> req.form.page
  * url/:page --> req.form.page


Testing and Compatibility
-------------------------

* Test with Express
* Formidable and Connect-Form
* express-contrib/flash
* auto-locals


Packaging
---------

* Add package.json
* Include expresso and node-validator as internal packages, not external deps


Other
-----

* Add notes on how to extend the filters and validators