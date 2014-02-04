Template.home.events({
   
});
Template.home.helpers({
   
});
Template.home.rendered = function() {
   $('.feed').on('click', function() {
      console.log("clicked");
      var $this = $(this).find('.feed-summary');
      $('.feed-summary').not($this).hide(); 
      $this.toggle();
   });
}

