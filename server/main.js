import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({
	'testMe'(){
		console.log('TEST ME!!');
        //return Meteor.http.call("GET", "http://api.themoviedb.org/3/movie/550?api_key=0325603ffb740cf6e64ffdbe9839255c");
        var ramdom = Math.floor(Math.random() * 1000) + 1;
        return Meteor.http.call("GET", "http://api.themoviedb.org/3/movie/"+ ramdom +"?api_key=0325603ffb740cf6e64ffdbe9839255c");

	}
});

const POLL_INTERVAL = 3000;

Meteor.publish('hosts', function() {
  console.log('registering hosts publication');
  const poll = () => {
    var ramdom = Math.floor(Math.random() * 1000) + 1;
    console.log(ramdom);
  	return results = "test"//Meteor.http.call("GET", "http://api.themoviedb.org/3/movie/"+ ramdom +"?api_key=0325603ffb740cf6e64ffdbe9839255c");
	//document.getElementById("image").src="http://image.tmdb.org/t/p/w185"+results.data.poster_path;
    //document.getElementById("image").style.visibility='visible';   
  };
  poll();
  this.ready();
  const interval = Meteor.setInterval(poll, POLL_INTERVAL);
  this.onStop(function() {
    	Meteor.clearInterval(interval);
  });
});


