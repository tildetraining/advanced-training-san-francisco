/*
  In Step 3 ...
*/

import Person from 'appkit/tests/helpers/person';

step(3, "Model definition");

test("You can add attributes to the model via $data", function() {
  var person = Person.create({ $data: { firstName: "Tom", lastName: "Dale" } });

  equal(person.get('firstName'), "Tom");
  equal(person.get('lastName'), "Dale");
});

