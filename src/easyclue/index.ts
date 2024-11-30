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
const CLOSED_OBJECT_ACTION = 'Open';
const SEARCH_ITEM = [SPADE_ID, CLUE_COMPASS_ID];

let isReading = false;
let currentClueText = '';
let currentState = 'CHECK_INVENTORY';

export function onStart(): void {
	currentState = 'CHECK_INVENTORY';
	bot.printGameMessage('Easy Clue Solver Started');
}

export function onGameTick(): void {
	if (currentState === 'NAVIGATE' && bot.localPlayerDistance() > 0) {
		handleNavigation();
	} else if (currentState !== 'CHECK_INVENTORY') {
		setTimeout(() => {
			currentState = 'CHECK_INVENTORY';
		}, 10000);
	}
}

function checkInventoryForItem(itemId: number): boolean {
	const items = bot.inventory.interactWithIds([itemId], []);
	return items !== undefined && items !== null;
}

function handleInventoryCheck(): void {
	const hasClueScroll = checkInventoryForItem(CLUE_SCROLL_EASY_ID);
	const hasClueBox = checkInventoryForItem(EASY_SCROLL_BOX_ID);
	const hasClueCompass = checkInventoryForItem(CLUE_COMPASS_ID);

	if (!hasClueScroll && !hasClueBox) {
		bot.printGameMessage('No clue scroll or box found');
		return;
	}

	if (hasClueBox) {
		currentState = 'OPEN_BOX';
		return;
	}

	if (hasClueScroll && !isReading) {
		currentState = 'READ_CLUE';
		return;
	}

	if (hasClueCompass) {
		currentState = 'NAVIGATE';
		return;
	}
}

function hasObjectAction(objectId: number, action: string): boolean {
	const objectComposition = bot.objects.getTileObjectComposition(objectId);
	const actions = objectComposition.getActions();
	for (let i = 0; i < actions.length; i++) {
		if (actions[i] && actions[i].toLowerCase() === action.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function openClosedObject(objectId: number): void {
	if (hasObjectAction(objectId, CLOSED_OBJECT_ACTION)) {
		bot.objects.interactSuppliedObject(
			bot.objects.getTileObject(objectId),
			'Open',
		);
	} else if (hasObjectAction(objectId, 'Close')) {
		bot.objects.interactSuppliedObject(
			bot.objects.getTileObject(objectId),
			'Close',
		);
	}
}

function handleOpenBox(): void {
	bot.inventory.interactWithIds([EASY_SCROLL_BOX_ID], ['Open']);
	currentState = 'CHECK_INVENTORY';
}

function handleReadClue(): void {
	bot.inventory.interactWithIds([CLUE_SCROLL_EASY_ID], ['Read']);
	isReading = true;
	currentState = 'CHECK_INVENTORY';
}

function talkToHintArrowNPC(): void {
	const npc = client.getHintArrowNpc();
	if (npc !== null) {
		bot.npcs.interactSupplied(npc, 'Talk-to');
	} else {
		bot.printGameMessage('No NPC with Hint Arrow found');
	}
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

function findMarkedNpc(): NPC | undefined {
	const allNpcs = bot.npcs.getWithIds([]);
	return allNpcs.find((npc) => {
		const hintArrow = bot.client.getHintArrowNpc();
		return hintArrow && hintArrow === npc;
	});
}

function handleAction(): void {
	if (bot.localPlayerMoving()) {
		return;
	}

	const markedNpc = findMarkedNpc();
	if (markedNpc) {
		bot.printGameMessage('Found marked NPC - talking');
		bot.npcs.interactSupplied(markedNpc, 'Talk-to');
		currentState = 'CHECK_INVENTORY';
		isReading = false;
		return;
	}

	const markedObject = findMarkedObject();
	if (markedObject) {
		bot.printGameMessage('Found marked object - searching');
		openClosedObject(markedObject.id);
		currentState = 'CHECK_INVENTORY';
		isReading = false;
		return;
	}

	const hasSpade = checkInventoryForItem(SPADE_ID);
	if (hasSpade && currentClueText.toLowerCase().includes('dig')) {
		bot.printGameMessage('Digging at location');
		bot.inventory.interactWithIds([SPADE_ID], ['Dig']);
		currentState = 'CHECK_INVENTORY';
		isReading = false;
		return;
	}

	const hasSearchItem = SEARCH_ITEM.some((item) =>
		checkInventoryForItem(item),
	);
	if (hasSearchItem && currentClueText.toLowerCase().includes('search')) {
		bot.printGameMessage('Searching at location');
		talkToHintArrowNPC();
		currentState = 'CHECK_INVENTORY';
		isReading = false;
		return;
	}

	bot.printGameMessage('No action found - resetting');
	currentState = 'CHECK_INVENTORY';
	isReading = false;
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
			currentState = 'CHECK_INVENTORY';
			return;
		}

		currentState = 'NAVIGATE';
	}
}

export function onNpcAnimationChanged(_npc: Actor): void {
	// Required by interface
}

export function onActorDeath(_actor: Actor): void {
	// Required by interface
}

export function onHitsplatApplied(_actor: Actor, _hitsplat: Hitsplat): void {
	// Required by interface
}

export function onInteractingChanged(
	_sourceActor: Actor,
	_targetActor: Actor,
): void {
	// Required by interface
}
