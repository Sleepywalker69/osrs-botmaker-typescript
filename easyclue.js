// Define constants
const scrollBoxId = 2686;
const clueScrollId = 24362;
const clueCompassId = 30363;
const spadeId = 952;

function hasTimedOut(lastActionTime) {
	const currentTime = new Date().getTime();
	return currentTime - lastActionTime > 10000; // 10 seconds
}

// Define game tick function
function onGameTick() {
	bot.printGameMessage('Executed JS onGameTick Method');

	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering onGameTick function');

	const currentState = getState();
	switch (currentState.name) {
		case 'CHECK_INVENTORY':
			handleInventoryCheck(currentState);
			break;
		case 'OPEN_BOX':
			handleOpenBox(currentState);
			break;
		case 'READ_CLUE':
			handleReadClue(currentState);
			break;
		case 'NAVIGATE':
			handleNavigation(currentState);
			break;
		case 'PERFORM_ACTION':
			handleAction(currentState);
			break;
	}

	// Print a debug message to confirm we've reached the end of the function
	bot.printGameMessage('Finished onGameTick function');
}

// Define game states

function getState() {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering getState function');

	return {
		name: 'CHECK_INVENTORY',
		lastActionTime: new Date().getTime(),
		clueType: null,
	};
}

function updateState(newState) {
	const currentState = getState();
	Object.assign(currentState, newState);
	return currentState;

	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering updateState function');
}

// Define states
let isReadingClue = false;

// Define inventory check function
function handleInventoryCheck(state) {
	if (!hasTimedOut(state.lastActionTime)) return;

	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering handleInventoryCheck function');

	const hasClueScroll =
		bot.inventory.interactWithIds([clueScrollId], ['Read']).length > 0;
	if (hasClueScroll) {
		updateState({ name: 'READ_CLUE', clueType: getStateClueType() });
		isReadingClue = true;
		return;
	}
	const hasClueBox =
		bot.inventory.interactWithIds([scrollBoxId], ['Open']).length > 0;
	if (hasClueBox) {
		updateState({ name: 'OPEN_BOX' });
		return;
	}
}

// Define open box function
function handleOpenBox(state) {
	if (!hasTimedOut(state.lastActionTime)) return;

	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering handleOpenBox function');

	bot.inventory.interactWithIds([scrollBoxId], ['Open']);
	updateState({
		name: 'CHECK_INVENTORY',
		lastActionTime: new Date().getTime(),
	});
}

// Define read clue function
function handleReadClue(state) {
	if (!hasTimedOut(state.lastActionTime)) return;

	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering handleReadClue function');

	bot.inventory.interactWithIds([clueScrollId], ['Read']);
	updateState({
		name: 'CHECK_INVENTORY',
		lastActionTime: new Date().getTime(),
		clueType: getStateClueType(),
	});
}

// Define function to get clue type
function getStateClueType() {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering getStateClueType function');

	const clues = bot.inventory.getClues();
	for (var i = 0; i < clues.length; i++) {
		if (clues[i].type == 'equip') return 'EQUIP';
		else if (clues[i].type == 'wear') return 'WEAR';
		else return 'NONE';
	}
}

// Define navigation function
function handleNavigation(state) {
	if (!hasTimedOut(state.lastActionTime)) return;

	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering handleNavigation function');

	const clueCompass = bot.inventory.interactWithIds(
		[clueCompassId],
		['Click on "Current-step"'],
	);
	updateState({
		name: 'NAVIGATE',
		lastActionTime: new Date().getTime(),
		clueType: state.clueType,
	});
}

// Define function to navigate
function performNavigation() {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering performNavigation function');

	const clueCompass = bot.inventory.interactWithIds(
		[clueCompassId],
		['Click on "Current-step"'],
	);
	if (clueCompass > 0) {
		talkToHintArrowNPC();
	} else {
		bot.printGameMessage('No NPC with Hint Arrow found');
	}
}

// Define function to get NPC with hint arrow
function getHintArrowNpc() {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering getHintArrowNpc function');

	const npcList = bot.npcs.getNpcsInSight();
	for (var i = 0; i < npcList.length; i++) {
		if (npcList[i].getIsHintArrowNpc()) return npcList[i];
	}
	return null;
}

// Define function to talk to NPC with hint arrow
function talkToHintArrowNPC() {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering talkToHintArrowNPC function');

	var npc = getHintArrowNpc();
	if (npc !== null) {
		bot.npcs.interactSupplied(npc, 'Talk-to');
	} else {
		bot.printGameMessage('No NPC with Hint Arrow found');
	}
}

// Define function to check if object has action
function hasObjectAction(objectId, action) {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering hasObjectAction function');

	var objectComposition = bot.objects.getTileObjectComposition(objectId);
	var actions = objectComposition.getActions();
	for (var i = 0; i < actions.length; i++) {
		if (actions[i] && actions[i] == action) return true;
	}
	return false;
}

// Define function to perform action on object
function performObjectAction(objectId, action) {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering performObjectAction function');

	var objectComposition = bot.objects.getTileObjectComposition(objectId);
	bot.objects.interactSupplied(objectComposition, action);
}

// Define search for item in tile function
function searchForItemInTile(itemId, tileId) {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering searchForItemInTile function');

	var tileComposition = bot.tiles.getTileComposition(tileId);
	if (tileComposition && hasObjectAction(tileId, 'Search')) {
		performObjectAction(tileId, 'Search');
		return true;
	}
	return false;
}

// Define function to dig with spade
function digWithSpade() {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering digWithSpade function');

	var spade = bot.inventory.interactWithIds([spadeId], ['Use']);
	if (spade > 0) {
		bot.printGameMessage('Dug with Spade');
	} else {
		bot.printGameMessage('No Spade found');
	}
}

// Define action function
function handleAction(state) {
	// Print a debug message to confirm we're entering the function
	bot.printGameMessage('Entering handleAction function');

	if (!hasTimedOut(state.lastActionTime)) return;
	const hasSpade =
		bot.inventory.interactWithIds([spadeId], ['Use']).length > 0;
	if (state.clueType == 'EQUIP') {
		updateState({
			name: 'CHECK_INVENTORY',
			lastActionTime: new Date().getTime(),
		});
	} else if (state.clueType == 'WEAR') {
		bot.inventory.interactWithIds([clueScrollId], ['Drop']);
		updateState({
			name: 'CHECK_INVENTORY',
			lastActionTime: new Date().getTime(),
			clueType: null,
		});
	} else {
		performNavigation();
	}
}

// Define chat message function
function onChatMessage(type, name, message) {
	// Print a debug message to confirm we're entering the function
	if (
		isReadingClue &&
		['equip', 'wear', 'equipped'].some((keyword) =>
			message.toLowerCase().includes(keyword),
		)
	) {
		bot.printGameMessage('Equipment clue detected - dropping');
		bot.inventory.interactWithIds([clueScrollId], ['Drop']);
		updateState({
			name: 'CHECK_INVENTORY',
			lastActionTime: new Date().getTime(),
			clueType: null,
		});
	}
}
