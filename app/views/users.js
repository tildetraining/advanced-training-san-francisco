export default Em.View.extend({

  classNames: ['users'],

  isNearBottom: function() {
    var position = $(window).scrollTop() + $(window).height();
    var total = $(document).height();
    return position > total - $(window).height()/2;
  },

  didResize: function(ev) {
    var totalWidth = $(document).outerWidth(true) * 0.7;
    var calculatedWidth = parseInt(Math.floor(totalWidth / 150)) * 150;
    this.$().height($(window).height() - 80);
    this.$().width(calculatedWidth);
  },

  didScroll: function(ev) {
    if(!this.isNearBottom()) return;
    this.get('controller').send('fetchMore');
  }

  // UserListView:
  // Here you will need to implement a CollectionView. The view's element
  // should be a <ul> and have a class name 'users-list'. The view for
  // each item in the collection should have an element of type <li>
  // with a class name 'user'
});
