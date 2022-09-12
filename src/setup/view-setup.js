import {EUCHRE_CARD_CODES, SUIT_CODE_MAP} from './constants.js';

export var viewsetup = (function(){
    
    let reg_url_map = new Map();
    
    function createURLs(){
        for (let i = 0; i < 24; i++){

            let cardcode = EUCHRE_CARD_CODES[i];
            let suit_abbrv = cardcode.slice(0,1);
            let rank = cardcode.slice(2);
            let suit_full = SUIT_CODE_MAP.get(suit_abbrv);
            
            let regURL = `url(images/euchrecards/${rank}_of_${suit_full}.png)`;

            reg_url_map.set(cardcode, regURL);
        }
    }

    function setupModalBox(){

        // TODO put top bar on both pages, i.e. put both pages as classes under top bar
        var about_box = document.getElementById("about-box");
        var about_btn = document.getElementById("about-btn");
        var about_close_btn = document.getElementById("about-close-btn");

        var round_alert_close_btn = document.getElementById("round-alert-close-btn");
        var round_alert_overlay = document.getElementById("round-alert-overlay");

        var build_alert_close_btn = document.getElementById("build-alert-close-btn");
        var build_alert_overlay = document.getElementById("build-alert-overlay");

        about_btn.onclick = function() {
            about_box.style.display = "block";
        }

        about_close_btn.onclick = function() {
            about_box.style.display = "none";
        }

        round_alert_close_btn.onclick = function() {
            round_alert_overlay.style.display = "none";
        }

        build_alert_close_btn.onclick = function() {
            build_alert_overlay.style.display = "none";
        }

        window.onclick = function(event) {

            if (event.target == round_alert_overlay){
                round_alert_overlay.style.display = "none";
            }
            if (event.target == about_box) {
                about_box.style.display = "none";
            }
            if (event.target == build_alert_overlay) {
                build_alert_overlay.style.display = "none";
            }
        }
    }

    createURLs();
    setupModalBox();

    function getRegURLs(){
        /***
         * returns: map of img URLs
         * --- (key = card code and val = imgURLs)
        */

        return reg_url_map;
    }

    function getNewCardElements(){

        let card_element_map = new Map();
        let reverse_card_element_map = new Map();
        let card_element_list = [];

        function createElement(classname){
            let element = document.createElement("div");
            element.className = classname;
            element.style.userSelect = "none";
        
            return element;
        }

        function createNewCardElements(){
            for(let i = 0; i < 24; i++){
                let cardcode = EUCHRE_CARD_CODES[i];
                let regURL = reg_url_map.get(cardcode);
    
                let cardel = createElement("deckcard");
                cardel.style.backgroundImage = regURL;
        
                card_element_map.set(cardcode, cardel);
                reverse_card_element_map.set(cardel, cardcode);
                card_element_list.push(cardel);
            }
        }

        createNewCardElements();

        return [card_element_map, reverse_card_element_map, card_element_list];
    }

    function getCardcodeList(){
        return EUCHRE_CARD_CODES;
    }

    var module = {
		"getRegURLs": getRegURLs,
        "getNewCardElements": getNewCardElements,
        "getCardcodeList": getCardcodeList
	}

	return module;
	
})();