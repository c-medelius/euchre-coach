import {viewsetup} from '../setup/view-setup.js';
import {build_page_IDs, TRUMP_ICONS} from '../setup/constants.js';

export var buildView = (function() {

    var card_element_map = new Map();
    var reverse_card_element_map = new Map();
    var card_element_list = new Map();

    /* vars for other things that I should revisit ? */
    var cards_in_hand_slots = new Map();
    var current_hand_slots = [];

    var IDs = build_page_IDs;

    const cardcode_list = viewsetup.getCardcodeList();
    const reg_url_map = viewsetup.getRegURLs();

    function createBuildDisplay(){

        /* show build page, hide round page */
        let roundpage = document.getElementById(IDs.$round_page);
        roundpage.style.display = "none";

        let buildpage = document.getElementById(IDs.$build_page);
        buildpage.style.display = "block";

        /* get new card elements */
        var card_element_data = viewsetup.getNewCardElements();
        card_element_map = card_element_data[0];
        reverse_card_element_map = card_element_data[1];
        card_element_list = card_element_data[2];

        function placeDecks(){
            let deck_grid = document.getElementById(IDs.$build_deck_grid);
    
            let card_index = 0;

            for (let i = 0; i < 4; i++){
                let row = i+1;
                let col = 1;

                for (let j = 0; j < 6; j++){
                    let cardcode = cardcode_list[card_index];
                    let cardel = card_element_map.get(cardcode);
                    deck_grid.appendChild(cardel);
                    cardel.style.gridColumn = col;
                    cardel.style.gridRow = row;

                    col++;
                    card_index++;
                }
            }
        } 

        function setupHandSlots(){

            for (let i = 0; i < 5; i++){
                let slotname = IDs.$build_hand_slots[i];
                current_hand_slots[i] = IDs.$build_hand_slots[i];
                let slot = document.getElementById(slotname);
                while (slot.firstChild){
                    slot.removeChild(slot.firstChild);
                }
            }
        }

        function resetDisplay(){

            function clearInput(){
                let name_inputs = document.getElementsByName(IDs.$name_input_group);
                let dealer_inputs = document.getElementsByName(IDs.$dealer_input_group);
                let maker_inputs = document.getElementsByName(IDs.$maker_input_group);
                for (let i = 0; i < 4; i++){
                    name_inputs[i].value = "";
                    dealer_inputs[i].checked = false;
                    maker_inputs[i].checked = false;
                }
            }
        }

        placeDecks();
        setupHandSlots();
    } 

    function getCardCode(cardel){
        return reverse_card_element_map.get(cardel);
    }

    /********** functions for retrieving user input *****************/

    function collectNames(){
        let input_boxes = getElements('name');
        let names = [];
        for (let i = 0; i < 4; i++){
            let input_box = input_boxes[i];
            let player_name = input_box.value;

            names[i] = player_name;
        }
        return names;
    }

    function collectDealer(){
        let dealer_inputs = getElements('dealer');

        for (let i = 0; i < 4; i++) {
            if (dealer_inputs[i].checked == true){
                return i;
            }
        }
    }

    function collectMaker(){
        let maker_inputs = getElements('maker');

        for (let i = 0; i < 4; i++) {
            if (maker_inputs[i].checked == true){
                return i;
            }
        }
    }

    /********** functions for modifying display *****************/

    function showBuildAlert(message){

        let element = document.getElementById(IDs.$build_alert_overlay);
        let text_element = document.getElementById(IDs.$build_alert_text);

        text_element.innerHTML = message;
        element.style.display = "block";
    }

    function updateDisplay(step){

        function resetDisplay(){
            displayOrderedUpPrompt(false);
            displayMakerInputs(false);
            displayDealerInputs(false);
            displayUpcardSlot(false);
            displayTrumpPrompt(false);
            displayNextButton(false);
            displayStartButton(false);
            removeUpcard();
        }

        function updateBuildPrompt(step){
            let prompt = "";
    
            switch(step){
                case 1:
                    prompt = `step 1: select the cards in your hand (on the left)`;
                    break;
                case 2:
                    prompt = "step 2: enter player names below";
                    break;
                case 3:
                    prompt = "step 3: select the dealer";
                    break;
                case 4:
                    prompt = "step 4: was the upcard ordered up?"   
                    break;
                case 5:
                    prompt = "step 5: select the upcard (on the left)";
                    // if upcard was ordered up, then we begin the round, bc we know trump suit from that
                    break; 
                case 6:
                    prompt = "step 6: who ordered up trump?";
                    break;
                case 7:
                    prompt = "step 7: select the trump suit"
                    break;
            }
    
            document.getElementById(IDs.$step_prompt).innerHTML = prompt;
        }

        function activateNameInputs(activate){
            for (let i = 0; i < 4; i++){
                let input_box = document.getElementById(IDs.$input_names[i]);
                if (activate){
                    input_box.disabled = false;
                    input_box.style.background = "rgb(265,265,265,.1)";
                }
                else{
                    input_box.disabled = true;
                    input_box.style.background = "none";
                }
            }
        }
    
        function displayOrderedUpPrompt(show){
            let prompt = document.getElementById(IDs.$ordered_up_prompt);
            if (show){
                prompt.style.display = "grid";
            }
            else{
                prompt.style.display = "none";
            }
        }
    
        function displayMakerInputs(show){
            let maker_inputs = document.getElementsByName(IDs.$maker_input_group);
    
            for (let i = 0; i < maker_inputs.length; i++) {
                if (show) {
                    maker_inputs[i].style.display = "block";
                }
                else{
                    maker_inputs[i].style.display = "none";
                }
            }
        }
    
        function displayDealerInputs(show){
            let dealer_inputs = document.getElementsByName(IDs.$dealer_input_group);
    
            for (let i = 0; i < dealer_inputs.length; i++) {
                if (show) {
                    dealer_inputs[i].style.display = "block";
                }
                else{
                    dealer_inputs[i].style.display = "none";
                }
            }
        }
    
        function displayUpcardSlot(show){
            let slot = document.getElementById(IDs.$upcard_slot);
            let text_slot = document.getElementById(IDs.$upcard_text);
    
            if (show){
                slot.style.display = "block";
                text_slot.style.display = "block";
            }
            else{
                slot.style.display = "none";
                text_slot.style.display = "none";
            }
        }
    
        function displayTrumpPrompt(show){
    
            let prompt = document.getElementById(IDs.$trump_suit_prompt);
    
            if (show){
                prompt.style.display = "grid";
            }
            else{
                prompt.style.display = "none";
            }
        }

        updateBuildPrompt(step);
        
        switch(step){
            case 1: /* Select cards in hand */
                // deactivate other buttons
                disableDecks(false);
                resetDisplay();
                break;

            case 2: /* Enter player names */
                // deactivate decks and activate input boxes
                disableDecks(true);
                activateNameInputs(true);
                break;

            case 3: /* Select dealer */
                // hide name input boxes and show dealer checkboxes
                activateNameInputs(false);
                displayDealerInputs(true);
                break;

            case 4: /* Was upcard ordered up? */
                // show y/n ordered up question and hide dealer checkboxes
                displayOrderedUpPrompt(true);
                displayDealerInputs(false);
                break;

            case 5: /* Select upcard */
                // activate decks
                disableDecks(false);

                // hide y/n ordered up question, show upcard slot
                displayOrderedUpPrompt(false);
                displayUpcardSlot(true);
                break;

            case 6: /* Who ordered up trump? */
                // deactivate decks, hide upcard, show maker checkboxes
                disableDecks(true);
                displayUpcardSlot(false);
                displayMakerInputs(true);
                break;
                
            case 7: /* Select trumpsuit */
                // hide maker inputs, show trump suit options
                displayMakerInputs(false);
                displayTrumpPrompt(true);
                break;
        }
    }

    function disableDecks(disable){
        let decks = document.getElementById(IDs.$build_deck_grid);
        if (disable){
            decks.style.pointerEvents = "none";
        }
        else{
            decks.style.pointerEvents = "auto";
        }
    }

    function setInitialNames(prev_player_names){
        for (let i = 0; i < 4; i++){
            let input_box = document.getElementById(IDs.$input_names[i]);
            input_box.value = prev_player_names[i];
        }
    }

    function setInitialDealer(new_dealer){
        let dealer_inputs = document.getElementsByName(IDs.$dealer_input_group);
        dealer_inputs[new_dealer].checked = true;
    }

    function addCardToHand(cardelement, cardcode){
        shadeCard(cardcode);
        placeCardInHand(cardcode);
        flagCardInHand(cardelement);
    }

    function removeCardFromHand(cardel, cardcode){
        let slotname = cards_in_hand_slots.get(cardcode);
        cards_in_hand_slots.delete(cardcode);
        let slot = document.getElementById(slotname);
        slot.removeChild(slot.children[0]); // remove card from hand
        current_hand_slots.push(slotname); // add slot name back into the potential slot names

        /* remove the shade and the "in your hand" flag */
        while (cardel.firstChild){
            cardel.removeChild(cardel.firstChild);
        }
    }

    function showUpcard(cardelement, cardcode, ordered, inhand=false){
        shadeCard(cardcode);
        if (!inhand) flagUpCard(cardelement, ordered);
        placeUpcard(cardcode);
        disableDecks(true);
    }

    function displayNextButton(show){
        let next_btn = buildView.getNextButton();
        if (show){
            next_btn.style.display = "block";
        }
        else{
            next_btn.style.display = "none";
        }
    }

    function displayStartButton(show){
        
        if (show){
            let start_btn = buildView.getStartButton();
            start_btn.style.display = "block";
        }
        else{
            let start_btn = buildView.getStartButton();
            start_btn.style.display = "none";
        }
    }

    function showDealerName(dealer_name, dealer){
        let name_inputs = document.getElementsByName(IDs.$name_input_group);
        let dealer_box = name_inputs[dealer];
        let new_name = `(D) ${dealer_name}`;
        dealer_box.value = new_name;
    }

    function hideInvalidTrumpSuit(suit){
        let btn = getSuitButton(suit);
        btn.style.pointerEvents = "none";
        btn.style.opacity = ".5";
    }

    function removeUpcard(){
        let slot = document.getElementById(IDs.$upcard_slot);
        while (slot.firstChild){
            slot.removeChild(slot.firstChild);
        }
    }

    /********** functions for modifying cards in deck *****************/

    function createFlagElement(classname, message){
        let flagelement = createElement(classname);
        flagelement.innerHTML = message;
    
        return flagelement;
    }

    function shadeCard(cardcode){

        let cardel = card_element_map.get(cardcode);
        let shade = document.createElement("div");
        shade.className = "shade";
        cardel.appendChild(shade);
        shade.pointerEvents = "auto";
    }

    function placeCardInHand(cardcode){

        function createHandElement(cardcode){
            let handelement = createElement("cardinhand");
            handelement.style.backgroundImage = reg_url_map.get(cardcode);
            handelement.style.pointerEvents = "none";
            return handelement;
        }

        let slotname = current_hand_slots.shift();
        cards_in_hand_slots.set(cardcode,slotname);
        let slot = document.getElementById(slotname);
        let hand_element = createHandElement(cardcode);
        slot.appendChild(hand_element);

    }

    function placeUpcard(cardcode){

        function createUpcardElement(cardcode){
            let upcardelement = createElement("upcard-img");
            upcardelement.style.backgroundImage = reg_url_map.get(cardcode);
            upcardelement.style.pointerEvents = "none";
            return upcardelement;
        }

        let slot = document.getElementById(IDs.$upcard_slot);
        let upcard_element = createUpcardElement(cardcode);
        slot.appendChild(upcard_element);

    }

    function flagCardInHand(cardelement){
        let flagel = createFlagElement("inhand", "in your hand");
        cardelement.appendChild(flagel);
    }

    function flagUpCard(cardelement, orderedup, name=null){
        let message = "";

        if (orderedup){
            message = `in dealer's hand`;
        }
        else{
            message = "upcard (discarded)";
        }
        let flagel = createFlagElement("upcard", message);
        cardelement.appendChild(flagel);
    }

    /********** functions to retrieve HTML elements *****************/

    function getElements(type){
        switch(type){
            case 'name':
                return document.getElementsByName(IDs.$name_input_group);
            case 'dealer':
                return document.getElementsByName(IDs.$dealer_input_group);
            case 'maker':
                return document.getElementsByName(IDs.$maker_input_group);
            case 'orderedup':
                return document.getElementsByName(IDs.$ordered_up_group);
            case 'trumpsuit':
                return document.getElementsByName(IDs.$trump_suit_group);
        }
    }

    function getCardElementList(){
        return card_element_list;
    }

    function getNextButton(){
        return document.getElementById(IDs.$next_btn);
    }

    function getStartButton(){
        return document.getElementById(IDs.$start_btn);
    }

    function getNewRoundButton(){
        return document.getElementById(IDs.$new_round_btn);
    }

    function getSuitButton(suit){
        return document.getElementById(IDs.$trump_btns[suit]);
    }

    function getSuitFromButton(suit_btn){
        return TRUMP_ICONS.get(suit_btn.innerHTML);
    }

    /********** functions not exported and that have nothing to do with state *****************/

    function createElement(classname, id=null){
        /***
         * Create a div element of given classname,
         * and with id if specified
         */

        let element = document.createElement("div");
        element.className = classname;
        element.id = id;
        element.style.userSelect = "none";
    
        return element;
    }

    /********** helper functions *****************/

    var module = {
        "createBuildDisplay": createBuildDisplay,
        "setInitialNames": setInitialNames,
        "setInitialDealer": setInitialDealer,
        "getElements": getElements,
        "getCardElementList": getCardElementList,
        "getNextButton": getNextButton,
        "showBuildAlert": showBuildAlert,
        "updateDisplay": updateDisplay,
        "getCardCode": getCardCode,
        "addCardToHand": addCardToHand,
        "removeCardFromHand": removeCardFromHand,
        "showDealerName": showDealerName,
        "showUpcard": showUpcard,
        "hideInvalidTrumpSuit": hideInvalidTrumpSuit,
        "getStartButton": getStartButton,
        "getNewRoundButton": getNewRoundButton,
        "displayNextButton": displayNextButton,
        "displayStartButton": displayStartButton,
        "collectNames": collectNames,
        "collectDealer": collectDealer,
        "collectMaker": collectMaker,
        "getSuitFromButton": getSuitFromButton
	}

	return module;

})();
