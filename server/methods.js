var Fiber = Npm.require('fibers');

var FeedParser = Meteor.require('feedparser'),
		 request = Meteor.require('request');


saveFeed = Meteor.bindEnvironment(function(item, id) {
	// var description = item.description;
	// var reg = /\<body[^>]*\>([^]*)\<\/body/m;
	// var alteredDescription = description.match( reg )[1];
	var id = Feeds.insert({
		feedID: id,
		title: item.title,
		summary: item.description,
		url: item.url,
		link: item.link,
		pubDate: item.pubdate
	});
	var insertedRecord = Feeds.findOne({_id: id});
	console.log( "New Record Inserted: ", insertedRecord.title );
});
getLastInsertedFeed = Meteor.bindEnvironment(function(feedId, cb){
	var feed = Feeds.findOne({ feedID: feedId });
	cb(feed);
});


processFeed = function(processFeedOptions) {
	var item = processFeedOptions.item;
	var lastFeedInserted = processFeedOptions.lastFeedInserted;
	console.log("last inserted: " + lastFeedInserted + " New feed: " + item.title);
	Feeds.insert({
		title: item.title
	});
};



Meteor.methods({

	fetchRSS: function() {
		var FeedParser = Meteor.require('feedparser'),
				 request = Meteor.require('request');


		var fetchedUrls = AllowedUrls.find({}, {fields: {feedUrl: 1}});
		

		fetchedUrls.forEach(function(feed) {
			console.log(feed.feedUrl);

			request(feed.feedUrl)
			.pipe(new FeedParser())
			.on('error', function(error) {
				// always handle errors
				console.log("error", error);
			})
			.on('meta', function (meta) {
				// do something
				console.log("meta", meta);
			})
			.on('readable', function () {
				// do something else, then do the next thing
				var stream = this, item;
				
				var newFeeds = true;
				while (item = stream.read()) {

					//===============================================================
					//	Get the last inserted feed
					// iterate through new fetched feeds
					// 	check if the feed mathces last inserted feed
					//		if it does NOT, save it
					//===============================================================
					console.log("item title: ", item.title);
					getLastInsertedFeed(feed._id, function(lastInsertedFeed) {
						var copiedItem = item;
						console.log("last inserted feed: ", lastInsertedFeed.title );
						if (lastInsertedFeed.title === copiedItem.title) {
							console.log("true, titles are equal");
							console.log("last inserted title: ", lastInsertedFeed.title);
							console.log("item title: ", copiedItem.title);
							// console.log(item);
						} else {
							console.log("false");
						}
						// 	console.log( 'Got article new: %s', item.title || item.description );
						// 	saveFeed(item, feed._id);
						// } else {
						// 	newFeeds = false;
						// 	console.log("no more new feeds");
						// }
					});
					

					// if (lastInsertedFeed.title !== item.title) {
					// 	console.log( 'Got article new: %s', item.title || item.description );
					// 	saveFeed(item, feed._id);
					// }
					// console.log("Getting ready to break");
					// break;
						
					
					// console.log( 'article description: ', item.summary );
					// console.log( 'article link: ', item.link );
					// console.log( 'article date: ', item.pubdate );
					// console.log( 'article image url: ' + item.media );
				}
			});
		});	
	},
	addFeed: function() {
		try {

			var allowedUrls = AllowedUrls.find();

			allowedUrls.forEach(function(url) {
			
				request(url.feedUrl)
				.pipe(new FeedParser())
				.on('error', function(error) {
				})// always handle errors
				.on('meta', function (meta) {	
				})// do something
				.on('readable', function () {
					//===============================================================
					//	Get the last inserted feed
					// iterate through new fetched feeds
					// 	check if the feed mathces last inserted feed
					//		if it does NOT, save it
					//===============================================================
					var stream = this, item;
					Fiber(function() {
						var lastFeedInserted = Feeds.findOne();
						var bool = true;
						while (item = stream.read() && bool) {
							console.log("bool:      ", bool);
							if (lastFeedInserted) {
								if (lastFeedInserted.title !== item.title) {
									console.log('lastFeedInserted: ', lastFeedInserted.title);
									console.log( "New feed found, item.title: ", item.title );
									console.log( "New feed found, last.title: ", lastFeedInserted.title );

									Feeds.insert({
										title: item.title,
										summary: item.description,
										url: item.url,
										link: item.link,
										pubDate: item.pubdate
									});
								} else {
									console.log("bool is being set to false");
									bool = false;
									break;
								}
							} else {
								Feeds.insert({
									title: item.title,
									summary: item.description,
									url: item.url,
									link: item.link,
									pubDate: item.pubdate
								});
								console.log("brand new feed inserted");
							}	
						}
						
					}).run();
				});
			});
		} catch(e) {
			console.log("I should go home.", e);
		}
	},

	addFeeds: function() {
    try {
 
      var allowedUrls = AllowedUrls.find();
 
      allowedUrls.forEach(function(url) {
 
        request(url.feedUrl)
        .pipe(new FeedParser())
        .on('error', function(error) {
        })// always handle errors
        .on('meta', function (meta) {   
        })// do something
        .on('readable', function () {
          console.log("onreadable called");
          //===============================================================
          //  Get the last inserted feed
          // iterate through new fetched feeds
          //  check if the feed mathces last inserted feed
          //      if it does NOT, save it
          //===============================================================
          var stream = this, item;
          var lastFeedInserted = Feeds.findOne({ feedID: url._id });
          var bool = true;
 
            while (item = stream.read() && bool) {
              console.log("bool:      ", bool);
              if (lastFeedInserted) {
                if (lastFeedInserted.title !== item.title) {
                  console.log("processFeed");
                  var processFeedOptions = {
                    item: item,
                    lastFeedInserted: lastFeedInserted
                  }
                  Meteor.bindEnvironment(function(processFeedOptions){
                    console.log("sucess!!!, feed iserted");
                    processFeed(processFeedOptions);
                  }, function(e){
                    throw e;
                  })
 
                } else {
                  console.log("bool is being set to false");
                  bool = false;
                  break;
                }
              } else {
                Feeds.insert({
                  title: item.title
                });
                console.log("brand new feed inserted");
              }   
            }
 
        });
      });
    } catch(e) {
      console.log("I should go home.", e);
    }
  }
});