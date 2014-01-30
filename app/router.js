var Router = Ember.Router.extend();

Router.reopen({
  location: 'history'
});

Router.map(function() {
  this.route('authorization');
  this.resource('users', { path: '/' }, function() {
    this.route('show', { path: '/:login' });
  });
});

export default Router;
