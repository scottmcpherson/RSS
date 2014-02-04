urls = [
   { siteName: 'CSS-Tricks', feedUrl: 'http://css-tricks.com/feed/' }
   // { siteName: 'Mashable', feedUrl: 'http://feeds.mashable.com/Mashable' },
   // { siteName: 'Lifehacker', feedUrl: 'http://feeds.gawker.com/lifehacker/full.xml' }
   // { siteName: 'The Buffer blog', feedUrl: 'http://feeds.feedburner.com/bufferapp' },
   // { siteName: 'Lifehack', feedUrl: 'http://www.lifehack.org/feed' },
   // { siteName: 'The Blog of Tim Ferriss', feedUrl: 'http://www.fourhourworkweek.com/blog/feed/' },
   // { siteName: 'TeckCrunch', feedUrl: 'http://feeds.feedburner.com/TechCrunch/' },
   // { siteName: 'The Verge', feedUrl: 'http://www.theverge.com/rss/group/features/index.xml' },
   // { siteName: 'Forbes', feedUrl: 'http://www.forbes.com/feeds/popstories.xml' }
];

if (AllowedUrls.find().count() === 0) {
   _.each( urls, function(feed) {
      var id = AllowedUrls.insert({
         siteName: feed.siteName,
         feedUrl: feed.feedUrl
      });
      console.log("allowed url created: ", id);
   });
}
// var MyCron = new Cron(60000);

// MyCron.addJob(1, function() {
//    console.log('tick');
// });