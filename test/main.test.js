var assert = require("assert"),
    form = require("../index"),
    filter = form.filter,
    validationMiddleware = form(
      filter("title").entityEncode(),
      filter("age").entityDecode().trim().toInt(),
      filter("birthyear").toInt(),
      filter("graduationyear").toInt(),
      filter("username").ltrim("d "),
      filter("exclamations").custom(function() { return "!!!"; })
    );

module.exports = {

  '0. basic': function() {
    var request = {
      body: {
        exclamations: "NOT EXCLAMATIONS",
        title: "<h1>TITLE</h1>",
        age: "   5000  ",
        birthyear: "1978",
        graduationyear: "2003",
        username: "  dandean"
      }
    };
    
    validationMiddleware(request, {});
    
    console.log(request);
    
    assert.ok(typeof request.body.age == 'number', "Should have converted `age` to an Int");
    assert.equal(5000, request.body.age);
    assert.equal('andean', request.body.username);
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