import {ALL_CARD_CODES, ALL_CARD_VALUES, ALL_CARD_RANKS} from './constants.js';

/* REFACTOR NOTE: 
* current purpose:
* to create all the deckdata objs at the start of the game without having to create them at the start of each round
*/

export var decksdata = (function(){

    function DeckData(trumpsuit){

        /* REFACTOR NOTE:
        get rid of all the "this" keywords - don't think we need them */ 

        this.trumpsuit = trumpsuit;

        this.nextsuit = trumpsuit > 1 ? trumpsuit - 2 : trumpsuit + 2;
        this.firstgreensuit = trumpsuit == 3 ? 0 : trumpsuit + 1;
        this.secondgreensuit = trumpsuit == 0 ? 3 : trumpsuit - 1;

        this.card_codes = ALL_CARD_CODES[trumpsuit];

        this.all_card_lists = [[],[],[],[]];

        /* constructor for card obj 
        (value represents its value for the round, which depends on if it's trump suit or not; rank just represents its number, like 10 or Jack [i.e., 11])
        we're not using rank for anything currently, but keeping it bc it might be useful for hints in the future, to easily identify aces or something*/

        function Card(cardcode, value, rank, roundsuit){
            this.cardcode = cardcode;
            this.value = value;
            this.rank = rank;
            this.roundsuit = roundsuit;
	    }

        this.createFullDeck = function(){
            
            this.card_obj_map = new Map();

            for (let i = 0; i < 24; i++){

                let cardcode = this.card_codes[i];
                let value = ALL_CARD_VALUES[i];
                let rank = ALL_CARD_RANKS[i];
                let roundsuit;

                if (i < 7) roundsuit = this.trumpsuit;
                else if (i < 13) roundsuit = this.firstgreensuit;
                else if (i < 18) roundsuit = this.nextsuit;
                else roundsuit = this.secondgreensuit;

                var card = new Card(cardcode, value, rank, roundsuit);
                this.card_obj_map.set(cardcode, card);
                this.all_card_lists[roundsuit].push(cardcode);
            }
        }

        this.createFullDeck();
    }

    /* deck objs in order: spades, hearts, clubs, diams */
    const all_deck_data_objs = [new DeckData(0), new DeckData(1), new DeckData(2), new DeckData(3)];

    function getCardObjMap(trumpsuit){
        /***
         * param: trumpsuit (to know which deck obj to use)
         * returns: map of card objs corresponding to that trump suit
         * --- (key = card code and val = card obj)
        */

        let deck_data_obj = all_deck_data_objs[trumpsuit];
        return deck_data_obj.card_obj_map;
    }

    function getCardList(trumpsuit){
        /***
         * param: trumpsuit (to know which deck obj to use)
         * returns: array of lists of cardcodes
         * where list at array[suit] is the list of cards in that suit based on current trumpsuit
        */

        let deck_data_obj = all_deck_data_objs[trumpsuit];
        return deck_data_obj.all_card_lists;
    }
	
	var module = {
		"getCardObjMap": getCardObjMap,
        "getCardList": getCardList
	}

	return module

})();