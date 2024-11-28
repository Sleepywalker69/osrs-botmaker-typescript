// Declare globals provided by Sox's Botmaker
declare const api: {
	printGameMessage: (message: string) => void;
	interactNpc: (index: number, action: string) => void;
};

declare const client: {
	getLocalPlayer: () => PlayerType | null;
	getNpcs: () => NpcType[];
};

// Define types for RuneLite objects
interface PlayerType {
	getAnimation: () => number;
	getWorldLocation: () => LocationType;
}

interface NpcType {
	getId: () => number;
	getWorldLocation: () => LocationType;
	getIndex: () => number;
}

interface LocationType {
	getX: () => number;
	getY: () => number;
}

// Define fishing method enum
enum FishingOption {
	SMALL_NET = 'Small Net',
	BIG_NET = 'Big Net',
	FISHING_ROD = 'Fishing Rod',
	FLY_FISHING_ROD = 'Fly Fishing Rod',
	CAGE = 'Cage',
	HARPOON = 'Harpoon',
	BAREHAND = 'Barehand',
	KARAMBWAN_VESSEL = 'Karambwan Vessel',
}

// Configuration class with type safety
class Config {
	fishingMethod: FishingOption;
	maxDistance: number;
	enableDebug: boolean;

	constructor() {
		this.fishingMethod = FishingOption.SMALL_NET;
		this.maxDistance = 20;
		this.enableDebug = false;
	}
}

// Create config instance
const config = new Config();

// Animation IDs for fishing
const FISHING_ANIMATIONS: { [key: string]: number } = {
	'Small Net': 621,
	'Big Net': 620,
	'Fishing Rod': 623,
	'Fly Fishing Rod': 622,
	Cage: 619,
	Harpoon: 618,
	Barehand: 624,
	'Karambwan Vessel': 1193,
};

// Fishing spot configurations
const FISHING_CONFIGS: {
	[key: string]: { spotIds: number[]; action: string };
} = {
	'Small Net': {
		spotIds: [1517, 1518],
		action: 'Net',
	},
	'Big Net': {
		spotIds: [1520, 1521],
		action: 'Big Net',
	},
	'Fishing Rod': {
		spotIds: [1517, 1518],
		action: 'Bait',
	},
	'Fly Fishing Rod': {
		spotIds: [1517, 1518],
		action: 'Lure',
	},
	Cage: {
		spotIds: [1535, 1536],
		action: 'Cage',
	},
	Harpoon: {
		spotIds: [1542, 1544],
		action: 'Harpoon',
	},
	Barehand: {
		spotIds: [1542, 1544],
		action: 'Catch',
	},
	'Karambwan Vessel': {
		spotIds: [4712, 4713],
		action: 'Fish',
	},
};

/**
 * Checks if player is currently fishing
 */
function isPlayerFishing() {
	const player = client.getLocalPlayer();
	if (!player) return false;

	const animation = player.getAnimation();
	return animation === FISHING_ANIMATIONS[config.fishingMethod];
}

/**
 * Find nearest valid fishing spot
 */
function findNearestFishingSpot() {
	const player = client.getLocalPlayer();
	if (!player) return -1;

	const playerLoc = player.getWorldLocation();
	const playerX = playerLoc.getX();
	const playerY = playerLoc.getY();

	let nearestSpot = -1;
	let nearestDistance = config.maxDistance;

	const validSpotIds = FISHING_CONFIGS[config.fishingMethod].spotIds;
	const npcs = client.getNpcs();

	for (const npc of npcs) {
		// Important: Convert getId() result to number explicitly
		if (!npc || !validSpotIds.includes(Number(npc.getId()))) continue;

		const npcLoc = npc.getWorldLocation();
		const distance =
			Math.abs(playerX - npcLoc.getX()) +
			Math.abs(playerY - npcLoc.getY());

		if (distance < nearestDistance) {
			nearestDistance = distance;
			// Important: Convert getIndex() result to number explicitly
			nearestSpot = Number(npc.getIndex());
		}
	}

	return nearestSpot;
}

export function onStart() {
	api.printGameMessage('Started AIO Fishing script');
}

export function onGameTick() {
	if (isPlayerFishing()) {
		return;
	}

	const spotIndex = findNearestFishingSpot();
	if (spotIndex === -1) {
		return;
	}

	// Important: Use string values directly for the action
	const action = FISHING_CONFIGS[config.fishingMethod].action;

	// Convert arguments to primitive types explicitly
	api.interactNpc(Number(spotIndex), String(action));
}
