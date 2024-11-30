onStart();
setInterval(onGameTick, 1000);

client.addChatMessageHandler(onChatMessage);

// Define constants
const EASY_SCROLL_BOX_ID = 24362;
const CLUE_SCROLL_EASY_ID = 2686;
const CLUE_COMPASS_ID = 30363;
const soxApi = require('sox-api'); // assuming you have installed the sox-api package

// Get a reference to the widgets object
const widgets = soxApi.widgets;

// Define the packedWidgetId, identifier, opcode, param0, and param1 variables
const packedWidgetId = 1234;
const identifier = 5678;
const opcode = 9012;
const param0 = 3456;
const param1 = 7890;

// Call the interactSpecifiedWidget function
widgets.interactSpecifiedWidget(
	packedWidgetId,
	identifier,
	opcode,
	param0,
	param1,
);
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

// Define game tick function
function onGameTick() {
	bot.printGameMessage('Executed JS onGameTick Method');
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

// Define inventory check function
function handleInventoryCheck() {
	console.log('handleInventoryCheck() called'); // DEBUG: Log when the inventory check is triggered
	if (!hasTimedOut()) return; // DEBUG: Log a message indicating that the check timed out

	const hasClueScroll = checkInventoryForItem(CLUE_SCROLL_EASY_ID);
	console.log(
		`checkInventoryForItem(CLUE_SCROLL_EASY_ID) result: ${hasClueScroll}`,
	); // DEBUG: Log the result of checking for clue scroll
	if (hasClueScroll) {
		updateState(STATE_NAME_READ_CLUE);
		return;
	}

	const hasClueBox = checkInventoryForItem(EASY_SCROLL_BOX_ID);
	console.log(
		`checkInventoryForItem(EASY_SCROLL_EASY_ID) result: ${hasClueBox}`,
	); // DEBUG: Log the result of checking for clue box
	if (!hasClueBox && !hasClueScroll) {
		bot.printGameMessage('No clue scroll or box found');
		return;
	}

	if (hasClueBox) {
		updateState(STATE_NAME_OPEN_BOX);
		return;
	}
}

// Define open box function
function handleOpenBox() {
	console.log('handleOpenBox() called'); // DEBUG: Log when the open box is triggered

	if (!hasTimedOut()) return; // DEBUG: Log a message indicating that the box timed out

	bot.inventory.interactWithIds([EASY_SCROLL_BOX_ID], ['Open']);
	console.log(`interactWithIds(EASY_SCROLL_BOX_ID, ['Open']) called`); // DEBUG: Log when interacting with the clue box
	updateState(STATE_NAME_CHECK_INVENTORY);
}

// Define read clue function
function handleReadClue() {
	console.log('handleReadClue() called'); // DEBUG: Log when the read clue is triggered

	if (!hasTimedOut()) return; // DEBUG: Log a message indicating that the clue timed out

	bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Read']);
	console.log(`interactWithIds(CLUE_SCROLL_EASY_ID, ['Read']) called`); // DEBUG: Log when interacting with the clue scroll
	isReading = true;
	updateState(STATE_NAME_NAVIGATE);
}

// Define navigation function
function handleNavigation() {
	console.log('handleNavigation() called'); // DEBUG: Log when the navigation is triggered

	if (!hasTimedOut()) return; // DEBUG: Log a message indicating that the navigation timed out

	const npc = client.getHintArrowNpc();
	if (npc !== null) {
		talkToHintArrowNPC(npc);
		console.log(`talkToHintArrowNPC(${npc}) called`); // DEBUG: Log when talking to the hint arrow NPC
	} else {
		bot.printGameMessage('No NPC with Hint Arrow found');
	}
}

// Define action function
function handleAction() {
	console.log('handleAction() called'); // DEBUG: Log when the action is triggered

	if (!hasTimedOut()) return; // DEBUG: Log a message indicating that the action timed out

	if (isReading) {
		currentClueText = '';
		isReading = false;
		updateState(STATE_NAME_CHECK_INVENTORY);
		console.log('action while reading clue - resetting'); // DEBUG: Log when resetting the state
		return;
	}

	const hasSpade = checkInventoryForItem(952);
	console.log(`checkInventoryForItem(952) result: ${hasSpade}`); // DEBUG: Log the result of checking for spade

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
