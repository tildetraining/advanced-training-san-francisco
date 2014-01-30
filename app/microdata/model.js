export default Ember.Object.extend({
  init: function() {
    this.$changes = {};
    this.$data = this.$data || {};
  },

  save: function() {
    return this.$store.save(this.$type, this);
  },

  $mergeChanges: function() {
    Ember.merge(this.$data, this.$changes);
    this.set('$changes', {});
  }
});
