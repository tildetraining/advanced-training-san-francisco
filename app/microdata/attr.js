export default function() {
  return function(key, value) {
    if (arguments.length >= 2) {
      this.$changes[key] = value;
      return value;
    }

    return this.$changes[key] || this.$data[key];
  }.property('$changes', '$data');
}
