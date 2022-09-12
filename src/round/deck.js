import {decksdata} from '../setup/decksdata.js'

/* REFACTOR NOTE: 
* current purpose:
* to act as the instance for a certain trumpsuit
* to act as the communication between deckdata and round
* to be created at the start of each round without having to create all the data again (which is done in decksdata, just once)
* 
*/

export var decks = (function() {

	function Deck(trumpsuit){

        this.trumpsuit = trumpsuit;
        this.card_obj_map = decksdata.getCardObjMap(this.trumpsuit);
        this.card_list = decksdata.getCardList(this.trumpsuit);

        this.getRoundSuit = function(cardcode){
            /***
             * param: cardcode (like "S-J")
             * returns: round suit (0,1,2,3) of that cardcode, given the current trumpsuit
            */
           let cardobj = this.card_obj_map.get(cardcode);
           return cardobj.roundsuit;
        }

        this.getValue = function(cardcode){
            /***
             * param: cardcode (like "S-J")
             * returns: value (9 through 115) of that cardcode, given the current trumpsuit
            */
            let cardobj = this.card_obj_map.get(cardcode);
            return cardobj.value;
        }

        this.getCardList = function(){
            return this.card_list;
        }

    }	
	
	var module = {
		"Deck": Deck
	}
	return module
	
})();