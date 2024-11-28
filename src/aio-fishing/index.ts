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
	afkVariation: number; // Added for natural behavior

	constructor() {
		this.fishingMethod = FishingOption.SMALL_NET;
		this.maxDistance = 20;
		this.enableDebug = false;
		this.afkVariation = 2000; // Random delay variation in ms
	}
}

// Create config instance
const config = new Config();

// Current animation IDs for OSRS fishing
const FISHING_ANIMATIONS: Record<FishingOption, number> = {
	[FishingOption.SMALL_NET]: 621,
	[FishingOption.BIG_NET]: 620,
	[FishingOption.FISHING_ROD]: 623,
	[FishingOption.FLY_FISHING_ROD]: 622,
	[FishingOption.CAGE]: 619,
	[FishingOption.HARPOON]: 618,
	[FishingOption.BAREHAND]: 624,
	[FishingOption.KARAMBWAN_VESSEL]: 1193,
};

// Fishing spot configurations
interface FishingSpotConfig {
	spotIds: number[];
	action: string;
}

const FISHING_CONFIGS: Record<FishingOption, FishingSpotConfig> = {
	[FishingOption.SMALL_NET]: {
		spotIds: [1517, 1518],
		action: 'Net',
	},
	[FishingOption.BIG_NET]: {
		spotIds: [1520, 1521],
		action: 'Big Net',
	},
	[FishingOption.FISHING_ROD]: {
		spotIds: [1517, 1518],
		action: 'Bait',
	},
	[FishingOption.FLY_FISHING_ROD]: {
		spotIds: [1517, 1518],
		action: 'Lure',
	},
	[FishingOption.CAGE]: {
		spotIds: [1535, 1536],
		action: 'Cage',
	},
	[FishingOption.HARPOON]: {
		spotIds: [1542, 1544],
		action: 'Harpoon',
	},
	[FishingOption.BAREHAND]: {
		spotIds: [1542, 1544],
		action: 'Catch',
	},
	[FishingOption.KARAMBWAN_VESSEL]: {
		spotIds: [4712, 4713],
		action: 'Fish',
	},
};

/**
 * Checks if the player is currently fishing using animation ID
 */
function isPlayerFishing(): boolean {
	const player = api.getLocalPlayer();
	if (!player) return false;

	const animation = api.getAnimation();
	return animation === FISHING_ANIMATIONS[config.fishingMethod];
}

/**
 * Calculates Manhattan distance between two points
 */
function calculateDistance(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): number {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Finds the nearest valid fishing spot and returns its index
 */
function findNearestFishingSpot(): number {
	const playerX = api.getLocalX();
	const playerY = api.getLocalY();
	if (playerX === -1 || playerY === -1) return -1;

	let nearestSpot = -1;
	let nearestDistance = config.maxDistance;

	const validSpotIds = FISHING_CONFIGS[config.fishingMethod].spotIds;
	const npcs = api.getNpcs();

	for (let i = 0; i < npcs.length; i++) {
		const npc = npcs[i];
		if (!npc || !validSpotIds.includes(npc.getId())) continue;

		const distance = calculateDistance(
			playerX,
			playerY,
			npc.getX(),
			npc.getY(),
		);

		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestSpot = i;
		}
	}

	if (config.enableDebug && nearestSpot !== -1) {
		api.log(
			`Found fishing spot at index: ${nearestSpot}, distance: ${nearestDistance}`,
		);
	}

	return nearestSpot;
}

/**
 * Adds natural variation to actions to avoid patterns
 */
function addActionDelay(): void {
	const baseDelay = 600;
	const variation = Math.floor(Math.random() * config.afkVariation);
	api.sleep(baseDelay + variation);
}

export function onStart(): void {
	api.log(`Started AIO Fishing - Method: ${config.fishingMethod}`);
}

export function onGameTick(): void {
	// Don't continue if already fishing
	if (isPlayerFishing()) return;

	// Find nearest fishing spot
	const spotIndex = findNearestFishingSpot();
	if (spotIndex === -1) return;

	// Get the fishing action for the current method
	const fishingAction = FISHING_CONFIGS[config.fishingMethod].action;

	if (config.enableDebug) {
		api.log(`Attempting to ${fishingAction} at spot index: ${spotIndex}`);
	}

	// Add natural delay variation
	addActionDelay();

	// Interact with the fishing spot
	api.clickNpc(spotIndex, fishingAction);
}
