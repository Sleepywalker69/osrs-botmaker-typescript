import type {
	ChatMessageType,
	NPC,
	Actor,
	Hitsplat,
	TileObject,
	HintArrowType,
} from '@deafwave/osrs-botmaker-types';

const EASY_SCROLL_BOX_ID = 24362;
const CLUE_SCROLL_EASY_ID = 2677;
const CLUE_COMPASS_ID = 30363;
const SPADE_ID = 952;
const EQUIPMENT_CLUE_KEYWORDS = ['equip', 'wear', 'equipped'];
const INTERACTION_TIMEOUT = 2400; // ms
const MAX_DISTANCE = 20;

interface State {
	name:
		| 'CHECK_INVENTORY'
		| 'OPEN_BOX'
		| 'READ_CLUE'
		| 'NAVIGATE'
		| 'PERFORM_ACTION';
	lastActionTime: number;
}

let currentState: State = {
	name: 'CHECK_INVENTORY',
	lastActionTime: 0,
};

let isReading = false;
let currentClueText = '';

export function onStart(): void {
	currentState = {
		name: 'CHECK_INVENTORY',
		lastActionTime: Date.now(),
	};
	bot.printGameMessage('Easy Clue Solver Started');
}

function hasTimedOut(): boolean {
	return Date.now() - currentState.lastActionTime > INTERACTION_TIMEOUT;
}

function updateState(newState: State['name']): void {
	currentState = {
		name: newState,
		lastActionTime: Date.now(),
	};
}

function checkInventoryForItem(itemId: number): boolean {
	const items = bot.inventory.interactWithIds([itemId], []);
	return items !== undefined && items !== null;
}

function hasObjectAction(object: TileObject, action: string): boolean {
	const composition = bot.objects.getTileObjectComposition(object.getId());
	if (!composition) return false;

	const actions = composition.getActions();
	return actions.some((a) => a && a.toLowerCase() === action.toLowerCase());
}

function findMarkedObject(): TileObject | undefined {
	const objects = bot.objects.getTileObjectsWithIds([]);
	return objects.find((object) => {
		if (!object) return false;
		const hintArrowType = bot.client.getHintArrowType();
		return (
			hintArrowType === HintArrowType.NONE &&
			object.getClickbox() !== null
		);
	});
}

function handleInventoryCheck(): void {
	if (!hasTimedOut()) return;

	const hasClueScroll = checkInventoryForItem(CLUE_SCROLL_EASY_ID);
	const hasClueBox = checkInventoryForItem(EASY_SCROLL_BOX_ID);
	const hasClueCompass = checkInventoryForItem(CLUE_COMPASS_ID);

	if (!hasClueScroll && !hasClueBox) {
		bot.printGameMessage('No clue scroll or box found');
		return;
	}

	if (hasClueBox) {
		updateState('OPEN_BOX');
		return;
	}

	if (hasClueScroll && !isReading) {
		updateState('READ_CLUE');
		return;
	}

	if (hasClueCompass) {
		updateState('NAVIGATE');
	}
}

function handleOpenBox(): void {
	if (!hasTimedOut()) return;

	bot.inventory.interactWithIds([EASY_SCROLL_BOX_ID], ['Open']);
	updateState('CHECK_INVENTORY');
}

function handleReadClue(): void {
	if (!hasTimedOut()) return;

	bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Read']);
	isReading = true;
	updateState('CHECK_INVENTORY');
}

function handleNavigation(): void {
	if (!hasTimedOut()) return;

	if (!bot.localPlayerMoving()) {
		bot.inventory.interactWithIds([CLUE_COMPASS_ID], ['Use']);
		updateState('PERFORM_ACTION');
	}
}

function talkToHintArrowNPC(): boolean {
	const npc = bot.client.getHintArrowNpc();
	if (npc !== null) {
		bot.npcs.interactSupplied(npc, 'Talk-to');
		return true;
	}
	return false;
}

function handleMarkedObject(): boolean {
	const markedObject = findMarkedObject();
	if (!markedObject) return false;

	if (hasObjectAction(markedObject, 'Open')) {
		bot.objects.interactSuppliedObject(markedObject, 'Open');
		return true;
	}

	bot.objects.interactSuppliedObject(markedObject, 'Search');
	return true;
}

function handleAction(): void {
	if (!hasTimedOut()) return;

	if (bot.localPlayerMoving()) {
		return;
	}

	// Try talking to NPCs first
	if (talkToHintArrowNPC()) {
		updateState('CHECK_INVENTORY');
		isReading = false;
		return;
	}

	// Then try interacting with objects
	if (handleMarkedObject()) {
		updateState('CHECK_INVENTORY');
		isReading = false;
		return;
	}

	// Finally try digging if we have a spade and clue indicates it
	const hasSpade = checkInventoryForItem(SPADE_ID);
	if (hasSpade && currentClueText.toLowerCase().includes('dig')) {
		bot.printGameMessage('Digging at location');
		bot.inventory.interactWithIds([SPADE_ID], ['Dig']);
		updateState('CHECK_INVENTORY');
		isReading = false;
		return;
	}

	bot.printGameMessage('No action found - resetting');
	updateState('CHECK_INVENTORY');
	isReading = false;
}

export function onGameTick(): void {
	switch (currentState.name) {
		case 'CHECK_INVENTORY': {
			handleInventoryCheck();
			break;
		}
		case 'OPEN_BOX': {
			handleOpenBox();
			break;
		}
		case 'READ_CLUE': {
			handleReadClue();
			break;
		}
		case 'NAVIGATE': {
			handleNavigation();
			break;
		}
		case 'PERFORM_ACTION': {
			handleAction();
			break;
		}
	}
}

export function onChatMessage(
	_type: ChatMessageType,
	_name: string,
	message: string,
): void {
	if (_type === ChatMessageType.GAMEMESSAGE && isReading) {
		currentClueText = message;
		isReading = false;

		if (
			EQUIPMENT_CLUE_KEYWORDS.some((keyword) =>
				message.toLowerCase().includes(keyword),
			)
		) {
			bot.printGameMessage('Equipment clue detected - dropping');
			bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Drop']);
			updateState('CHECK_INVENTORY');
			return;
		}

		updateState('NAVIGATE');
	}
}

// Required interface implementations
export function onNpcAnimationChanged(_npc: Actor): void {}
export function onActorDeath(_actor: Actor): void {}
export function onHitsplatApplied(_actor: Actor, _hitsplat: Hitsplat): void {}
export function onInteractingChanged(
	_sourceActor: Actor,
	_targetActor: Actor,
): void {}
