/*
  In Step 6 ...
*/

import Store from 'appkit/microdata/store';
import Person from 'appkit/tests/helpers/person';

var container;
var store;

step(6, "Find a record", {
  setup: function() {
    container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("can find by integer or string", function() {
  store.push('person', {
    id: 12,
    firstName: 'Jamie',
    lastName: 'Gilgen'
  });

  var jamie = store.getById('person', 12);
  var jamie2 = store.getById('person', '12');
  strictEqual(jamie.get('id'), "12");
  strictEqual(jamie2.get('id'), "12");
  ok(jamie2 instanceof Person);
  ok(jamie instanceof Person);
});

test("finding a record by ID returns a promise for the requested record", function() {
  expect(3);
  stop();

  store.push('person', {
    id: 'wycats',
    firstName: "Yehuda",
    lastName: "Katz"
  });

  Ember.run(function() {
    store.find('person', 'wycats').then(function(wycats) {
      start();

      equal(wycats.get('$data.firstName'), "Yehuda", "the firstName property is correct");
      equal(wycats.get('$data.lastName'), "Katz", "the lastName property is correct");
      equal(wycats.get('id'), "wycats", "the id property is correct");
    });
  });
});
