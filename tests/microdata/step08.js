/*
  In Step 8 ...
*/

import Store from 'appkit/microdata/store';
import Person from 'appkit/tests/helpers/person';

var store, container;

step(8, "Saving a record", {
  setup: function() {
    container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("Records can be saved", function() {
  var store = Ember.Object.create({
    save: async(function(type, record) {
      equal(type, 'person', "The record's type is passed in");
      equal(record, person, "The record is passed in");
    })
  });

  var person = Person.create({
    $data: { firstName: "Yehuda", lastName: "Katz" },
    $type: 'person',
    $store: store
  });

  person.save();
});

