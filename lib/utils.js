// Convert square-bracket to dot notation.
var toDotNotation = exports.toDotNotation = function (str) {
  return str.replace(/\[((.)*?)\]/g, ".$1");
};

// Gets nested properties without throwing errors.
var getProp = exports.getProp = function (property, obj) {
  var levels = toDotNotation(property).split(".");
  
  while (obj != null && levels[0]) {
    obj = obj[levels.shift()];
    if (obj == null) obj = "";
  }
  
  return obj;
}

// Sets nested properties.
var setProp = exports.setProp = function (property, obj, value) {
  var levels = toDotNotation(property).split(".");
  
  while (levels[0]) {
    var p = levels.shift();
    if (typeof obj[p] !== "object") obj[p] = {};
    if (!levels.length) obj[p] = value;
    obj = obj[p];
  }
  
  return obj;
}

var clone = exports.clone = function (obj) {
  // Untested, probably better:-> return Object.create(obj).__proto__;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * camelize(str): -> String
 * - str (String): The string to make camel-case.
 *
 * Converts dash-separated words into camelCase words. Cribbed from Prototype.js.
 *
 * field-name -> fieldName
 * -field-name -> FieldName
**/
var camelize = exports.camelize = function (str) {
  return (str || "").replace(/-+(.)?/g, function(match, chr) {
    return chr ? chr.toUpperCase() : '';
  });
}

/*
 * Recursively merge properties of two objects
 * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/383245#383245
 */
var merge = exports.merge = function (obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = merge(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

var hasValue = exports.hasValue = function (value) {
  return !(undefined === value || null === value || "" === value);
}