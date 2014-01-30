export default Ember.ArrayController.extend({

  needs: ['authorization', 'rateLimit'],
  userIds: Em.computed.mapBy('content', 'id'),
  maxId: Em.computed.max('userIds'),
  token: Em.computed.alias('controllers.authorization.token'),
  localStorageKey: 'githubUsers',
  isFetching: false,

  knownUsers: function() {
    var localStorageItems = localStorage.getItem(this.get('localStorageKey'));
    return JSON.parse(localStorageItems);
  },

  appendToLocalStorage: function(users) {
    var knownUsers = this.knownUsers() || [];
    knownUsers.pushObjects(users);
    localStorage.setItem(
      this.get('localStorageKey'),
      JSON.stringify(knownUsers)
    );
  },

  // TODO: Move this out to a github microdata adapter
  findQuery: function(opts) {
    var controller = this;
    var limitController = this.get('controllers.rateLimit');

    // Don't fire more than one request at a time
    if(this.get('isFetching')) return false;
    this.set('isFetching', true);

    if(!opts || !isFinite(opts.since)) {
      console.warn("Pass in a since parameter");
      return;
    }

    return $.ajax({
      url: 'https://api.github.com/users?since=' + opts.since,
      headers: { 'Authorization': 'Basic ' + this.get('token') },
      error: function(resp) {
        if(resp.status === 401) {
          controller.transitionToRoute('authorization');
        }
      },
      success: function(data, textStatus, jqHhr) {
        var limit = jqHhr.getResponseHeader('X-RateLimit-Remaining');
        console.log("Rate limit: ", limit);
        limitController.set('rateLimit', limit);
        if(opts.noUpdateStore) return;
        controller.appendToLocalStorage(data);
      },
      complete: function() {
        controller.set('isFetching', false);
      }
    });
  },

  find: function(id) {
    var controller = this;

    Ember.assert(id, "You need to pass in an ID to find");

    return $.ajax({
      url: 'https://api.github.com/users/' + id,
      headers: { 'Authorization': 'Basic ' + this.get('token') },
      error: function(resp) {
        if(resp.status === 401) {
          controller.transitionToRoute('authorization');
        }
      }
    });
  }

});
