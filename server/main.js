import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({
	'testMe'(){
		//console.log('TEST ME!!');
        //return Meteor.http.call("GET", "http://api.themoviedb.org/3/movie/550?api_key=0325603ffb740cf6e64ffdbe9839255c");
        var ramdom = Math.floor(Math.random() * 1000) + 1;
        return Meteor.http.call("GET", "http://api.themoviedb.org/3/movie/"+ ramdom +"?api_key=0325603ffb740cf6e64ffdbe9839255c");

	},
  'CallPopular'(page){
       return Meteor.http.call("GET", "https://api.themoviedb.org/3/discover/movie?api_key=0325603ffb740cf6e64ffdbe9839255c&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page="+page);
  }
});

const POLL_INTERVAL = 20000;

Meteor.publish('hosts', function() {
  const publishedKeys = {};
  var page = 0;
  console.log('registering hosts publication');
  const poll = () => {
    page ++;
    console.log(page);
    var result = Meteor.http.call("GET", "https://api.themoviedb.org/3/discover/movie?api_key=0325603ffb740cf6e64ffdbe9839255c&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page="+page);
    //console.log(result);


      result.data.results.forEach((doc) => {
        if (publishedKeys[doc.id]) {
        console.log('CHANGED:' + doc.id + ' '+ doc.title);
        this.changed("hosts", doc.id, doc);
        } else {
        console.log('ADDED:' + doc.id + ' '+ doc.title);
          publishedKeys[doc.id] = true;
        this.added("hosts", doc.id, doc);
        }
    });
  };
  poll();
  this.ready();
  const interval = Meteor.setInterval(poll, POLL_INTERVAL);
  this.onStop(function() {
    	Meteor.clearInterval(interval);
  });
});


