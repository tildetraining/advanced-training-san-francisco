/*
  In Step 5 ...
*/

import Store from 'appkit/microdata/store';
import Person from 'appkit/tests/helpers/person';

var store;
var container;

step(5, "Updating the Store", {
  setup: function() {
    container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("You can change attributes", function() {
  var person = Person.create({ $data: { firstName: "Tom", lastName: "Dale" } });

  person.set('firstName', "Thomas");

  equal(person.get('firstName'), "Thomas");
  equal(person.get('lastName'), "Dale");
});

test("a record can merge changes into $data", function() {
  var person = Person.create({
    $data: { firstName: "Yehuda", lastName: "Katz" },
  });

  person.set('lastName', 'Schwarzkopf');

  person.$mergeChanges();

  deepEqual(person.$data, {
    firstName: "Yehuda",
    lastName: "Schwarzkopf"
  }, "changes were merged into $data");
});

