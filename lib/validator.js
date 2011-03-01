var error_messages = {
  en:{
    isEmail: "%s is not an email address",
    isUrl: "%s is not a URL",
    isIP: "%s is not an IP address",
    isAlpha: "%s contains non-letter characters",
    isAlphanumeric: "%s contains non alpha-numeric characters",
    isNumeric: "%s is not numeric",
    isLowercase: "%s contains uppercase letters",
    isUppercase: "%s contains lowercase letters",
    isInt: "%s is not an integer",
    notEmpty: "%s has no value or is only whitespace",
    contains: "%s does not contain required characters",
    notContains: "%s contains invalid characters",
    equals: "%s does not equal ",
    isNumeric: "%s is not a number",
    isDecimal: "%s is not a decimal",
    regex: "%s has invalid characters",
    notRegex: "%s has invalid characters",
    required: "%s is required", 
    minLength: "%s is too short",
    maxLength: "%s is too long",
    custom: "%s is invalid"
  }
  ,
  ja: {
    isEmail: "%sはメールアドレスではありません",
    isUrl: "%sはURLではありません",
    isIP: "%sはIPアドレスではありません",
    isAlpha: "%sには不正な文字が含まれています",
    isAlphanumeric: "%sには英数字以外の文字が含まれています",
    isNumeric: "%sは数字ではありません",
    isLowercase: "%sには大文字が含まれています",
    isUppercase: "%sには小文字が含まれています",
    isInt: "%sは整数ではありません",
    notEmpty: "%sには値がないか､空白文字しかありません",
    contains: "%sには必要な文字が含まれていません",
    notContains: "%sには不正な文字が含まれています",
    equals: "%sは等しくありません",
    isNumeric: "%sは数字ではありません",
    isDecimal: "%sは10進数ではありません",
    regex: "%sは指定されたパターンと一致しません",
    notRegex: "%sは指定されたパターンと一致しません",
    required: "%sは入力必須です", 
    minLength: "%sは短すぎます",
    maxLength: "%sは長すぎます",
    custom: "%sは正しくありません"
  }
}; 

var MESSAGES = error_messages['en'];

var validator = require("validator"),
    ValidatorPrototype = validator.Validator.prototype,
    object = require("object-additions").object;

var externalValidator = new validator.Validator();

function hasValue(value) {
  return !(undefined === value || null === value || "" === value);
}

function Validator(fieldname, label) {
  var stack = [];
  var fieldLabel = label || fieldname;
  this.name = fieldname;
  this.__required = false;
  
  this.add = function(func) {
    stack.push(func);
    return this;
  };
  
  this.run = function(formData) {
    var errors = [];

    if(formData.locale && (formData.locale in error_messages)){
      MESSAGES = error_messages[formData.locale];
    }

    stack.forEach(function(validate) {
      validate.getValue = function(name) {
        return formData[name];
      };
      
      var value = formData[fieldname];
      
      if (false === this.__required && false === hasValue(value)) {
        // If this field is not required and it doesn't have a value,
        // don't run the validator on its value.
        return;
      }
      
      try {
        validate(value);
      } catch(e) {
        var message = (e.message || e).toString().replace("%s", fieldLabel);
        errors.push(message);
      }
    }.bind(this));
    
    if (errors.length) return errors;
  };
}

Validator.prototype.equals = function(other, message) {
  if (object.isString(other) && other.match(/^field::/)) {
    this.__required = true;
  }

  return this.add(function(value) {
    // If other is a field token (field::fieldname), grab the value of fieldname
    // and use that as the OTHER value.
    if (object.isString(other) && other.match(/^field::/)) {
      other = arguments.callee.getValue(other.replace(/^field::/, ''));
    }
    if (value != other) {
      throw new Error(message || MESSAGES['equals'] + String(other));
    }
  });
};

