export default Ember.Controller.extend({

  init: function() {
    this._super();
    this.loadDetailsFromLocal();
  },

  loadDetailsFromLocal: function() {
    var localStorageToken = localStorage.getItem('token');
    if(!localStorageToken) return;

    var deets = atob(localStorage.getItem('token')).split(':');

    this.setProperties({
      username: deets[0],
      password: deets[1]
    });
  },

  token: function() {
    if(!this.get('username') || !this.get('password')) return;
    return btoa(this.get('username') + ':' + this.get('password'));
  }.property('username', 'password')

});
