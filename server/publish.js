Meteor.publish( "feeds", function() {
	return Feeds.find();
})
Meteor.publish("allowedUrls", function() {
   return AllowedUrls.find({}, {fields: {feedUrl: 1}})
})