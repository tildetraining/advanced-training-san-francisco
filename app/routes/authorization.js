export default Em.Route.extend({

  testCredentials: function() {
    var controller = this.controllerFor('authorization');
    var usersController = this.controllerFor('users');
    controller.set('errorMsg', null);

    // Test credentials by doing an API request
    return usersController.findQuery({ since: 0, noUpdateStore: true });
  },

  didAuthenticate: function() {
    var controller = this.controllerFor('authorization');
    localStorage.setItem('token', controller.get('token'));
    this.transitionTo('users');
  },

  didFailAuthentication: function(errorMsg) {
    this.controllerFor('authorization').setProperties({
      errorMsg: errorMsg,
      password: null
    });
  },

  actions: {
    didSetCredentials: function() {
      var router = this;
      this.testCredentials().then(
        function() {
          router.didAuthenticate();
        },
        function(resp) {
          var errorMsg = JSON.parse(resp.responseText).message;
          router.didFailAuthentication(errorMsg);
        }
      );
      return false;
    },
  }

});
