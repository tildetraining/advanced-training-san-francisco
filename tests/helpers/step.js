export default function(number, description, opts) {

  opts = !opts ? {} : opts;
  if (number < 10) number = "0" + number;

  module("Step " + number + ": " + description, {
    setup: function() {
      window.App = startApp();
      if (typeof(opts.setup) === 'function') opts.setup.apply(this);
    },

    teardown: function() {
      if (typeof(opts.teardown) === 'function') opts.teardown.apply(this);
      Ember.run(window.App, 'destroy');
    }
  });

}

