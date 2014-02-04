var Fiber = Npm.require('fibers');

var FeedParser = Meteor.require('feedparser'),
		 request = Meteor.require('request');

processFeed = function(processFeedOptions) {
	var item = processFeedOptions.item;
	var lastFeedInserted = processFeedOptions.lastFeedInserted;
	console.log("last inserted: " + lastFeedInserted + " New feed: " + item.title);
	Feeds.insert({
		title: item.title
	});
};

Meteor.methods({

	addFeeds: function() {
    try {
      var allowedUrls = AllowedUrls.find();
      var items = [];
      var Future  = Npm.require('fibers/future');
      var future = new Future();
      allowedUrls.forEach(function(url) {
        request(url.feedUrl)
        .pipe(new FeedParser())
        .on('error', function(error) {
        })// always handle errors
        .on('meta', function (meta) {
        })// do something
        .on('readable', function () {
          console.log("onreadable called");
          var stream = this, item;
          while (item = stream.read()) {
            items.push(item);
          }
        })
        .on('end', function () {
          future.return(items);
        });
        //===============================================================
        //  Get the last inserted feed
        // iterate through new fetched feeds
        //  check if the feed mathces last inserted feed
        //      if it does NOT, save it
        //===============================================================
        var item;
        var lastFeedInserted = Feeds.findOne({ feedID: url._id });
        var feed_items = future.wait();

        _.each(feed_items, function(item){
          if (lastFeedInserted) {
            if (lastFeedInserted.title !== item.title) {
              console.log("processFeed");
              var processFeedOptions = {
                item: item,
                lastFeedInserted: lastFeedInserted
              }
              processFeed(processFeedOptions);
            }
          } else {
            Feeds.insert({
              title: item.title
            });
            console.log("brand new feed inserted");
          }
        });
      });
    } catch(e) {
      console.log("I should go home.", e);
    }
  }
});