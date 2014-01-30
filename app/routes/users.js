export default Ember.Route.extend({

  beforeModel: function() {
    if(!this.controllerFor('authorization').get('token')) {
      this.transitionTo('authorization');
    }
  },

  renderTemplate: function() {
    this.render('rate_limit', {
      outlet: 'rate_limit',
      controller: 'rate_limit'
    });
    this._super();
  },

  model: function() {
    // Check to see what we have in localstorage. If we already
    // have some stuff, just send that as the model. Otherwise,
    // this is a fresh load and we want to pull some users from github
    var controller = this.controllerFor('users');
    var knownUsers = controller.knownUsers();

    if(knownUsers) {
      return knownUsers;
    }
    else {
      return controller.findQuery({ since: 0 });
    }
  },

  actions: {
    fetchMore: function() {
      var controller = this.controllerFor('users');
      var xhr = controller.findQuery({ since: controller.get('maxId') });
      if(xhr) {
        xhr.done(function(users) {
          controller.pushObjects(users);
        });
      }
      return false;
    }
  }

});
