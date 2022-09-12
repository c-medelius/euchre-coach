import {roundModel} from './round-model.js';
import {roundView} from './round-view.js';

const next_players = [1,2,3,0];
const prev_players = [3,0,1,2];

var user = 0;
var player_names;
var currentplayer;
var current_round;
var numtricks = 0;


export var roundController = (function() {

    function setupNewRound(trumpsuit, orderedup, upcard, dealer, user, cardsinhand, names, maker){

        player_names = names;

        current_round = new roundModel.Round(trumpsuit, orderedup, upcard, dealer, user, cardsinhand, maker);
        roundView.setupRoundDisplay(trumpsuit, orderedup, upcard, dealer, cardsinhand, player_names, maker);
    
        updateVoid(user); // at the start, update user's void based on their hand
        let leader = next_players[dealer];
        startTrick(leader);

        function setupCardElementListeners(){

            let card_element_list = roundView.getCardElementList();
        
            for (let i = 0; i < 24; i++){
                let cardel = card_element_list[i];
                cardel.addEventListener('click', handleClickDuringRound);
            }
        }
        setupCardElementListeners();
        
    }

    function handleClickDuringRound(event){

        var cardelement = event.currentTarget;
        var cardcode = roundView.getCardCode(cardelement);
        let player = getCurrentPlayer();
    
        function attemptPlay(cardcode, player){
    
            // check if play is valid
            let validplay = current_round.isValidPlay(cardcode, player);
        
            if (validplay == 0){
                return true;
            }
            else{
                roundView.showAlert(validplay, player_names[player]);
                return false;
            }
        }
    
        var is_valid_play = attemptPlay(cardcode, player);
    
        if (is_valid_play){
            cardelement.removeEventListener('click', handleClickDuringRound);
    
            function playCard(cardcode, player){

                roundView.unhighlightPlayer(player);
    
                roundView.playCard(cardcode, player);
                current_round.playCard(cardcode, player);
            
                if (current_round.isTrickFinished()){

                    roundView.disableDecks(true);
                    
                    function finishTrick(){
                                
                        let tricktaker = current_round.getCurrentTrickTaker();
                        roundView.updatePrompt(1, player_names[tricktaker]);
                        roundView.incrementScore(tricktaker);
    
                        if (current_round.isRoundFinished()){
    
                            function finishRound(){
                                roundView.updatePrompt(3);
                                roundView.removeAllCardsFromTable();
                            }
    
                            setTimeout(finishRound, "2000");
                        }
                        else{
                            setTimeout(startTrick.bind(null, tricktaker), "2000");
                        }
                    }
            
                    finishTrick();
                }
                else{
                    function moveToNextPlay(player){ 
                        let next_player = next_players[player];
                        setCurrentPlayer(next_player);
                        promptPlayer(next_player);
                    
                    }
                    moveToNextPlay(player);
                }  
            }
    
            playCard(cardcode, player);

            if (!current_round.isRoundFinished()){
                updateVoid(player);
            }  
        }
    }

    function updateVoid(player){
        let void_results = current_round.getVoidResults(player);
        if (void_results.length != 0){
            roundView.updateVoidString(player, void_results);
        }
    }

    function promptPlayer(player){

        let prev_player = prev_players[player];
    
        roundView.unhighlightPlayer(prev_player);
        roundView.highlightPlayer(player);
    
        if (player == user){
            roundView.updatePrompt(2);
    
            function prepForUserTurn(){
    
                let [playable, not_playable] = current_round.getPlayableCardsInHand();
                let hints = [];
                let is_lead_turn = current_round.isLeadTurn();

                if (is_lead_turn){
                    hints = current_round.createIndividualHints(playable, player_names);
                    roundView.updateHandBeforeLeadTurn(playable, hints);
                }
                else{
                    hints = current_round.createGeneralHints(player_names);
                    roundView.updateHandBeforeFollowTurn(playable, not_playable, hints);
                }            
            }
    
            prepForUserTurn();
        }
        else{
            roundView.updatePrompt(0, player_names[player]);
        }
    }

    function getCurrentPlayer(){
        return currentplayer;
    }
    
    function setCurrentPlayer(newplayer){
        currentplayer = newplayer;
    }
    
    function startTrick(leader){
    
        current_round.setupNewTrick();
        roundView.removeAllCardsFromTable();
        roundView.disableDecks(false);
        setCurrentPlayer(leader);
        promptPlayer(leader);
    
    }

    function getNextRoundButton(){
        return roundView.getButton('next round');
    }

    var module = {
        "setupNewRound": setupNewRound,
        "getNextRoundButton": getNextRoundButton,
	}

	return module;

})();