// node-validator's numeric validator seems unintuitive. All numeric values should be valid, not just int.
Validator.prototype.isNumeric = function(message) {
  return this.add(function(value) {
    if (object.isNumber(value) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.?[0-9]+$/))) {
    } else {
      throw new Error(message || MESSAGES['isNumeric']);
    }
  });
};

// node-validator's decimal/float validator incorrectly thinks Ints are valid.
Validator.prototype.isDecimal = function(message) {
  return this.add(function(value) {
    if ((object.isNumber(value) && value % 1 == 0) || (object.isString(value) && value.match(/^[-+]?[0-9]*\.[0-9]+$/))) {
    } else {
      throw new Error(message || MESSAGES['isDecimal']);
    }
  });
};

Validator.prototype.isFloat = Validator.prototype.isDecimal;

Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers, message) {
  // regex(/pattern/)
  // regex(/pattern/, "message")
  // regex("pattern")
  // regex("pattern", "modifiers")
  // regex("pattern", "message")
  // regex("pattern", "modifiers", "message")
  
  if (pattern instanceof RegExp) {
    if (object.isString(modifiers) && modifiers.match(/^[gimy]+$/)) {
      throw new Error("Invalid arguments: `modifiers` can only be passed in if `pattern` is a string.");
    }

    message = modifiers;
    modifiers = undefined;
  
  } else if (object.isString(pattern)) {
    if (arguments.length == 2 && !modifiers.match(/^[gimy]+$/)) {
      // 2nd arg doesn't look like modifier flags, it's the message (might also be undefined)
      message = modifiers;
      modifiers = undefined;
    }
    pattern = new RegExp(pattern, modifiers);
  }
  
  return this.add(function(value) {
    if (pattern.test(value) === false) {
      throw new Error(message || MESSAGES['regex']);
    }
  });
};

Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers, message) {
  // notRegex(/pattern/)
  // notRegex(/pattern/, "message")
  // notRegex("pattern")
  // notRegex("pattern", "modifiers")
  // notRegex("pattern", "message")
  // notRegex("pattern", "modifiers", "message")
  
  if (pattern instanceof RegExp) {
    if (object.isString(modifiers) && modifiers.match(/^[gimy]+$/)) {
      throw new Error("Invalid arguments: `modifiers` can only be passed in if `pattern` is a string.");
    }

    message = modifiers;
    modifiers = undefined;
  
  } else if (object.isString(pattern)) {
    if (arguments.length == 2 && !modifiers.match(/^[gimy]+$/)) {
      // 2nd arg doesn't look like modifier flags, it's the message (might also be undefined)
      message = modifiers;
      modifiers = undefined;
    }
    pattern = new RegExp(pattern, modifiers);
  }
  
  return this.add(function(value) {
    if (pattern.test(value) === true) {
      throw new Error(message || MESSAGES['notRegex']);
    }
  });
};

Validator.prototype.required = function(placeholderValue, message) {
  this.__required = true;
  return this.add(function(value) {
    if (!hasValue(value) || value == placeholderValue) {
      throw new Error(message || MESSAGES['required']);
    }
  });
};

Validator.prototype.minLength = function(length, message) {
  return this.add(function(value) {
    if (value.toString().length < length) {
      throw new Error(message || MESSAGES['minLength']);
    }
  });
};

Validator.prototype.maxLength = function(length, message) {
  return this.add(function(value) {
    if (value.toString().length > length) {
      throw new Error(message || MESSAGES['maxLength']);
    }
  });
};

Validator.prototype.custom = function(func, message) {
  return this.add(function(value) {
    try {
      func(value);
    } catch (e) {
      throw new Error(message || e.message || MESSAGES['custom']);
    }
  });
};

