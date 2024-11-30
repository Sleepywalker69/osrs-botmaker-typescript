import type {
	ChatMessageType,
	HeadIcon,
	NPC,
	Actor,
	Hitsplat,
	TileObject,
} from '@deafwave/osrs-botmaker-types';

const EASY_SCROLL_BOX_ID = 24362;
const CLUE_SCROLL_EASY_ID = 2677;
const CLUE_COMPASS_ID = 30363;
const SPADE_ID = 952;
const EQUIPMENT_CLUE_KEYWORDS = ['equip', 'wear', 'equipped'];

let isReading = false;
let currentClueText = '';
let currentState = 'CHECK_INVENTORY';

export function onStart(): void {
	currentState = 'CHECK_INVENTORY';
	bot.printGameMessage('Easy Clue Solver Started');
}

export function onGameTick(): void {
	switch (currentState) {
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

function handleNavigation(): void {
	if (!bot.localPlayerMoving()) {
		bot.inventory.interactWithIds([CLUE_COMPASS_ID], ['Use']);
		currentState = 'PERFORM_ACTION';
	}
}

function findMarkedNpc(): NPC | undefined {
	const allNpcs = bot.npcs.getWithIds([]);
	return allNpcs.find(
		(npc) => npc && bot.npcs.getHeadIcon(npc) === HeadIcon.QUEST,
	);
}

function findMarkedObject(): TileObject | undefined {
	const objects = bot.objects.getTileObjectsWithIds([]);
	return objects.find((object) => object && object.getClickbox());
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
		bot.objects.interactSuppliedObject(markedObject, 'Search');
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
