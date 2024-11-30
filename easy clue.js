// Define constants
const EASY_SCROLL_BOX_ID = 24362;
const CLUE_SCROLL_EASY_ID = 2686;
const CLUE_COMPASS_ID = 30363;

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

// Define bot functions
const bot = {
	printGameMessage: (message) => console.log(message),
	inventory: {
		interactWithIds: (ids, actions) => [],
	},
	objects: {
		getTileObjectComposition: (id) => ({ getActions: () => [] }),
		interactSuppliedObject: (object, action) => {},
	},
	npcs: {
		talkToHintArrowNPC: () => {},
		interactSupplied: (npc, action) => {},
	},
};

// Define functions
function hasTimedOut() {
	return Date.now() - currentState.lastActionTime > 2400; // ms
}

function updateState(newState) {
	currentState = new State(newState, Date.now());
}

function checkInventoryForItem(itemId) {
	const items = bot.inventory.interactWithIds([itemId], []);
	return items !== undefined && items !== null;
}

function hasObjectAction(objectId, action) {
	var objectComposition = bot.objects.getTileObjectComposition(objectId);
	var actions = objectComposition.getActions();
	for (var i = 0; i < actions.length; i++) {
		if (actions[i] && actions[i] == action) {
			return true;
		}
	}
	return false;
}

function talkToHintArrowNPC() {
	var npc = client.getHintArrowNpc();
	if (npc !== null) {
		bot.npcs.talkToHintArrowNPC(npc);
	} else {
		bot.printGameMessage('No NPC with Hint Arrow found');
	}
}

// Define states
let isReading = false;
let currentClueText = '';

function handleInventoryCheck() {
	if (!hasTimedOut()) return;

	const hasClueScroll = checkInventoryForItem(CLUE_SCROLL_EASY_ID);
	const hasClueBox = checkInventoryForItem(EASY_SCROLL_BOX_ID);

	if (hasClueScroll) {
		updateState(STATE_NAME_READ_CLUE);
		return;
	}

	if (!hasClueBox && !hasClueScroll) {
		bot.printGameMessage('No clue scroll or box found');
		return;
	}

	if (hasClueBox) {
		updateState(STATE_NAME_OPEN_BOX);
		return;
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
	updateState(STATE_NAME_NAVIGATE);
}

function handleNavigation() {
	if (!hasTimedOut()) return;

	const npc = client.getHintArrowNpc();
	if (npc !== null) {
		talkToHintArrowNPC(npc);
	} else {
		bot.printGameMessage('No NPC with Hint Arrow found');
	}
}

function handleAction() {
	if (!hasTimedOut()) return;

	if (isReading) {
		currentClueText = '';
		isReading = false;
		updateState(STATE_NAME_CHECK_INVENTORY);
		return;
	}

	const hasSpade = checkInventoryForItem(952);
	if (hasSpade && currentClueText.toLowerCase().includes('dig')) {
		bot.printGameMessage('Digging at location');
		bot.inventory.interactWithIds([952], ['Dig']);
		updateState(STATE_NAME_CHECK_INVENTORY);
		return;
	}

	const hasObjectToOpen = bot.objects.getTileObjectsWithIds([]);
	for (var i = 0; i < hasObjectToOpen.length; i++) {
		if (hasObjectAction(hasObjectToOpen[i].getId(), 'Open')) {
			bot.objects.interactSuppliedObject(hasObjectToOpen[i], 'Open');
			updateState(STATE_NAME_CHECK_INVENTORY);
			return;
		}
	}

	const distance = client.getDistanceToLocation();
	if (distance > 0) {
		bot.printGameMessage('Walking to location...');
		bot.inventory.interactWithIds([CLUE_COMPASS_ID], ['Use']);
		updateState(STATE_NAME_NAVIGATE);
	} else {
		bot.printGameMessage('Performing action...');
		const actions = client.getAvailableActions();
		for (var i = 0; i < actions.length; i++) {
			if (actions[i] == 'Talk-to') {
				bot.npcs.interactSupplied(client.getHintArrowNpc(), 'Talk-to');
				updateState(STATE_NAME_CHECK_INVENTORY);
				return;
			} else if (actions[i] == 'Search') {
				bot.objects.interactSuppliedObject(
					client.getObjectUnderCursor(),
					'Search',
				);
				updateState(STATE_NAME_CHECK_INVENTORY);
				return;
			}
		}
	}
}

// Define game tick function
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

// Define chat message function
function onChatMessage(type, name, message) {
	if (
		isReading &&
		['equip', 'wear', 'equipped'].some((keyword) =>
			message.toLowerCase().includes(keyword),
		)
	) {
		bot.printGameMessage('Equipment clue detected - dropping');
		bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Drop']);
		updateState(STATE_NAME_CHECK_INVENTORY);
	}
}

// Define required interface implementations
function onNpcAnimationChanged(npc) {}
function onActorDeath(actor) {}
function onHitsplatApplied(actor, hitsplat) {}
function onInteractingChanged(sourceActor, targetActor) {}

onStart();
setInterval(onGameTick, 1000);

client.addChatMessageHandler(onChatMessage);
