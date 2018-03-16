import { Meteor } from 'meteor/meteor';

const POLL_INTERVALL = 5000;
const CARDS_URL = "https://hsreplay.net/live/distributions/played_cards/";

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.publish('Cards', function() {
	const publishedKeys = {};

	const poll = () => {
		try {
			var getResult = HTTP.call('GET', CARDS_URL);
			cards = JSON.parse(getResult.content);
		} catch (e) {
			console.log(e);
		}
		
		cards["BGT_ARENA"].forEach((doc) => {
			if(publishedKeys[doc.ts]) {
				// console.log("CHANGED: " + doc.ts);
				// console.log(doc.data);
				// this.changed('cards', doc.ts, doc.data);
			} else {
				// console.log("ADDED: " + doc.ts);
				// console.log(doc.data);
				publishedKeys[doc.ts] = true;
				this.added('cards', doc.ts, doc.data);
			}
		});

	};
	
	poll();
	
	this.ready();
	
	const interval = Meteor.setInterval(poll, POLL_INTERVALL);
	
	this.onStop(function() {
		Meteor.clearInterval(interval);
	});
});


Meteor.methods({
	getImageCard: function(idCards) {
		var cardImageList = [];
		idCards[0].forEach(element => {
			// console.log(element);
			CARD_URL = "https://hsreplay.net/cards/" + element;
			// console.log(CARD_URL);
			try {
				var getResult = HTTP.call('GET', CARD_URL);
				card = getResult.content;
				card = card.split('<meta property="og:image" content="')[1];
				card = card.split('"/><meta property="og:image:width" content="256"/>')[0];
				// console.log(card);
				cardImageList.push(card);
			} catch (e) {
				console.log(e);
			}
		});
		// console.log(cardImageList);
		return cardImageList;
	}
});