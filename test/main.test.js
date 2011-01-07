var assert = require("assert"),
    validation = require("../index"),
    f = validation.filter,
    v = validation.validator,
    validationMiddleware = validation({
      "age": {
        filter: ["trim", "toInt"],
        validate: "isInt"
      },
      "birthyear": {
        filter: "toInt",
        validate: "required -> birthyear is a required field"
      },
      "graduationyear": {
        filter: "toInt",
        validate: ["required", "isInt", "len(4,4)", "isLowercase"]
      },
      "username": {
        filter: [
          "ltrim('d ')",
          function(value) { return value.toUpperCase(); }
        ]
      }
//    }),
//    validationMiddleware2 = validation({
//      "age": {
//        filter: f.trim().toInt(),
//        validate: v.isInt("Age must be an integer")
//      },
//      "birthyear": {
//        filter: f.toInt(),
//        validate: v.required("birthyear is a required field")
//      },
//      "graduationyear": {
//        filter: f.toInt(),
//        validate: v.required("%s is a required field")
//                   .isInt("%s must be in integer")
//                   .len(4,4, "%s must be four digits long")
//                   .isLowercase("%s must use lowercase letters")
//      },
//      "username": {
//        filter: f.ltrim('d ')
//                 .custom(function(value) {
//                   return value.toUpperCase();
//                 })
//      }
    })
    ;

module.exports = {

  '0. ping server': function() {
    var request = {
      body: {
        age: "   5000  ",
//        birthyear: "1978",
        graduationyear: "2003",
        username: "  dandean"
      }
    };
    
    var response = {};
    
    validationMiddleware(request, response);
    
    assert.ok(typeof request.body.age == 'number', "Should have converted `age` to an Int");
    assert.equal(5000, request.body.age);
    assert.equal('ANDEAN', request.body.username);
  },
  
  '1. configuration': function() {
  },
  
  '2. list users': function() {
  },
  
  '3. create user': function() {
  },
  
  '4. get user': function() {
  },
  
  '5. modify user': function() {
  }
};