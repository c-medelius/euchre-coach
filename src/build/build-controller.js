import {buildModel} from './build-model.js';
import {buildView} from './build-view.js';

export var buildController = (function() {

    /* var to track if data has carried over from previous round */
    var input_given;
    var current_build;

    var cards_in_hand;

    function executeBuildStep(step, input_given){

        function recordUserInput(step){
            switch(step){
                case 2: 
                    function collectHand(){
                        return Array.from(cards_in_hand);
                    }
                    let cards = collectHand();
                    current_build.setSelectedCards(cards);
                    break;
                case 3: 
                    let names = buildView.collectNames();
                    current_build.setPlayerNames(names);
                    break;
                case 4: 
                    let dealer_player = buildView.collectDealer();
                    current_build.setDealer(dealer_player);
                    break;
                case 7: 
                    let maker_player = buildView.collectMaker();
                    current_build.setMaker(maker_player);
                    break;
            }
        }

        buildView.updateDisplay(step);
        buildView.displayNextButton(false);

        recordUserInput(step);

        if (step == 2 && input_given){
            buildView.displayNextButton(true);
        }

        else if (step == 3 && input_given){
            buildView.displayNextButton(true);
        }
   
        else if (step == 4){
            let dealer = current_build.getDealer();
            buildView.showDealerName(current_build.getName(dealer), dealer);
        }
    }

    /********** listener setups *****************/

    function setupListenerForNextButton(){
        let next_btn = buildView.getNextButton();
        next_btn.addEventListener('click', handleNextClick);
    }

    function setupListenersForCards(){

        let card_element_list = buildView.getCardElementList();

        for (let i = 0; i < 24; i++){
            let cardel = card_element_list[i];
            cardel.addEventListener('click', handleCardClick);
        }
    }

    function setupListenersForName(){
        let input_boxes = buildView.getElements('name');

        for (let i = 0; i < 4; i++){
            let input_box = input_boxes[i];
            input_box.addEventListener('input', handleNameInput);
        }
    }

    function setupListenersForDealer(){
        let dealer_inputs = buildView.getElements('dealer');

        for (let i = 0; i < 4; i++) {
            dealer_inputs[i].addEventListener('input', handleDealerCheck);
        }
    }

    function setupListenersForMaker(){
        let maker_inputs = buildView.getElements('maker');

        for (let i = 0; i < 4; i++) {
            maker_inputs[i].addEventListener('input', handleMakerCheck);
        }
    }

    function setupListenersForOrderedUp(){

        let [yes_btn, no_btn] = buildView.getElements('orderedup')

        yes_btn.addEventListener('click', handleOrderedUpClick);
        no_btn.addEventListener('click', handleOrderedUpClick);

    }

    function setupListenersForTrumpSuit(){

        let trump_input = buildView.getElements('trumpsuit');

        for (let suit = 0; suit < 4; suit++){
            let btn = trump_input[suit];
            btn.addEventListener('click', handleTrumpSuitClick);
        }
    }

    /********** event handlers *****************/

    function handleNextClick(event){
        current_build.incrementStep();
        executeBuildStep(current_build.getStep(), input_given);
    }

    function handleCardClick(event){

        var cardelement = event.currentTarget;
        var cardcode = buildView.getCardCode(cardelement); 

        function isCardInHand(cardcode){
            return cards_in_hand.has(cardcode);
        }

        let inhand = isCardInHand(cardcode);

        if (current_build.getStep() == 1){ // if user is selecting the cards in their hand

            function isHandFull(){
                return (current_build.getNumCardsSelected() == 5);
            }

            let hand_full = isHandFull();

            if (inhand){
                buildView.removeCardFromHand(cardelement, cardcode);
                current_build.decrementNumCardsSelected();
                buildView.displayNextButton(false);
    
                function removeFromHandTracker(cardcode){
                    cards_in_hand.delete(cardcode);
                }

                removeFromHandTracker(cardcode);
            }
            else if (hand_full){
                buildView.showBuildAlert("Can't add card -- hand at capacity. One in one out babyyyy.");
            }
            else{
                current_build.incrementNumCardsSelected();
                buildView.addCardToHand(cardelement, cardcode);

                function addToHandTracker(cardcode){
                    cards_in_hand.add(cardcode);
                }

                addToHandTracker(cardcode);

                if (isHandFull()){
                    buildView.displayNextButton(true);
                }
            }
        }
        
        else if (current_build.getStep() == 5){ // if user is selecting the upcard

            let ordered = current_build.getOrderedUp();

            if (ordered){
                if (current_build.getDealer() != 0){ // if dealer is not the user

                    if (inhand){
                        buildView.showBuildAlert("Invalid -- this card is in your hand and you aren't the dealer.");
                        return;
                    }
                    else{
                        current_build.setUpcard(cardcode);
                        current_build.setTrumpSuit(getSuit(cardcode));
                        buildView.showUpcard(cardelement, cardcode, ordered);
                        buildView.displayNextButton(true);
                        return;
                    }
                }
                else{ // if dealer is the user
                    if (!inhand){
                        buildView.showBuildAlert("Invalid -- you're the dealer and the upcard was ordered up, so it must be in your hand.");
                        return;
                    }
                    else{
                        current_build.setUpcard(cardcode);
                        current_build.setTrumpSuit(getSuit(cardcode));
                        buildView.showUpcard(cardelement, cardcode, ordered, inhand)
                        buildView.displayNextButton(true);
                        return;
                    }
                }
            }
            else{
                if (inhand){
                    buildView.showBuildAlert("Invalid -- this card is in your hand.");
                    return;
                }
                else{
                    buildView.showUpcard(cardelement, cardcode, ordered);
                    current_build.setUpcard(cardcode);
                    buildView.hideInvalidTrumpSuit(getSuit(cardcode));
                    buildView.displayNextButton(true);
                    return;
                }
            }
        }
    }

    function handleNameInput(event){

        var input_box = event.currentTarget;
        input_box.removeEventListener('input', handleNameInput);
        current_build.incrementNumNamesGiven();

        function isNameInputComplete(){
            return (current_build.getNumNamesGiven() == 4);
        }

        if (isNameInputComplete()){
            buildView.displayNextButton(true);
        }
    }

    function handleDealerCheck(){

        buildView.displayNextButton(true);

        let dealer_inputs = buildView.getElements('dealer');

        for (let i = 0; i < 4; i++) {
            dealer_inputs[i].removeEventListener('input', handleDealerCheck);
        }
    }

    function handleOrderedUpClick(event){
    
        let btn = event.currentTarget;

        if (btn.innerHTML == "Yes") current_build.setOrderedUp(true);
        else current_build.setOrderedUp(false);

        buildView.displayNextButton(true);
    }

    function handleMakerCheck(){
        let orderedup = current_build.getOrderedUp();

        if (orderedup){
            let maker_player = buildView.collectMaker();
            current_build.setMaker(maker_player);
            buildView.displayStartButton(true);
        }
        else buildView.displayNextButton(true);

        let maker_inputs = buildView.getElements('maker');
        for (let i = 0; i < 4; i++) {
            maker_inputs[i].removeEventListener('input', handleMakerCheck);
        }
    }
    
    function handleTrumpSuitClick(event){

        buildView.displayStartButton(true);
        
        let suit_btn = event.currentTarget;
        let suit = buildView.getSuitFromButton(suit_btn);

        current_build.setTrumpSuit(suit);
    }

    /********** helpers *****************/

    function getSuit(cardcode){

        switch(cardcode[0]){
            case 'S':
                return 0;
            case 'H':
                return 1;
            case 'C':
                return 2;
            case 'D':
                return 3;
        }
    }
    
    /********** functions for game.js *****************/

    function setupNewBuild(prev_player_names, new_dealer){

        current_build = new buildModel.Build();
        buildView.createBuildDisplay();
        cards_in_hand = new Set();

        if (prev_player_names != null) input_given = true;
        else input_given = false;

        if (input_given){
            buildView.setInitialNames(prev_player_names);
            buildView.setInitialDealer(new_dealer);
        }

        setupListenersForCards();
        setupListenersForName();
        setupListenersForDealer();
        setupListenersForMaker();
        setupListenersForOrderedUp();
        setupListenersForTrumpSuit();
        setupListenerForNextButton();
        buildView.updateDisplay(current_build.getStep());
    }

    function getFinalInputValues(){
        return current_build.getAllValues();
    }

    function getButton(type){

        switch(type){
            case 'start round':
                return buildView.getStartButton()
            case 'new round':
                return buildView.getNewRoundButton();
        }
    }

    var module = {
        "setupNewBuild": setupNewBuild,
        "getFinalInputValues": getFinalInputValues,
        "getButton": getButton,
	}

	return module;

})();