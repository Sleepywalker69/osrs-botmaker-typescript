// Define constants
const EASY_SCROLL_BOX_ID = 24362;
const CLUE_SCROLL_EASY_ID = 2686;
const CLUE_COMPASS_ID = 30363;
const SPADE_ID = 952;

const EQUIPMENT_CLUE_KEYWORDS = ['equip', 'wear', 'equipped'];
const INTERACTION_TIMEOUT = 2400; // ms

// Define state type using literal union
const STATE_NAME_CHECK_INVENTORY = 'CHECK_INVENTORY';
const STATE_NAME_OPEN_BOX = 'OPEN_BOX';
const STATE_NAME_READ_CLUE = 'READ_CLUE';
const STATE_NAME_NAVIGATE = 'NAVIGATE';
const STATE_NAME_PERFORM_ACTION = 'PERFORM_ACTION';

// Define state interface
function State(name, lastActionTime) {
    this.name = name;
    this.lastActionTime = lastActionTime;
}

let currentState = new State(STATE_NAME_CHECK_INVENTORY, 0);

let isReading = false;
let currentClueText = '';

function onStart() {
    currentState = new State(STATE_NAME_CHECK_INVENTORY, Date.now());
    bot.printGameMessage('Easy Clue Solver Started');
}

function hasTimedOut() {
    return Date.now() - currentState.lastActionTime > INTERACTION_TIMEOUT;
}

function updateState(newState) {
    currentState = new State(newState, Date.now());
}

function checkInventoryForItem(itemId) {
    const items = bot.inventory.interactWithIds([itemId], []);
    return items !== undefined && items !== null;
}

function hasObjectAction(object, action) {
    try {
        const objectId = object.getId();
        const composition = bot.objects.getTileObjectComposition(objectId);
        if (!composition) return false;

        const actions = composition.getActions();
        return actions.some(a => a && a.toLowerCase() === action.toLowerCase());
    } catch (error) {
        return false;
    }
}

function findMarkedObject() {
    const objects = bot.objects.getTileObjectsWithIds([]);
    return objects.find(object => {
        if (!object) return false;
        return object.getClickbox() !== null;
    });
}

function handleInventoryCheck() {
    if (!hasTimedOut()) return;

    const hasClueScroll = checkInventoryForItem(CLUE_SCROLL_EASY_ID);
    const hasClueBox = checkInventoryForItem(EASY_SCROLL_BOX_ID);
    const hasClueCompass = checkInventoryForItem(CLUE_COMPASS_ID);

    if (!hasClueScroll && !hasClueBox) {
        bot.printGameMessage('No clue scroll or box found');
        return;
    }

    if (hasClueBox) {
        updateState(STATE_NAME_OPEN_BOX);
        return;
    }

    if (hasClueScroll && !isReading) {
        updateState(STATE_NAME_READ_CLUE);
        return;
    }

    if (hasClueCompass) {
        updateState(STATE_NAME_NAVIGATE);
    }
}

function handleOpenBox() {
    if (!hasTimedOut()) return;

    bot.inventory.interactWithIds([EASY_SCROLL_BOX_ID], ['Open']);
    updateState(STATE_NAME_CHECK_INVENTORY);
}

function handleReadClue() {
    if (!hasTimedOut()) return;

    bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Read']);
    isReading = true;
    updateState(STATE_NAME_CHECK_INVENTORY);
}

function handleNavigation() {
    if (!hasTimedOut()) return;

    if (!bot.localPlayerMoving()) {
        bot.inventory.interactWithIds([CLUE_COMPASS_ID], ['Use']);
        updateState(STATE_NAME_PERFORM_ACTION);
    }
}

function talkToHintArrowNPC() {
    const nearbyNpcs = bot.npcs.getWithIds([]);
    const targetNpc = nearbyNpcs.find(npc => {
        try {
            return npc && npc.getInteracting() === null && !npc.isDead();
        } catch (error) {
            return false;
        }
    });

    if (targetNpc) {
        bot.npcs.interactSupplied(targetNpc, "Talk-to");
        return true;
    }
    return false;
}

function handleMarkedObject() {
    const markedObject = findMarkedObject();
    if (!markedObject) return false;

    if (hasObjectAction(markedObject, 'Open')) {
        bot.objects.interactSuppliedObject(markedObject, 'Open');
        return true;
    }

    bot.objects.interactSuppliedObject(markedObject, 'Search');
    return true;
}

function handleAction() {
    if (!hasTimedOut()) return;

    if (bot.localPlayerMoving()) {
        return;
    }

    if (talkToHintArrowNPC()) {
        updateState(STATE_NAME_CHECK_INVENTORY);
        isReading = false;
        return;
    }

    if (handleMarkedObject()) {
        updateState(STATE_NAME_CHECK_INVENTORY);
        isReading = false;
        return;
    }

    const hasSpade = checkInventoryForItem(SPADE_ID);
    if (hasSpade && currentClueText.toLowerCase().includes('dig')) {
        bot.printGameMessage('Digging at location');
        bot.inventory.interactWithIds([SPADE_ID], ['Dig']);
        updateState(STATE_NAME_CHECK_INVENTORY);
        isReading = false;
        return;
    }

    bot.printGameMessage('No action found - resetting');
    updateState(STATE_NAME_CHECK_INVENTORY);
    isReading = false;
}

function onGameTick() {
    switch (currentState.name) {
        case STATE_NAME_CHECK_INVENTORY:
            handleInventoryCheck();
            break;
        case STATE_NAME_OPEN_BOX:
            handleOpenBox();
            break;
        case STATE_NAME_READ_CLUE:
            handleReadClue();
            break;
        case STATE_NAME_NAVIGATE:
            handleNavigation();
            break;
        case STATE_NAME_PERFORM_ACTION:
            handleAction();
            break;
    }
}

function onChatMessage(type, name, message) {
    if (isReading) {
        currentClueText = message;
        isReading = false;

        if (EQUIPMENT_CLUE_KEYWORDS.some(keyword => message.toLowerCase().includes(keyword))) {
            bot.printGameMessage('Equipment clue detected - dropping');
            bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Drop']);
            updateState(STATE_NAME_CHECK_INVENTORY);
            return;
        }

        updateState(STATE_NAME_NAVIGATE);
    }
}

// Required interface implementations
function onNpcAnimationChanged(npc) {}
function onActorDeath(actor) {}
function onHitsplatApplied(actor, hitsplat) {}
function onInteractingChanged(sourceActor, targetActor) {}

// Replace bot.* with actual bot functions
const bot = {
    printGameMessage: message => console.log(message),
    inventory: {
        interactWithIds: (ids, actions) => [],
    },
    objects: {
        getTileObjectComposition: id => ({ getActions: () => [] }),
        interactSuppliedObject: (object, action) => {},
    },
    npcs: {
        getWithIds: () => [],
        interactSupplied: (npc, action) => {},
    }
}