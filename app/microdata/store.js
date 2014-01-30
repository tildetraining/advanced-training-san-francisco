/*jshint boss:true*/

var set = Ember.set;

var coerceId = function(id) {
  return id == null ? null : id+'';
};

export default Ember.Object.extend({
  init: function() {
    this.identityMap = {};
  },

  createRecord: function(type, data) {
    return buildRecord(this, type, data, 'created');
  },

  push: function(type, data) {

    data.id = coerceId(data.id);

    var record = this.getById(type, data.id);

    if (!record) {
      record = buildRecord(this, type, data, 'loaded');
    } else {
      set(record, '$data', data);
    }

    return record;
  },

  getById: function(type, id) {

    id = coerceId(id);

    var identityMapByType = this.identityMap[type],
        record;

    if (identityMapByType && (record = identityMapByType[id])) {
      return record;
    }
  },

  find: function(type, id) {

    id = coerceId(id);

    var record = this.getById(type, id),
        adapter = this.adapter,
        store = this;

    if (record) {
      return Ember.RSVP.resolve(record);
    } else if (adapter) {
      return adapter.find(type, id).then(function(payload) {
        return store.push(type, payload);
      });
    } else {
      return Ember.RSVP.reject(new Error("The record with id " + id + " was not found and the store did not have an adapter specified."));
    }
  },

  save: function(type, record) {
    switch (record.$state) {
      case 'created': return createRecord(this, type, record);
      case 'loaded':  return updateRecord(this, type, record);
    }
  }
});

function buildRecord(store, type, data, state) {

  data.id = coerceId(data.id);

  var typeFactory = store.container.lookupFactory('model:'+type);

  var record = typeFactory.create({
    id: data.id,
    $store: store,
    $type: type,
    $data: data,
    $state: state
  });

  indexRecord(store, type, record, data);

  return record;
}

function indexRecord(store, type, record, data) {

  data.id = coerceId(data.id);

  var identityMapForType = store.identityMap[type] || {};
  identityMapForType[data.id] = record;

  store.identityMap[type] = identityMapForType;
}

function createRecord(store, type, record) {
  return commit(store, type, record, 'createRecord', function(payload) {
    if (payload) {
      payload.id = coerceId(payload.id);
      indexRecord(store, type, record, payload);
      record.set('id', payload.id);
    }

    record.set('$state', 'loaded');
  });
}

function updateRecord(store, type, record) {
  return commit(store, type, record, 'updateRecord');
}

function commit(store, type, record, operation, callback) {
  return store.adapter[operation](type, record).then(function(payload) {
    if (callback) callback(payload);

    if (payload) {

      record.set('$data', payload);
      record.set('$changes', {});
    } else {
      record.$mergeChanges();
    }

    return record;
  });
}
