var assert = require("assert"),
    validation = require("../index"),
    validationMiddleware = validation({
      "age": {
        filter: ["trim", "toInt"]
      },
      "username": {
        filter: ["ltrim('d ')", function(value) { return value.toUpperCase(); }]
      }
    });

module.exports = {

  '0. ping server': function() {
    var request = {
      body: {
        age: "   5000  ",
        username: "  dandean"
      }
    };
    
    var response = {};
    
    validationMiddleware(request, response);
    
    assert.ok(typeof request.body.age == 'number', "Should have converted `age` to an Int");
    assert.equal(5000, request.body.age);
    assert.equal('ANDEAN', request.body.username);
    
    console.log(request.body);
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