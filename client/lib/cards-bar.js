import { Session } from 'meteor/session';

var Chart = require('chart.js');

Session.set('compteur', 0);

function getLastCards() {
    var cardsList = Cards.find({}, {sort: {_id: -1}, limit: 1}).fetch().pop();
    if (cardsList) {
        var cardsKeys = [];
        var cardsValues = [];
        Object.keys(cardsList).map(function(key) {
            if (key != "_id") {
                if (cardsValues[0]) {
                    checkPosition(cardsKeys, cardsValues, key, cardsList[key]);
                } else {
                    cardsKeys.push(key);
                    cardsValues.push(cardsList[key]);
                }
            }  
        });
        cardsKeys.length = 12;
        cardsValues.length = 12;
        var cardsReturn = [];
        cardsReturn.push(cardsKeys, cardsValues);
        return cardsReturn;
    } else {
        return [];
    }
}

function getThreeCards() {

    var cardOne = [];
    var cardSecond = [];
    var cardThird = [];

    var test = Cards.find().fetch();
    var cardsList = Cards.find({}, {sort: {_id: -1}, limit: 5}).fetch();

    if (cardsList.length > 0) {
        
        for (i=0; i<=4; i++) {
            cardOne.unshift(cardsList[i][43474]);
            cardSecond.unshift(cardsList[i][45930]);
            cardThird.unshift(cardsList[i][46082]);
        }
        
        var cardsReturn = [];
        cardsReturn.push(cardOne, cardSecond, cardThird);
        return cardsReturn;
    } else {
        return [];
    }
}

function getThreeCardsUpDown() {

    var cardOne = [];
    var cardSecond = [];
    var cardThird = [];

    var oneStatus;
    var secondStatus;
    var thirdStatus;

    var test = Cards.find().fetch();
    var cardsList = Cards.find({}, {sort: {_id: -1}, limit: 2}).fetch();

    if (cardsList.length > 0) {
        for (i=0; i<=1; i++) {
            cardOne.unshift(cardsList[i][43474]);
            cardSecond.unshift(cardsList[i][45930]);
            cardThird.unshift(cardsList[i][46082]);
        }
        if (cardOne[1] > cardOne[0]) {
            oneStatus = "+";
        } else if (cardOne[1] < cardOne[0]) {
            oneStatus = "-";
        } else if (cardOne[1] === cardOne[0]) {
            oneStatus = "=";
        } 
        if (cardSecond[1] > cardSecond[0]) {
            secondStatus = "+";
        } else if (cardSecond[1] < cardSecond[0]) {
            secondStatus = "-";
        } else if (cardSecond[1] === cardSecond[0]) {
            secondStatus = "=";
        }
        if (cardThird[1] > cardThird[0]) {
            thirdStatus = "+";
        } else if (cardThird[1] < cardThird[0]) {
            thirdStatus = "-";
        } else if (cardThird[1] === cardThird[0]) {
            thirdStatus = "=";
        }
        var statusReturn = [];
        statusReturn.push(oneStatus, secondStatus, thirdStatus);
        
        return statusReturn;
    } else {
        return [0, 0, 0];
    }
}

function insertAfter(array, index, item) {
    array.splice(index+1, 0, item);
}

function insertBefore(array, index, item) {
    array.splice(index, 0, item);
}

function checkPosition(arrayIndex, arrayValue, index, value) {
    arrayValue.every(function(element, i) {
        if (value > element) {
            insertBefore(arrayIndex, i, index);
            insertBefore(arrayValue, i, value);
            return false;
        } else {
            while (value < element) {
                return true;
            }
            insertAfter(arrayIndex, i, index);
            insertAfter(arrayValue, i, value);
            return false;
        }
    });
}

Template.cardsUpDown.helpers({
    variabilities: function() {
        var status = getThreeCardsUpDown();
        return status;
    }
});

Template.cardsImage.helpers({
    images: function() {
        var cardsImageList = getLastCards();
        if(cardsImageList) {
            cardsImageList = cardsImageList[0];
            Meteor.call('getImageCard', [cardsImageList], function(error, result) {
                var imageList = result;
                Session.set('imageList', imageList);
            });
            return Session.get('imageList');
        }
    }
});

Template.cardsBarGraph.rendered = function() {
    Deps.autorun(function () { 
        drawBarChart(); 
    });
}

Template.cardsLineGraph.rendered = function() {
    Deps.autorun(function () { 
        drawLineChart(); 
    });
}

function drawBarChart() { 
    var cards = getLastCards();
    if (cards) {
        var ctx = $("#myBarChart")[0];
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cards[0],
                datasets: [{
                    label: 'Carte la plus utilisé',
                    data: cards[1],
                    backgroundColor: [
                        'rgba(255, 99, 100, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                animation: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        myChart.update();
    }
}

function drawLineChart() {
    var cards = getThreeCards();

    var dataFirst = {
        label: "Stoneskin Basilisk",
        data: cards[0],
        lineTension: 0.3,
        borderColor: 'red',
        backgroundColor: 'transparent',
        pointBorderColor: 'red',
        pointBackgroundColor: 'lightgreen',
    };

    var dataSecond = {
        label: "Plated Beetle",
        data: cards[1],
        lineTension: 0.3,
        borderColor: 'blue',
        backgroundColor: 'transparent',
        pointBorderColor: 'blue',
        pointBackgroundColor: 'lightred',
    };

    var dataThird = {
        label: "Hungry Ettin",
        data: cards[2],
        lineTension: 0.3,
        borderColor: 'green',
        backgroundColor: 'transparent',
        pointBorderColor: 'greeb',
        pointBackgroundColor: 'lightblue',
    };
        
    var speedData = {
        labels: ["0s", "5s", "10s", "15s", "20s"],
        datasets: [dataFirst, dataSecond, dataThird]
    };
       
    var ctx = $("#myLineChart")[0];
    var myChart = new Chart(ctx, {
        type: 'line',
        data: speedData,
        options: {
            animation: {
                duration: 0,
            },
            hover: {
                animationDuration: 0,
            },
            responsiveAnimationDuration: 0,
        }
    });
}