//Object.keys(ValidatorPrototype).forEach(function(name) {
  //if (name.match(/^(equals|check|validate|assert|error|len|isNumeric|isDecimal|isFloat|regex|notRegex|is|not|notNull|isNull)$/))
    //return;

  //Validator.prototype[name] = function() {
    //var args = Array.prototype.slice.call(arguments);

    //var message = undefined;

    //if (args.length) {
      //switch(name) {
        //case "contains":
        //case "notContains":
          //message = args[1];
          //break;
        //default:
          //message = args[0];
      //}
    //}
    
    //message = message || MESSAGES[name];
    
    //return this.add(function(value) {
      //return ValidatorPrototype[name].apply(externalValidator.check(value, message), args);
    //});
  //};
//});

// These validation methods are ported form Chris O'hara's validator module
// instead of Object.keys(ValidatorPrototype) above.
// Due to translate error messages on req.locale.
// Original license is below.

// Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>
//Permission is hereby granted, free of charge, to any person obtaining
//a copy of this software and associated documentation files (the
//"Software"), to deal in the Software without restriction, including
//without limitation the rights to use, copy, modify, merge, publish,
//distribute, sublicense, and/or sell copies of the Software, and to
//permit persons to whom the Software is furnished to do so, subject to
//the following conditions:

//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Validator.prototype.isEmail = function(message) {
 return this.add(function(value){
   if (!value.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
       throw new Error(message || MESSAGES['isEmail']);
   }
 })
}

Validator.prototype.isUrl = function(message) {
  return this.add(function(value){
    if (!value.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/)) {
        throw new Error(message || MESSAGES['isUrl'])
    }
  })
}

Validator.prototype.isIP = function(message) {
  return this.add(function(value){
     //net.isIP is in node >= 0.3.0
    var net = require('net')
    if (typeof net.isIP === 'function') {
        if (net.isIP(value) === 0) {
            throw new Error(message || MESSAGES['isIP'])
        }
    } else {
        if (!value.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
            throw new Error(message || MESSAGES['isIP'])
        }
    }
  })
}

Validator.prototype.isAlpha = function(message) {
  return this.add(function(value){
    if (!value.match(/^[a-zA-Z]+$/)) {
        throw new Error(message || MESSAGES['isAlpha'])
    }
  })
}
Validator.prototype.isAlphanumeric = function(message) {
  return this.add(function(value){
    if (!value.match(/^[a-zA-Z0-9]+$/)) {
        throw new Error(message || MESSAGES['isAlphanumeric'])
    }
  })
}
Validator.prototype.isLowercase = function(message) {
  return this.add(function(value){
    if (!value.match(/^[a-z0-9]+$/)) {
        throw new Error(message || MESSAGES['isLowercase'])
    }
  })
}
Validator.prototype.isUppercase = function(message) {
  return this.add(function(value){
    if (!value.match(/^[A-Z0-9]+$/)) {
        throw new Error(message || MESSAGES['isUppercase'])
    }
  })
}
Validator.prototype.isInt = function(message) {
  return this.add(function(value){
    if (!value.match(/^(?:-?(?:0|[1-9][0-9]*))$/)) {
        throw new Error(message || MESSAGES['isInt'])
    }
  })
}
Validator.prototype.notEmpty = function(message) {
  return this.add(function(value){
    if (value.match(/^[\s\t\r\n]*$/)) {
        throw new Error(message || MESSAGES['notEmpty'])
    }
  })
}
Validator.prototype.contains = function(str, message) {
  return this.add(function(value){
    if (value.indexOf(str) === -1) {
        throw new Error(message || MESSAGES['contains'])
    }
  })
}
Validator.prototype.notContains = function(str, message) {
  return this.add(function(value){
    if (value.indexOf(str) >= 0) {
        throw new Error(message || MESSAGES['notContains'])
    }
  })
}
Validator.prototype.isUUID = function(message) {
  return this.add(function(value){
    if (version == 3 || version == 'v3') {
        pattern = /[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    } else if (version == 4 || version == 'v4') {
        pattern = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    } else {
        pattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    }
    if (!value.match(pattern)) {
        throw new Error(message || MESSAGES['isUUID'])
    }
  })
}
module.exports = Validator;
