import Resolver from 'resolver';
import Store from 'appkit/microdata/store';

var App = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver
});

App.initializer({
  name: 'microdata',

  initialize: function(container, app) {
    app.register('store:main', Store);
    app.inject('controller', 'store', 'store:main');
  }
});

export default App;
