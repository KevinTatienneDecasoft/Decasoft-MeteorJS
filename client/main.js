import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';


import './main.html';
hosts = new Mongo.Collection('hosts');

Meteor.startup(function () {
   Meteor.subscribe('hosts');
});


Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    //instance.counter.set(instance.counter.get() + 1);

    /*Meteor.call("testMe", function(error, results) {
        console.log(results.data.original_title); //results.data should be a JSON object
        document.getElementById("image").src="http://image.tmdb.org/t/p/w185"+results.data.poster_path;
        document.getElementById("image").style.visibility='visible';
    });*/
    console.log(hosts.find());


  },
});

Template.personsList.helpers({
	persons: function(){
		return Persons.find();
	}
});

Template.addPerson.events({
	'submit':function(event){
		const modif = event.target.modif.value
		const pseudo = event.target.pseudo.value;
		const age = event.target.age.value;
		if(modif != ""){
			Persons.update( {"_id": modif}, {pseudo:pseudo, age:age, visible:true});
			console.log("réussi");
		}
		else{
			Persons.insert({pseudo:pseudo, age:age, visible:true});
		}	
		event.target.pseudo.value = '';
		event.target.age.value = '';
		event.target.modif.value = '';
		console.log("Ajout Pseudo:" + pseudo +", Age:" + age);
		event.preventDefault();
	}, 

	'click button':function(event){
		console.log('autre ajout personne');
	}, 
	'click .addPerson':function(event){
		console.log('autre ajout personne par class');
	}, 
	'click #addPerson':function(event){
		console.log('autre ajout personne par id');
	}, 
});

/*
Template.activePerson.helpers({
	activePerson : function(){
		return Session.get('activePerson');
	}
});*/

Template.personsList.events({
	'click tr':function(event){
		//console.log( event.target.innerText);
		//Session.set('activePerson', event.target.innerText);
		console.log(event.currentTarget.children[3].lastElementChild.id);

		//console.log(event.currentTarget.children[1].innerText);

		//console.log(event.target);

		document.getElementById("pseudo").value = event.currentTarget.children[0].innerText;
		document.getElementById("age").value = event.currentTarget.children[1].innerText;
		document.getElementById("modif").value = event.currentTarget.children[3].lastElementChild.id
	}, 
	'click button':function(event){
		console.log(event.target.id);
		Persons.remove( {"_id": event.target.id});
	},
});

Template.SessionServers.helpers({
	SessionServers : function(){
		//console.log( Meteor.status().status);
		return Meteor.status().status;
	} 
});

Template.registerHelper('compare', function(v1, v2) {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return _.isEqual(v1, v2); // do a object comparison
  } else {
    return v1 === v2;
  }
});

if (Meteor.isClient) {

   var counter = 0;
   var page = 1
   var myInterval = Meteor.setInterval(function() {
      counter ++
      if(counter > 19){
      	counter = 0
      	page ++;
      }
      console.log("Interval called " + counter + " times...");


     /*Meteor.call("testMe", function(error, results) {
        console.log(results.data.original_title); //results.data should be a JSON object
        document.getElementById("image").src="http://image.tmdb.org/t/p/w185"+results.data.poster_path;
        document.getElementById("image").style.visibility='visible';
	});*/

        Meteor.call("CallPopular",page, function(error,results){
        	console.log(results);
        	//console.log(results.data.results[counter]); //results.data should be a JSON object
        	document.getElementById("image").src="http://image.tmdb.org/t/p/w185"+results.data.results[counter].poster_path;
       		document.getElementById("image").style.visibility='visible';
        });
    
     
   }, 2000);

   Template.myTemplate.events({

      'click button': function() {
         Meteor.clearInterval(myInterval);
         console.log('Interval cleared...')
      }
   });
};
