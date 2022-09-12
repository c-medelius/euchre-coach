
/* REFACTOR NOTE: 
* current purpose:
* to act as the instance for a certain list of cards
* tracker for all cards' statuses and which players are void
* ^ based on that info, can return active cards in a given suit or the highest active card in that suit
* should not care about which suit is the trump suit
* 
* to be created at the start of each round without having to create all the data again
* (which is done in decksdata, just once, and is passed to cardtracker via all_card_lists)
* ^ it needs all_card_lists bc it has the cardcodes separated by suit, which we need, bc their suits change depending on trump suit
*/

export var cardtrackers = (function() {

    function CardTracker(all_card_lists){

        this.all_card_lists = all_card_lists;
        
        this.createCardStatusTracker = function(){
           /***
            * returns: map of status of cards
            * where key = cardcode and val = status (true if still active, else false)
            * initializes each status to true
            */

            let card_status_tracker = new Map();

            // loop through each suit list in "all_card_lists"
            for (let i = 0; i < 4; i++){ 
                let current_list = this.all_card_lists[i];

                // loop through each card in current suit list
                for (let j = 0; j < current_list.length; j++){
                    let cardcode = current_list[j];
                    card_status_tracker.set(cardcode, true);
                }
            }
            return card_status_tracker;
        }

        this.createVoidTracker = function(){
            /***
            * returns: void tracker (which is a copy of the constant one each time)
            * where tracker[1][0] = true would mean that for suit 1 (hearts), player 0 is void
            */
            return [
             [false,false,false,false],
             [false,false,false,false],
             [false,false,false,false],
             [false,false,false,false]
            ]
        }

        this.card_status_tracker = this.createCardStatusTracker();
        this.void_tracker = this.createVoidTracker();

        /****************** setters ******************/

        this.setPlayerAsVoid = function(player, suit){
            /***
             * param: player and a suit,
             * sets player's "void status" for that suit as true
             */

            let tracker = this.void_tracker[suit];
            tracker[player] = true;
        }

        this.setCardInactive = function(cardcode){
            /***
             * param: cardcode (like "S-J")
             * sets card's "active status" as false
             */
            this.card_status_tracker.set(cardcode, false);
        }

        /****************** checkers ******************/

        this.isPlayerVoid = function(player, suit){
            /***
             * param: player and suit,
             * returns: player's "void status" for that suit
             */

             let tracker = this.void_tracker[suit];
             return tracker[player];

             /* import to note: we can see if a player is void in two ways
            - calling getVoidPlayers for the suit and seeing if player is in there
            - directly calling this function */
        }

        this.isCardActive = function(cardcode){
            /***
             * param: cardcode (like "S-J")
             * returns: card's "active status"
             */
            return this.card_status_tracker.get(cardcode);
        }

        /****************** getters ******************/

        this.getVoidPlayers = function(suit){
            /***
             * param: suit to find void players for
             * returns: list of player codes (0-3), for the players void in that suit
             */
            let void_players = [];

            for (let player = 0; player < 4; player++){
                if (this.isPlayerVoid(player, suit)){
                    void_players.push(player);
                }
            }
            return void_players;
        }

        this.getVoidSuits = function(player){
           /***
             * param: player to find void suits for
             * returns: list of suit codes (0-3), for the suits that the player is void in
             */

           let void_suits = [];
            
            for (let suit = 0; suit < 4; suit++){
                if (this.isPlayerVoid(player, suit)){
                    void_suits.push(suit);
                }

            }
            return void_suits;
        }

        this.getHighestActiveCard = function(suit){
            /***
             * param: suit to find highest active card for
             */

            let active_list = this.getActiveCardsInSuit(suit);

            if (active_list.length == 0){
                return null;
            }
            else{
                return active_list[0];
            }
        }

        this.getActiveCardsInSuit = function(suit){
            /***
             * param: suit to find active cards for
             * returns: list of cardcodes, for cards that are still active
             */

            let card_list = this.all_card_lists[suit];
            let active_list = [];

            for (let i = 0; i < card_list.length; i++){

                let cardcode = card_list[i];

                if (this.isCardActive(cardcode)){
                    active_list.push(cardcode);
                }
            }
            return active_list;
        }
    }

    var module = {
        "CardTracker": CardTracker
    }
return module

})();