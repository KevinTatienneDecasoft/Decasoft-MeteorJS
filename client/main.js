import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import Chart from 'chart.js';
import { Mongo } from 'meteor/mongo';


import './main.html';
hosts = new Mongo.Collection('hosts');
var myInterval = null;
Meteor.startup(function () {
	Meteor.subscribe('hosts');
	createGraph();
	createPie();
});

Template.graphmovie.events({
	'click #reload'(event, instance) {
		createGraph();
		createPie();
	},
	'click #stopimg': function () {
		console.log("stop img");
		Meteor.clearInterval(myInterval);
		document.getElementById("image").style.visibility = 'hidden';
	},
	'input #theinput': function(event){
		var years = document.getElementById("theinput").value;
		ctx = document.getElementById("myPieMovie");
		$('#myPieMovie').remove();
		$('#MyCanvas').append('<canvas id="myPieMovie" width="600 " height="600"></canvas>');
		createPie(years);
	},
});

function createPie(years) {
	var yy;
	if(years == null){
		yy = 2018
	} else {
		yy = years;
	}
	Meteor.call("charGenre", yy, function (error, results) {
		var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
         };
		var label = [];
		var data = [];
		var color = [];
		results.forEach((doc) => {
			label.push(doc.name);
			data.push(doc.Value);
			color.push(dynamicColors());
		});
		var config = {
			type: 'doughnut',
			data: {
				labels: label,
				datasets: [{
					data: data,
					backgroundColor: color,
				}],			
			},
			options: {
				title: {
				   display: true,
				   fontsize: 14,
				   text: 'Genre / ans'
			   },
			   legend: {
				   display: true,
				   position: 'bottom',
	   
			   },
			   responsive: true
		   }
		};
		var ctx = document.getElementById("myPieMovie");
		var myLinePie = new Chart(ctx, config);
	});

}

function createGraph() {
	Meteor.call("CallPopular", function (error, results) {
		var results = results;
		var label = [];
		var data = [];
		results.forEach((doc) => {
			label.push(doc._id);
			data.push(doc.total_films);
		});

		var config = {
			type: 'bar',
			data: {
				labels: label,
				datasets: [{
					label: "Films / ans",
					backgroundColor: "#FF6384",
					borderColor: "#FF6384",
					fill: false,
					data: data,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Total Films par ans'
				},
				scales: {
					xAxes: [{
						display: true,
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Total Films'
						},
					}]
				},
				onClick: click
			}
		};
		var ctx = document.getElementById("myChartMovie");
		var myLineChart = new Chart(ctx, config);
	});
};

function click(evt, elements) {
	var datasetIndex;
	var dataset;
	Meteor.clearInterval(myInterval);
	if (elements.length) {
		var index = elements[0]._index;
		var date = null;
		if (index < 10) {
			date = "190" + index;
		}
		else if (index < 100) {
			date = "19" + index;
		} else {
			date = "20" + index.toString().slice(1, 3);
		}
		var result = Movie.find({ "years": date }).fetch();
		var counter = 0;
		myInterval = Meteor.setInterval(function () {
			if (counter > result.lenght) {
				counter = 0
			}
			document.getElementById("image").src = "http://image.tmdb.org/t/p/w185" + result[counter].poster_path;
			document.getElementById("image").style.visibility = 'visible';
			counter++;
		}, 2000);
	}
};

