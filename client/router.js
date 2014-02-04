Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
	this.route( 'home', {
		path: '/',
		template: 'home',
		data: function() {
			return {
				feeds: Feeds.find( {}, { limit: 5 } )
			}
		}
 	});
});