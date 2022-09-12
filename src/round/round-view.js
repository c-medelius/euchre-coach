import {viewsetup} from '../setup/view-setup.js';
import {ALL_CARD_CODES, SUIT_ICONS, SUIT_ICONS_RED, DEGREES, MARGINS} from '../setup/constants.js';
import {round_page_IDs} from '../setup/constants.js';

export var roundView = (function() {

    var card_element_map = new Map();
    var reverse_card_element_map = new Map();
    var card_element_list = new Map();

    const reg_url_map = viewsetup.getRegURLs();

    var hand_slot_map;
    var hand_element_map;
    var hint_slot_map;

    var IDs = round_page_IDs;

    function getCardElementList(){
        return card_element_list;
    }

    function getCardCode(cardelement){
        return reverse_card_element_map.get(cardelement);
    }

    /********** functions for during a round *****************/

    function setupRoundDisplay(trumpsuit, orderedup, upcard, dealer, cardsinhand, playernames, maker){

        /* display the correct page */
        let buildpage = document.getElementById(IDs.$build_page);
        buildpage.style.display = "none";

        let roundpage = document.getElementById(IDs.$round_page);
        roundpage.style.display = "block";

        /* get new card elements */
        var card_element_data = viewsetup.getNewCardElements();
        card_element_map = card_element_data[0];
        reverse_card_element_map = card_element_data[1];
        card_element_list = card_element_data[2];

        let dealername = playernames[dealer];

        function resetHandSlots(){
            for (let i = 0; i < 5; i++){
                let slotname = IDs.$hand_slots[i];
                let slot = document.getElementById(slotname);
                slot.style.display = "block";
                while (slot.firstChild){
                    slot.removeChild(slot.firstChild);
                }
            }
        }

        function placeInitialHand(cardsinhand){

            function createHandElement(cardcode){
                let handelement = createElement("cardinhand");
                handelement.style.backgroundImage = reg_url_map.get(cardcode);
                handelement.style.pointerEvents = "none";
                return handelement;
            }

            hand_slot_map = new Map();
            hand_element_map = new Map();
            hint_slot_map = new Map();
    
            for (let i = 0; i < 5; i++){
                let cardcode = cardsinhand[i];
                let slotname = IDs.$hand_slots[i];
                let slot = document.getElementById(slotname);
                let hand_element = createHandElement(cardcode);
                slot.appendChild(hand_element);
                hand_slot_map.set(cardcode, slotname);
                hand_element_map.set(cardcode, hand_element);
                hint_slot_map.set(cardcode, IDs.$hint_slots[i]);
            }
        }

        function placeDecks(trumpsuit){
            let deck_grid = document.getElementById(IDs.$deck_grid);
            let card_list = ALL_CARD_CODES[trumpsuit];
    
            let card_index = 0;
            let num_cards = [7, 6, 5, 6];

            for (let i = 0; i < 4; i++){

                let row = i+1;
                let col = 1;

                for (let j = 0; j < num_cards[i]; j++){

                    let cardcode = card_list[card_index];
                    let cardel = card_element_map.get(cardcode);
                    deck_grid.appendChild(cardel);
                    cardel.style.gridColumn = col;
                    cardel.style.gridRow = row;

                    col++;
                    card_index++;

                }
            }
        }

        function setPlayerNames(playernames, dealer){

            for (let i = 0; i < 4; i++){
                let playerlabelname = IDs.$name_labels[i];
                let playerlabel = document.getElementById(playerlabelname);
                if (i == dealer){
                    playerlabel.innerHTML = `(D) ${playernames[i]}`;
                }
                else{
                    playerlabel.innerHTML = `${playernames[i]}`;
                }
            }
        }

        function resetPlayerScores(){
            for (let i = 0; i < 4; i++){
                let playerscorename = IDs.$scores[i];
                let scorelabel = document.getElementById(playerscorename);
                scorelabel.innerHTML = "0";
            }
        }

        function createFlagElement(classname, message){
            let flagelement = createElement(classname);
            flagelement.innerHTML = message;
        
            return flagelement;
        }

        function flagCardsInHand(cardsinhand){

            for (let i = 0; i < 5; i++){
                let flagel = createFlagElement("inhand", "in your hand");
                let cardel = card_element_map.get(cardsinhand[i]);
                cardel.appendChild(flagel);
            }
            
        }

        function flagUpcard(upcard, dealername, orderedup){

            let message = "";

            if (orderedup){
                if (dealername == null) dealername = "dealer";
                message = `in ${dealername}'s hand`;
            }
            else{
                message = "upcard (discarded)";
                shadeCard(upcard);
            }
            let flagel = createFlagElement("upcard", message);
            let cardel = card_element_map.get(upcard);
            cardel.appendChild(flagel);
    
        }

        function displayTrumpSuit(trumpsuit, maker){
            let element = document.getElementById(IDs.$trumpsuit_label);
            let message = `Trump suit: ${SUIT_ICONS_RED[trumpsuit]}<br>Ordered up by: ${playernames[maker]}`;
            element.innerHTML = message;
        }

        resetHandSlots();
        placeInitialHand(cardsinhand);
        rearrangeHandBasedOnSize();
        placeDecks(trumpsuit);
        setPlayerNames(playernames, dealer);
        resetPlayerScores();
        flagCardsInHand(cardsinhand);
        if (dealer == 0){ // don't flag upcard if it's in user's hand
            if (!orderedup) flagUpcard(upcard, dealername, orderedup);
        }
        else{
            flagUpcard(upcard, dealername, orderedup);
        }
        displayTrumpSuit(trumpsuit, maker);

    }
    
    function updatePrompt(type, playername=null){
        
        let prompt;
        let prompt_slot = document.getElementById(IDs.$player_prompt);

        if (type == 0){
            prompt = `What did ${playername} play?`;
        }
        else if(type == 1){
            prompt = `${playername} won this trick!`;
        }
        else if(type == 2){
            prompt = "What will you play ..... ?";
        }
        else if(type == 3){
            prompt = "Round over!";
            prompt_slot.style.border = 'green';
        }
        
        prompt_slot.innerHTML = prompt;
    }

    function playCard(cardcode, player){

        function placeCardOnTable(cardcode, player){

            let playerslotname = IDs.$table_slots[player];
            
            let playerslot = document.getElementById(playerslotname);
            let imgURL = reg_url_map.get(cardcode);
            playerslot.style.backgroundImage = imgURL;
            playerslot.style.border = "1px solid black";
    
            if ((player == 1) || (player == 3)){
                playerslot.style.transform = "rotate(90deg)";
            }
        }

        function removeCardFromHand(cardcode){
            let slotname = hand_slot_map.get(cardcode);
            let slot = document.getElementById(slotname);
            slot.style.display = "none";
            hand_slot_map.delete(cardcode);
        }

        function updateHandAfterTurn(){
            
            for (const cardcode of hand_element_map.keys()){
    
                function resetCardInHand(cardcode){
                    let element = hand_element_map.get(cardcode);
                    element.style.pointerEvents = "none";
            
                    function unshadeCardInHand(cardcode){
                        let element = hand_element_map.get(cardcode);
                        if (element.hasChildNodes()) {
                            element.removeChild(element.children[0]);
                        }
                    }
            
                    unshadeCardInHand(cardcode);
                }
    
                resetCardInHand(cardcode);
            }

            rearrangeHandBasedOnSize();
            displayGeneralHint(false);
        }

        placeCardOnTable(cardcode, player);
        shadeCard(cardcode);

        if (player == 0){
            removeCardFromHand(cardcode);
            updateHandAfterTurn();
        }
    }

    function highlightPlayer(player){
        
        let playerlabelname = IDs.$name_labels[player];
        let playerlabel = document.getElementById(playerlabelname);
        playerlabel.style.border = "1px dashed #F9C80E";

        let playerscorename = IDs.$scores[player];
        let scorelabel = document.getElementById(playerscorename);
        scorelabel.style.border = "1px dashed #F9C80E";

    }

    function unhighlightPlayer(player){

        let playerlabelname = IDs.$name_labels[player];
        let playerlabel = document.getElementById(playerlabelname);
        playerlabel.style.border = "1px solid white";

        let playerscorename = IDs.$scores[player];
        let scorelabel = document.getElementById(playerscorename);
        scorelabel.style.border = "1px solid white";
    }

    function incrementScore(player){

        let playerscorename = IDs.$scores[player];
        let scorelabel = document.getElementById(playerscorename);
        let currentscore = parseInt(scorelabel.innerHTML);
        currentscore += 1;
        scorelabel.innerHTML = currentscore.toString();

    }

    function removeAllCardsFromTable(){

        for (let i = 0; i < 4; i++){
            let playerslotname = IDs.$table_slots[i];
            let playerslot = document.getElementById(playerslotname);
            playerslot.style.backgroundImage = 'none';
            playerslot.style.border = 'none';
        }
    }

    function showAlert(type, player){

        function generateAlertMessage(type, playername){
            let message = "hold up! ";
    
            switch(type){
                case 1:
                    message += `not a valid play for ${playername} -- this card's in your hand.`;
                    break;
                case 2:
                    message += "you can't play this card -- it's not in your hand.";
                    break;
                case 3:
                    message += "you can't play this card -- it doesn't follow suit. you (and I) know you can follow suit."
                    break;
                case 4:
                    message += `not a valid play for ${playername} -- they are void in this suit.`;
                    break;
                case 5:
                    message += `not a valid play for ${playername} -- this card has already been played.`
                    + ` how did it even let you click on this card?`
                    + ` something's wrong with my code if we're seeing this ....`;
                    break;
                case 6:
                    message += `not a valid play for ${playername} -- this card is in the dealer's hand.`;
                    break;
                case 7:
                    message += `not a valid play for ${playername} -- they need to follow suit (which they can do, because they have the upcard)`;
                    break;
                case 8:
                    message += `not a valid play for ${playername} -- their last remaining card should be the upcard.`;
            }

            return message;
        }
        let message = generateAlertMessage(type, player);
        let element = document.getElementById(IDs.$alert_overlay);
        let text_element = document.getElementById(IDs.$alert_text);

        text_element.innerHTML = message;
        element.style.display = "block";

    }

    function updateVoidString(player, void_suits){
        let voidstr = "Void in: ";  
        for (let i = 0; i < void_suits.length; i++){
            let suit = void_suits[i];
            voidstr += SUIT_ICONS[suit] + " ";
        }
        let slot = document.getElementById(IDs.$void_slots[player]);
        slot.innerHTML = voidstr;
    }

    function highlightPlayableCards(playable){
        for (let i = 0; i < playable.length; i++){
            let element = hand_element_map.get(playable[i]);
            element.style.pointerEvents = "auto";
        }
    }

    function shadeNotPlayableCards(not_playable){
        for (let i = 0; i < not_playable.length; i++){
            let element = hand_element_map.get(not_playable[i]);
            let shade = createElement("shade");
            element.appendChild(shade);
        }
    }

    function displayGeneralHint(show){
        let hint_element = document.getElementById(IDs.$general_hint_slot);
        if (show) hint_element.style.display = "block";
        else hint_element.style.display = "none";

    }

    function setGeneralHints(message){
        let hint_element = document.getElementById(IDs.$general_hint_slot);
        hint_element.innerText = message;
    }

    function updateHandBeforeLeadTurn(playable, hints){

        /* playable and hints should be the same length */

        function setupIndividualHints(playable, hints){
            /***
             * params: a list of playable cards in hand and the corresponding hints
             * sets the hint text for each playable card
             * and adds event listeners for those cards
             */
    
             for (let i = 0; i < playable.length; i++){
    
                let cardcode = playable[i];
                let hint = hints[i];

                function setHintText(cardcode, hint){
                    let hint_element = document.getElementById(hint_slot_map.get(cardcode));
                    hint_element.innerText = hint;
                }
    
                let element = hand_element_map.get(cardcode);
                element.style.pointerEvents = "auto";
    
                function displayHints(show, cardcode){
                    let hint_slot = document.getElementById(hint_slot_map.get(cardcode));
                    if (show){
                        hint_slot.style.display = "block";
                    }
                    else{
                        hint_slot.style.display = "none";
                    }
                }

                element.addEventListener('mouseenter', function(e) {
                    displayHints(true, cardcode);
                    displayGeneralHint(false);
                    element.style.border = "1px solid red";
                });
    
                element.addEventListener('mouseleave', function(e) {
                    displayHints(false, cardcode);
                    displayGeneralHint(true);
                    element.style.border = "1px solid black";
                });
    
                setHintText(cardcode, hint);
            }
        }

        setGeneralHints("Hover over cards for specific hints.");
        displayGeneralHint(true);
        setupIndividualHints(playable, hints);
        highlightPlayableCards(playable);
    }

    function updateHandBeforeFollowTurn(playable, not_playable, hints){
        setGeneralHints(hints);
        displayGeneralHint(true);
        shadeNotPlayableCards(not_playable);
    }

    function getButton(type){
        
        switch(type){
            case 'start round':
                return document.getElementById(IDs.$start_btn);
            case 'new round':
                return document.getElementById(IDs.$new_round_btn);
        }
    }

    /********** functions not exported *****************/

    function shadeCard(cardcode){
        let cardel = card_element_map.get(cardcode);
        let shade = document.createElement("div");
        shade.className = "shade";
        cardel.appendChild(shade);
        cardel.style.pointerEvents = "none";
        
    }

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

    function rearrangeHandBasedOnSize(){

        /* places the hand based on how many cards are currently in it */

        let size = hand_slot_map.size;
        let i = Math.abs(size-5);

        for (const slotname of hand_slot_map.values()){
            let transform_val = `rotate(${DEGREES[i]}deg)`;
            let margin_val = `${MARGINS[i]}px`;
            let slot = document.getElementById(slotname);
            slot.style.transform = transform_val;
            slot.style.marginLeft = margin_val;
            i += 2;
        }
    }

    function disableDecks(disable){
        let decks = document.getElementById(IDs.$deck_grid);
        if (disable){
            decks.style.pointerEvents = "none";
        }
        else{
            decks.style.pointerEvents = "auto";
        }
    }

    var module = {
        "getCardElementList": getCardElementList,
        "getCardCode": getCardCode,
        "setupRoundDisplay": setupRoundDisplay,
        "updatePrompt": updatePrompt,
        "playCard": playCard,
        "highlightPlayer": highlightPlayer,
        "unhighlightPlayer": unhighlightPlayer,
        "incrementScore": incrementScore,
        "removeAllCardsFromTable": removeAllCardsFromTable,
        "showAlert": showAlert,
        "updateVoidString": updateVoidString,
        "updateHandBeforeLeadTurn": updateHandBeforeLeadTurn,
        "updateHandBeforeFollowTurn": updateHandBeforeFollowTurn,
        "getButton": getButton,
        "disableDecks": disableDecks,
	}
	return module

})();
