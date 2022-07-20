const positions = [
	"celtic-cross-0",
	"celtic-cross-1",
	"celtic-cross-2",
	"celtic-cross-3",
	"celtic-cross-4",
	"celtic-cross-5",
];


const suits = ["Wands", "Cups", "Swords", "Pents"];
let deck = [];
for (let i = 0; i<22; i++) {
	deck.push(`RWS_Tarot_${String(i).padStart(2, "0")}.jpg`);
}

suits.forEach(function(suit) {
	for (let i = 1; i<15; i++) {
		deck.push(`${suit}${String(i).padStart(2, "0")}.jpg`);
	}
});

function pickCards(count) {
	let deckCopy = [...deck];
	let cards = [];
	for (let i = 0; i < count; i++) { 
		const cardIndex = Math.floor(Math.random() * deckCopy.length);
		cards.push(deck[cardIndex])
		deckCopy.splice(cardIndex, 1)
	}

	return cards;
}

function populatePositions(count) {
	const cardImages = pickCards(count);
	for (let i = 0; i < count; i++) { 
		
		let cardImage = cardImages[i];
		let position = document.getElementById(positions[i]);
		if (!!position) {
			position.innerHTML = `<div class="card"><img src="rw/${cardImage}"></div>`;
		}
	};
	
}

(function(window, document, undefined){
	window.onload = init;
	function init(){
		populatePositions(6);
	}

})(window, document, undefined);

