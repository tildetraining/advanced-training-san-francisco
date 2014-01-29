/*
 Here, you'll implement a deferral to the store's adapter for finding
 and saving a record.

 If the promise returned by the adapaters save resolves, changes should always
 be merged.

 If it gets rejected, changes should still exist after save() and
 the canonical data attribute should not contain the changes.
*/

import Store from 'appkit/microdata/store';
import Model from 'appkit/microdata/model';
import Person from 'appkit/tests/helpers/person';

var store;

step(7, "Adapter API", {
  setup: function() {
    var container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("finding a record that doesn't exist queries the adapter", function() {
  store.adapter = {
    find: async(function(type, id) {
      equal(type, 'person', "find is passed person type");
      equal(id, 'wycats', "find is passed wycats id");

      return Ember.RSVP.resolve({
        id: 'wycats',
        firstName: "Yehuda",
        lastName: "Katz"
      });
    })
  };

  Ember.run(function() {
    store.find('person', 'wycats').then(async(function(wycats) {
      equal(wycats.get('$data.firstName'), "Yehuda", "the firstName property is correct");
      equal(wycats.get('$data.lastName'), "Katz", "the lastName property is correct");
      equal(wycats.get('id'), "wycats", "the id property is correct");
    }));
  });
});

test("saving a record calls `save` on the adapter", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      equal(type, "person", "The type is passed in");
      equal(record, person, "The record is passed in");

      // equivalent of a 204
      return Ember.RSVP.resolve();
    })
  };

  var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });

  Ember.run(function() {
    person.save();
  });
});

test("an adapter that returns a promise that fulfills with no value merges changes", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      // equivalent of a 204
      return Ember.RSVP.resolve();
    })
  };

  var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });
  person.set('firstName', "Thomas");

  Ember.run(function() {
    person.save().then(async(function(tom) {
      equal(tom.get('firstName'), "Thomas");
      equal(tom.$data.firstName, "Thomas");
      deepEqual(tom.$changes, {});
    }));
  });
});

test("an adapter that reutrns a promise that fulfills with a payload replaces the original data", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      // equivalent of a 200
      return Ember.RSVP.resolve({ id: 1, firstName: "Tomasz", lastName: "Dale" });
    })
  };

  var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });

  Ember.run(function() {
    person.save().then(async(function(tom) {
      equal(tom.get('firstName'), "Tomasz");
      equal(tom.$data.firstName, "Tomasz");
      deepEqual(tom.$changes, {});
    }));
  });
});

test("an adapter that returns a promise that rejects does not merge changes", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      return Ember.RSVP.reject(record);
    })
  };

  var person = store.push('person', { id: 2, firstName: "Jamie", lastName: "Gilgen" });
  person.set('firstName', "Jamiebikies");

  Ember.run(function() {
    person.save().then(function() {
      ok(false, "This should not be reached");
    }, async(function(tom) {
      equal(tom.get('firstName'), "Jamiebikies");
      equal(tom.$data.firstName, "Jamie");
      deepEqual(tom.$changes, { firstName: 'Jamiebikies' });
    }));
  });
});
