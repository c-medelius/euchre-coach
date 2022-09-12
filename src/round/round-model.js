import {decks} from './deck.js';
import {cardtrackers} from './cardtracker.js';
import { RANK_CODE_MAP, SUITS } from '../setup/constants.js';

export var roundModel = (function() {

    /*********** round obj **********/

	function Round(trumpsuit, orderedup, upcard, dealer, user, cardsinhand, maker){

        this.trumpsuit = trumpsuit;
        this.orderedup = orderedup;
        this.maker = maker;
        this.upcard = upcard;
        this.dealer = dealer;
        this.user = user;
        this.cardsinhand = cardsinhand;

        /* REFACTOR NOTE:
        * look into nested functions
        * for now i'm just using them to make sure that they can't be called in other places...
        * but for that matter why even have it as a function except for code cleanliness?
        */

        this.setupRound = function(){

            /* create deck obj for this trump suit */
            this.deck = new decks.Deck(this.trumpsuit);

            this.setupCardTracker = function(){
                let all_card_lists = this.deck.getCardList();
                this.cardtracker = new cardtrackers.CardTracker(all_card_lists);
            }

            this.setupHandSuitCount = function(){
        
                this.suit_in_hand_count = [0,0,0,0];
    
                for (let i = 0; i < 5; i++){
                    let cardcode = this.cardsinhand[i];
                    let suit = this.deck.getRoundSuit(cardcode);
                    this.suit_in_hand_count[suit]++;
                }
                for (let i = 0; i < 4; i++){
                    let suit = i;
                    if (this.suit_in_hand_count[suit] == 0){
                        this.cardtracker.setPlayerAsVoid(this.user, suit);
                    }
                }
            }

            this.dealWithUpcard = function(){
                if (!this.orderedup){
                    this.cardtracker.setCardInactive(this.upcard);
                }
            }

            this.setupHandTracker = function(){
                this.hand_tracker = new Set();
                for (let i = 0; i < 5; i++){
                    this.hand_tracker.add(this.cardsinhand[i]);
                }
            }

            this.num_tricks = 0;

            this.setupCardTracker();
            this.setupHandSuitCount();
            this.dealWithUpcard();
            this.setupHandTracker();
        }  

        this.setupRound();
        
        this.setupNewTrick = function(){
            this.incrementNumTricks();
            this.current_trick = new Trick();
            this.current_trick.resetPlayableCards(this.getCardsInHand());
        }

        /*********** functions for playing a card **********/

        this.playCard = function(cardcode, player){

            this.updateUserIfVoid = function(cardcode){
                let suit = this.deck.getRoundSuit(cardcode);

                this.removeSuitFromHand(suit);

                if (this.getSuitInHandCount(suit) == 0){
                    this.cardtracker.setPlayerAsVoid(this.user, suit);
                }
            }

            this.updatePlayerIfVoid = function(cardcode, player){
                let suit = this.deck.getRoundSuit(cardcode);
                let leadsuit = this.current_trick.getLeadSuit();
                if (suit != leadsuit){
                    this.cardtracker.setPlayerAsVoid(player, leadsuit);
                }
            }


            if (this.current_trick.getNumTurns() == 0){ // if this is the leader's play
                this.recordLeadCard = function(cardcode, player){
                    /**
                     * Given a lead play (cardcode and player (who is leader)),
                     * updates the current class variables
                     * and updates card's status in card tracker
                     */
                    let suit = this.deck.getRoundSuit(cardcode);
                    this.current_trick.setLeadSuit(suit);
                    this.current_trick.setMaxValues(cardcode, player);
                    this.cardtracker.setCardInactive(cardcode);
        
                    if (player == this.user){
                        this.removeCardFromHand(cardcode);
                        this.updateUserIfVoid(cardcode);
                        this.current_trick.resetPlayableCards(this.getCardsInHand());
                    }
                    else{
                        this.handlePlayableCardsInHand = function(){

                            let leadsuit = this.current_trick.getLeadSuit();
                
                            if (!this.cardtracker.isPlayerVoid(this.user, leadsuit)){
                
                                let current_hand = this.getCardsInHand();
                
                                for (const cardcode of current_hand){
                                    let suit = this.deck.getRoundSuit(cardcode);
                                    if (suit != leadsuit){
                                        this.current_trick.setCardAsNotPlayable(cardcode);
                                    }
                                }
                            }
                        }

                        this.handlePlayableCardsInHand();
                    }
                }
                this.recordLeadCard(cardcode, player);
            }
            else{ // if this is the follower's play
                this.recordFollowerCard = function(cardcode, player){
                    /**
                     * Given a play (cardcode and player),
                     * updates the card tracker if player is void
                     * updates card's status in card tracker
                     * updates current max variables if needed
                     */
        
                    if (player == this.user){
                        this.removeCardFromHand(cardcode);
                        this.updateUserIfVoid(cardcode);
                        this.current_trick.resetPlayableCards(this.getCardsInHand());
                    }
                    else{
                        this.updatePlayerIfVoid(cardcode, player);
                    }
                    this.cardtracker.setCardInactive(cardcode);
        
                    this.updateMaxIfChanged = function(cardcode, player){
                        let leadsuit = this.current_trick.getLeadSuit();
                        let maxcard = this.current_trick.getCurrentMaxCard();
                        if (this.checkIfNewMax(maxcard, cardcode, leadsuit)){
                            this.current_trick.setMaxValues(cardcode, player);
                        }
                    }
                    
                    this.updateMaxIfChanged(cardcode, player);
                }
                this.recordFollowerCard(cardcode, player);
            }

            this.current_trick.addPlayedCard(cardcode, player);
            this.current_trick.incrementNumTurns();
        }

        this.isValidPlay = function(cardcode, player){

            let inhand = this.isCardInHand(cardcode);
    
            if (player != this.user && inhand) return 1;

            if (player == user){
                if (!inhand) return 2;
                if(this.current_trick.isCardPlayable(cardcode)){
                    return 0;
                }
                else return 3;
            }

            let suit = this.deck.getRoundSuit(cardcode);
            if (this.cardtracker.isPlayerVoid(player, suit)) return 4;
            if (!this.cardtracker.isCardActive(cardcode)) return 5;
            if (cardcode == this.upcard && player != dealer) return 6;

            // if dealer's turn (and they aren't the user) and they still have upcard
            if (player == dealer && this.cardtracker.isCardActive(this.upcard)){ 
                let upcardsuit = this.deck.getRoundSuit(this.upcard);
                let leadsuit = this.current_trick.getLeadSuit();
    
                // and the upcard is in the leadsuit, so they for sure can follow suit, 
                // but the attempted card doesn't follow suit
                if (leadsuit == upcardsuit && suit != leadsuit){
                    return 7;
                }

                // and it's their last turn, so they need to play the upcard
                if (cardcode != this.upcard && this.isRoundFinished()){
                    return 8;
                }
            }
        
            return 0;
        }

        this.getPlayableCardsInHand = function(){

            let playable = Array.from(this.current_trick.getPlayableCards());
            let not_playable = Array.from(this.current_trick.getNotPlayableCards());

            return [playable, not_playable];

        }

        this.getVoidResults = function(player){
            return this.cardtracker.getVoidSuits(player);
        }

        this.getCurrentTrickTaker = function(){
            return this.current_trick.getCurrentMaxPlayer();
        }

        /*********** num_tricks trackers **********/

        this.isRoundFinished = function(){
            return (this.getNumTricks() == 5);
        }

        this.isTrickFinished = function(){
            return (this.current_trick.getNumTurns() == 4);
        }
        
        this.isLastTurn = function(){
            return (this.current_trick.getNumTurns() == 3);
        }

        this.isLeadTurn = function(){
            return (this.current_trick.getNumTurns() == 0);
        }

        this.incrementNumTricks = function(){
            this.num_tricks++;
        }

        this.getNumTricks = function(){
            return this.num_tricks;
        }

        this.getSuitInHandCount = function(suit){
            return this.suit_in_hand_count[suit];
        }

        this.removeSuitFromHand = function(suit){
            this.suit_in_hand_count[suit]--;
        }

        this.getCardsInHand = function(){
            return this.hand_tracker;
        }

        this.removeCardFromHand = function(cardcode){
            this.hand_tracker.delete(cardcode);
        }

        /*********** helper functions **********/

        this.checkIfNewMax = function(current_max, potential_max, leadsuit){
            /***
             * Params: 2 cardcodes, for the cards to compare, and a lead suit
             * Returns true if first card is a greater value than the second, else false
             */ 

            let firstval = this.deck.getValue(current_max);
            let secondsuit = this.deck.getRoundSuit(potential_max);
            let secondval = this.deck.getValue(potential_max);

            if ((secondsuit != leadsuit) && (secondsuit != this.trumpsuit)){
                return false;
            }
            else{
                return (secondval > firstval);
            }
        }

        this.playersToStr = function(players, player_names){
            /***
             * params: list of players and their names
             * return: player names formatted in a comma separated string
             */

            let num_players = players.length;
            let str = ``;

            if (num_players == 0) return str;
            if (num_players == 1) return `${player_names[players[0]]}`;
            else if (num_players == 2){
                return `${player_names[players[0]]} and ${player_names[players[1]]}`;
            }
            else{
                for (let i = 0; i < num_players; i++){
                    let player = players[i];
                    if (i == num_players - 1){
                        str += `and ${player_names[player]}`;
                    }
                    else{
                        str += `${player_names[player]}, `;
                    }
                }
                return str;
            }
        }

        this.isCardInHand = function(cardcode){

            return this.hand_tracker.has(cardcode);
        }

        /*********** functions for getting hints **********/

        this.doesPlayerHaveCard = function(cardcode, player){
            return (this.upcard == cardcode && this.dealer == player);
        }

        this.findWhoCanTrump = function(suit, trumpsuit, players){
            /***
             * params: suit and trumpsuit, and list of players to check voids for
             * return: 
             * - could_trump = list of players who are void in suit but not void in trumpsuit
             * - cannot_trump = list of players who are void in both suit and trumpsuit
             * 
             * doesn't do anything w the players who are not void in the given suit
             */

            let could_trump = [];
            let cannot_trump = [];
 
            for (let i = 0; i < players.length; i++){
                let player = players[i];
                // if player can't follow suit
                if (this.isPlayerVoid(player, suit)){
                    if (this.isPlayerVoid(player, trumpsuit)){
                        cannot_trump.push(player);
                    }
                    else{
                        could_trump.push(player);
                    }
                }
            }
            return [could_trump, cannot_trump];

        }

        this.getThreatCount = function(suit){
            /***
             * param: suit to find count for
             * return: # of active cards in that suit that aren't in user's or partner's hand
             */

            let active = this.cardtracker.getActiveCardsInSuit(suit);
            let count = 0;

            for (let i = 0; i < active.length; i++){
                let cardcode = active[i];
                if (!this.isCardInHand(cardcode) && !this.doesPlayerHaveCard(cardcode, 2)){
                    count++;
                }
            }
            return count;
        }

        this.couldTrumpHint = function(players, player_names, trumpsuit){
            let hint = ``;
            let player_str = this.playersToStr(players, player_names);
            hint += player_str;
            hint += ` can't follow suit, but could trump if they have any ${SUITS[trumpsuit]}.`;
            return hint;
        }

        this.cannnotTrumpHint = function(players, player_names){
            let hint = ``;
            let player_str = this.playersToStr(players, player_names);
            hint += player_str;
            hint += ` can't follow suit and can't trump.`;
            return hint;
        }

        this.createGeneralHints = function(player_names){
            /* returns general hints based on current state of the round */

            let hints = ``;

            // if user is the last to play for this trick
            if (this.isLastTurn()){ 
                return "it's the last play, you know what to do.";
            }

            // if this is the last trick
            if (this.isRoundFinished()){
                return "you have no choice.";
            }
            
            let leadsuit = this.current_trick.getLeadSuit();
            let remaining_players = this.current_trick.getRemainingPlayers();
            
            let [could_trump, cannot_trump] = this.findWhoCanTrump(leadsuit, this.trumpsuit, remaining_players);

            if (could_trump.length != 0){
                hints += this.couldTrumpHint(could_trump, player_names, this.trumpsuit);
            }
            if (cannot_trump.length != 0){
                hints += this.cannotTrumpHint(cannot_trump, player_names);
            }

            if (hints == ``) hints = "no hints available";
            return hints;
        }

        this.createIndividualHints = function(playable, player_names){

            let hints = [];

            // if this is the last trick
            if (this.isRoundFinished()){
                return "you have no choice.";
            }

            this.getHintsForCard = function(cardcode){

                let suit = this.deck.getRoundSuit(cardcode);
                let rank = cardcode.slice(2);
                let hint = `${RANK_CODE_MAP.get(rank)} of ${SUITS[suit]}:\n`;

                let remaining_players = this.current_trick.getRemainingPlayers();
                let [could_trump, cannot_trump] = this.findWhoCanTrump(suit, this.trumpsuit, remaining_players);

                if (could_trump.length != 0){
                    hint += this.couldTrumpHint(could_trump, player_names, this.trumpsuit);
                }
                if (cannot_trump.length != 0){
                    hint += this.cannotTrumpHint(cannot_trump, player_names);
                }

                let count = this.getThreatCount(suit);
                if (count == 1){
                    hint += `\n- there is ${count} ${SUITS[suit].slice(0,-1)} left that isn't in you or your partner's hands`;
                }
                else{
                    hint += `\n- there are ${count} ${SUITS[suit]} left that aren't in you or your partner's hands`;
                }
                
                if (suit == this.trumpsuit){
                    let highest = this.cardtracker.getHighestActiveCard(this.trumpsuit);

                    if (cardcode == highest){
                        hint += `\n- you will win this trick (it's the highest card left)`;
                    }
                    else if (highest == this.upcard){
                        if (this.dealer == 2){ // if dealer is partner
                            hint += `\n- your partner will win this trick (if they play upcard)`;
                        }
                        else{ // if dealer is on the other team
                            hint += `\n- opponent will win this trick (if they play upcard)`;
                        }
                    }
                }
                return hint;
            }

            for (let i = 0; i < playable.length; i++){
                hints[i] = this.getHintsForCard(playable[i]);
            }
            return hints;


        }

    } // end round obj

    /*********** trick obj **********/

    function Trick(){
    
        this.setupTrick = function(){

            /* setup vars for the tricks, which will be reset after each trick */
            this.cardsplayed = new Map();
            this.leadsuit;
            this.current_max_player;
            this.current_max_cardplayed;
            this.num_turns = 0;
            this.playable = new Set();
            this.not_playable = new Set();
            this.remaining_players = new Set('0', '1', '2', '3');
        }

        this.setupTrick();

        /*********** getters **********/

        this.getLeadSuit = function(){
            return this.leadsuit;
        }

        this.getCurrentMaxCard = function(){
            return this.current_max_cardplayed;
        }

        this.getCurrentMaxPlayer = function(){
            return this.current_max_player;
        }

        this.getPlayedCards = function(){
            return this.cardsplayed;
        }    
        
        this.getRemainingPlayers = function(){
            return this.remaining_players;
        }

        this.getNumTurns = function(){
            return this.num_turns;
        }

        this.getPlayableCards = function(){
            return this.playable;
        }

        this.getNotPlayableCards = function(){
            return this.not_playable;
        }

        /*********** setters **********/

        this.setLeadSuit = function(suit){
            this.leadsuit = suit;
        }

        this.setMaxValues = function(cardcode, player){
            this.current_max_cardplayed = cardcode;
            this.current_max_player = player;
        }

        this.removeRemainingPlayer = function(player){
            this.remaining_players.delete(player);
        }

        // currently not using cardsplayed for anything, might use for hints later
        this.addPlayedCard = function(cardcode, player){
            this.cardsplayed.set(cardcode, player);
        }

        this.incrementNumTurns = function(){
            this.num_turns++;
        }

        this.resetPlayableCards = function(cards){

            this.playable = new Set();
            for (const card of cards){
                this.playable.add(card);
            }
 
            this.not_playable = new Set();
        }

        this.setCardAsNotPlayable = function(cardcode){
            this.playable.delete(cardcode);
            this.not_playable.add(cardcode);
        }

        /*********** checkers **********/

        this.isCardPlayable = function(cardcode){
            let playable = this.getPlayableCards();
            return playable.has(cardcode);
        } 
        
        this.isPartnerWinning = function(){
            return (this.getCurrentMaxPlayer() == 2);
        }

    } // end trick obj

    var module = {
        "Round": Round
    }
return module

})();