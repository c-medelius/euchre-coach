const SPADES_CARD_CODES = ['S-J', 'C-J', 'S-A', 'S-K', 'S-Q', 'S-10', 'S-9', 'H-A', 'H-K', 'H-Q', 'H-J', 'H-10', 'H-9', 'C-A', 'C-K', 'C-Q', 'C-10', 'C-9', 'D-A', 'D-K', 'D-Q', 'D-J', 'D-10', 'D-9'];
const HEARTS_CARD_CODES = ['H-J', 'D-J', 'H-A', 'H-K', 'H-Q', 'H-10', 'H-9', 'C-A', 'C-K', 'C-Q', 'C-J', 'C-10', 'C-9', 'D-A', 'D-K', 'D-Q', 'D-10', 'D-9', 'S-A', 'S-K', 'S-Q', 'S-J', 'S-10', 'S-9'];
const CLUBS_CARD_CODES = ['C-J', 'S-J', 'C-A', 'C-K', 'C-Q', 'C-10', 'C-9', 'D-A', 'D-K', 'D-Q', 'D-J', 'D-10', 'D-9', 'S-A', 'S-K', 'S-Q', 'S-10', 'S-9', 'H-A', 'H-K', 'H-Q', 'H-J', 'H-10', 'H-9',];
const DIAMONDS_CARD_CODES = ['D-J', 'H-J', 'D-A', 'D-K', 'D-Q', 'D-10', 'D-9', 'S-A', 'S-K', 'S-Q', 'S-J', 'S-10', 'S-9', 'H-A', 'H-K', 'H-Q', 'H-10', 'H-9', 'C-A', 'C-K', 'C-Q', 'C-J', 'C-10', 'C-9'];
export const ALL_CARD_CODES = [SPADES_CARD_CODES, HEARTS_CARD_CODES, CLUBS_CARD_CODES, DIAMONDS_CARD_CODES];

const TRUMP_CARD_VALUES = [115, 114, 113, 112, 111, 110, 109];
const REG_CARD_VALUES = [14, 13, 12, 11, 10, 9];
const NEXT_CARD_VALUES = [14, 13, 12, 10, 9];
export const ALL_CARD_VALUES = [].concat(TRUMP_CARD_VALUES, REG_CARD_VALUES, NEXT_CARD_VALUES, REG_CARD_VALUES);

const TRUMP_CARD_RANKS = [11, 11, 14, 13, 12, 10, 9];
const REG_CARD_RANKS = [14, 13, 12, 11, 10, 9];
const NEXT_CARD_RANKS = [14, 13, 12, 10, 9];
export const ALL_CARD_RANKS = [].concat(TRUMP_CARD_RANKS, REG_CARD_RANKS, NEXT_CARD_RANKS, REG_CARD_RANKS);

/* suits are 0 = diamonds, 1 = hearts, 2 = clubs, 3 = diamonds */

export const EUCHRE_CARD_CODES = ['S-A', 'S-K', 'S-Q', 'S-J', 'S-10', 'S-9', 'H-A', 'H-K', 'H-Q', 'H-J', 'H-10', 'H-9', 'C-A', 'C-K', 'C-Q', 'C-J', 'C-10', 'C-9', 'D-A', 'D-K', 'D-Q', 'D-J', 'D-10', 'D-9'];
export const SUIT_CODE_MAP = new Map([['S','Spades'], ['H','Hearts'], ['C','Clubs'], ['D','Diamonds']]);
export const SUITS = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
export const RANK_CODE_MAP = new Map([['A', 'Ace'], ['K', 'King'], ['Q', 'Queen'], ['J', 'Jack'], ['10', '10'], ['9', '9'], ])

export const SUIT_ICONS = [
    '<FONT COLOR=black SIZE=\'5px\'>&spades;</FONT>',
    '<FONT COLOR=#EEB3B3 SIZE=\'5px\'>&hearts;</FONT>',
    '<FONT COLOR=black SIZE=\'5px\'>&clubs;</FONT>',
    '<FONT COLOR=#EEB3B3 SIZE=\'5px\'>&diams;</FONT>'
];

export const SUIT_ICONS_RED = [
    '<FONT COLOR=black SIZE=\'5px\'>&spades;</FONT>',
    '<FONT COLOR=red SIZE=\'5px\'>&hearts;</FONT>',
    '<FONT COLOR=black SIZE=\'5px\'>&clubs;</FONT>',
    '<FONT COLOR=red SIZE=\'5px\'>&diams;</FONT>'
];

export const TRUMP_ICONS = new Map([['♠', 0],['♥', 1],['♣', 2],['♦', 3]]);

export const build_page_IDs = {
    $round_page:"round-page",
    $build_page:"build-page",
    $build_hand_slots:['build-hand3', 'build-hand2', 'build-hand4', 'build-hand1', 'build-hand5'],
    $name_input_group:"name-input",
    $input_names:['P0name-input', 'P1name-input', 'P2name-input', 'P3name-input'],
    $step_prompt:"stepprompt",
    $next_btn:"next-btn",
    $start_btn:"start-btn",
    $new_round_btn:"new-round-btn",
    $build_deck_grid:"build-decks",
    $dealer_input_group:"dealer-input",
    $maker_input_group:"maker-input",
    $ordered_up_prompt:"orderedup-prompt",
    $ordered_up_group:"orderedup-input",
    $build_alert_overlay:"build-alert-overlay",
    $build_alert_text:"build-alert-text",
    $upcard_slot:"upcard-slot",
    $upcard_text:"upcard-text",
    $trump_suit_prompt:"trumpsuit-prompt",
    $trump_suit_group:"trumpsuit-input",
    $trump_btns:['spades-btn', 'hearts-btn', 'clubs-btn', 'diams-btn'],
}

export const round_page_IDs = {
    $deck_grid:"decks",
    $round_page:"round-page",
    $build_page:"build-page",
    $name_labels:['P0Name', 'P1Name', 'P2Name', 'P3Name'],
    $scores:['P0Score', 'P1Score', 'P2Score', 'P3Score'],
    $table_slots:['P0CardSlot', 'P1CardSlot', 'P2CardSlot', 'P3CardSlot'],
    $void_slots:['P0Void', 'P1Void', 'P2Void', 'P3Void'],
    $player_prompt:"playprompt",
    $trumpsuit_label:"trumpsuit-label",
    $alert_box:"round-alert-box",
    $alert_overlay:"round-alert-overlay",
    $alert_text:"round-alert-text",
    $hand_slots:['hand1', 'hand2', 'hand3', 'hand4', 'hand5'],
    $hint_slots:['hint1', 'hint2', 'hint3', 'hint4', 'hint5'],
    $general_hint_slot:"hint-general",
    $new_round_btn:"new-round-btn",
    $start_btn:"start-round-btn",
    $next_round_btn:"next-round-btn",
}

export const DEGREES = ["-45", "-33.5", "-22", "-11.5", "0", "11.5", "22", "33.5", "45"];
export const MARGINS = ["20", "30", "40", "50", "60", "70", "80", "90", "100"];

export const $loading_page_ID = "loading-page";