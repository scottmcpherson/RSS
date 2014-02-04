Template.layout.events({
	'submit #addrss': function(e) {
		e.preventDefault();
		console.log("form submitted");
	},
	'click .show-feeds': function(e) {
		e.preventDefault();
		Meteor.call( 'addFeeds', function( error, result ) {
			if (!error) {
				console.log("success");
			};
		});
	}
});





// Template.layout.helpers({
// 	feeds: function() {

// 	}
// });