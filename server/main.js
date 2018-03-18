import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  //MoviePage.insert({_id: "2", movie:"rgrg", age:"rgrg", visible:true, koko:{title:"lolo",release:"2018"}});
  initMongoDB();
});


Meteor.methods({
  'CallPopular'() {
    return MoviePage.find().fetch();
  },
  "charGenre"(years) {
    return StatsGenre(years);
  }
});

const POLL_INTERVAL = 11000;
var arraygenre = [];

Meteor.publish('hosts', function () {
  const publishedKeys = {};
  var page = 0;
  console.log('registering hosts publication');
  const poll = () => {
    var Config = MoviePage.find().fetch();
    Config.forEach((conf) => {
      var next_page = parseInt(conf.page) + 1;
      if (parseInt(conf.page) <= parseInt(conf.total_pages)) {
        var result = Meteor.http.call("GET", "https://api.themoviedb.org/3/discover/movie?api_key=0325603ffb740cf6e64ffdbe9839255c&sort_by=popularity.desc&primary_release_year=" + conf._id + "&page=" + conf.page);
        result.data.results.forEach((doc) => {
          Movie.insert({
            title: doc.title + "",
            years: conf._id + "",
            popularity: doc.popularity + "",
            poster_path: doc.poster_path + "",
            genres: doc.genre_ids
          });
        });
        MoviePage.update({ "_id": conf._id }, { page: next_page + "", total_films: conf.total_films + "", total_pages: conf.total_pages + "" });
      }
    });
  };
  poll();
  this.ready();
  const interval = Meteor.setInterval(poll, POLL_INTERVAL);
  this.onStop(function () {
    Meteor.clearInterval(interval);
  });
});

function initMongoDB() {
  createMongoPage();
  createMongoGenre();

};

function StatsGenre(years) {
  arraygenre = [];
  yy = years + "";
  var genre = MovieGenre.find().fetch();
  genre.forEach((data) => {
    arraygenre.push(new keyValue(data._id, data.name, 0));
  });
  var movie = Movie.find({ years: yy }).fetch();
  movie.forEach((data) => {
    data.genres.forEach((genre) => {
      Update(genre);
    });
  });
  return arraygenre;
}

function keyValue(key, name, value) {
  this.Key = key;
  this.name = name;
  this.Value = value;
};

function Update(key) {
  for (var i = 0; i < arraygenre.length; i++) {
    if (arraygenre[i].Key == key) {
      arraygenre[i].Value++;
      break;
    }
  }
}

function createMongoPage() {
  for (var years = 1900; years < 2019; years++) {
    var test = MoviePage.find({ _id: years + "" }).fetch();
    if (test.length == 0) {
      var result = Meteor.http.call("GET", "https://api.themoviedb.org/3/discover/movie?api_key=0325603ffb740cf6e64ffdbe9839255c&sort_by=popularity.desc&primary_release_year=" + years + "&page=1");
      MoviePage.insert({ _id: years + "", page: "1", total_films: result.data.total_results + "", total_pages: result.data.total_pages + "" });
      console.log("insert " + years + " sucess, total_pages : " + result.data.total_pages + "  total_films : " + result.data.total_results);
    }
  };
};

function createMongoGenre() {
  var test = MovieGenre.find().fetch();
  if (test.length == 0) {
    var result = Meteor.http.call("GET", "http://api.themoviedb.org/3/genre/movie/list?api_key=0325603ffb740cf6e64ffdbe9839255c");
    result.data.genres.forEach((doc) => {
      MovieGenre.insert({
        _id: doc.id + "",
        name: doc.name + ""
      });
      console.log(doc);
    });
  }
};

