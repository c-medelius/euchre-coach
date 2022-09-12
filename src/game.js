import {roundController} from './round/round-controller.js'
import {buildController} from './build/build-controller.js'

var user = 0;
var prev_player_names;
var next_dealer = 1;

const next_players = [1,2,3,0];

run();

function setupGame(){

    function setupButtonListeners(){
        let start_btn = buildController.getButton('start round');
        start_btn.addEventListener('click', startRound);

        let new_round_btn = buildController.getButton('new round');
        new_round_btn.addEventListener('click', buildRound);
    }
    setupButtonListeners();
    buildRound();
}

function buildRound(){
    buildController.setupNewBuild(prev_player_names, next_dealer);
}

function startRound(){

    let [trumpsuit, orderedup, upcard, dealer, cardsinhand, player_names, maker] = buildController.getFinalInputValues();

    // var trumpsuit = 2;
    // var orderedup = true;
    // var upcard = 'C-9';
    // var dealer = 1;
    // var cardsinhand = ['S-A', 'C-10', 'S-K', 'D-A', 'D-J']
    // var player_names = ['Caro', 'Brandon', 'Marie', 'Chimi'];
    // var maker = 1;

    console.log(`(game.js) trumpsuit = ${trumpsuit}`);
    console.log(`(game.js) orderedup = ${orderedup}`);
    console.log(`(game.js) upcard = ${upcard}`);
    console.log(`(game.js) dealer = ${dealer}`);
    console.log(`(game.js) cardsinhand = ${cardsinhand}`);
    console.log(`(game.js) player_names = ${player_names}`);
    console.log(`(game.js) maker = ${maker}`);

    prev_player_names = player_names;
    next_dealer = next_players[dealer];

    roundController.setupNewRound(trumpsuit, orderedup, upcard, dealer, user, cardsinhand, player_names, maker);
}


function run(){

    setupGame();

}