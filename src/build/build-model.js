/********** build obj *****************/

export var buildModel = (function() {

    function Build(prev_player_names=null, new_dealer=null){

        /* vars to hold the data we collect while building the round (these are only accessed/modified via getters and setters) */
        var selected_cards = [];
        var player_names = [];
        var dealer;
        var orderedup;
        var upcard;
        var trumpsuit;
        var maker;
    
        /* vars for tracking status of user input (these are only accessed/modified via getters and setters) */
        var step = 1;
        var num_cards_selected = 0;
        var num_names_given = 0;
    
        /********** getters and setters for executing the steps? *****************/
    
        this.incrementStep = function(){
            step++;
        }
    
        this.incrementNumCardsSelected = function(){
            num_cards_selected++;
        }

        this.decrementNumCardsSelected = function(){
            num_cards_selected--;
        }
    
        this.incrementNumNamesGiven = function(){
            num_names_given++;
        }
        
        this.getStep = function(){
            return step;
        }
    
        this.getNumCardsSelected = function(){
            return num_cards_selected;
        }
    
        this.getNumNamesGiven = function(){
            return num_names_given;
        }
    
        /********** getters and setters for input data I think? *****************/
    
        this.setSelectedCards = function(cards){
            for (let i = 0; i < 5; i++){
                selected_cards[i] = cards[i];
            }
        }
    
        this.setPlayerNames = function(names){
            for (let i = 0; i < 4; i++){
                player_names[i] = names[i];
            }
        }
    
        this.setDealer = function(player){
            dealer = player;
        }
    
        this.setOrderedUp = function(ordered){
            orderedup = ordered;
        }
    
        this.setUpcard = function(cardcode){
            upcard = cardcode;
        }
    
        this.setMaker = function(player){
            maker = player;
        }
    
        this.setTrumpSuit = function(suit){
            trumpsuit = suit;
        }
    
        this.getSelectedCards = function(){
            return selected_cards;
        }
    
        this.getPlayerNames = function(){
            return player_names;
        }
    
        this.getDealer = function(){
            return dealer;
        }
    
        this.getOrderedUp = function(){
            return orderedup;
        }
    
        this.getUpcard = function(){
            return upcard;
        }
    
        this.getMaker = function(){
            return maker;
        }
    
        this.getTrumpSuit = function(){
            return trumpsuit;
        }
    
        /********** getters and setters for misc data that I should revisit? *****************/

        this.getName = function(player){
            let names = this.getPlayerNames();
            return names[player];
        }
    
        /********** function to return final input values *****************/
    
        this.getAllValues = function(){
            return [
                this.getTrumpSuit(),
                this.getOrderedUp(),
                this.getUpcard(),
                this.getDealer(),
                this.getSelectedCards(),
                this.getPlayerNames(),
                this.getMaker()
            ];
        }
        
    } // end of build obj

    var module = {
        "Build": Build
    }

return module;

})();