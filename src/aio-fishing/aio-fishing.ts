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

// Define proper types for our configuration
class Config {
	// Explicitly declare types for our properties
	fishingMethod: FishingOption;
	maxDistance: number;
	enableDebug: boolean;

	constructor() {
		this.fishingMethod = FishingOption.SMALL_NET;
		this.maxDistance = 20;
		this.enableDebug = false;
	}
}

// Create a type-safe config instance
const config = new Config();

// Type-safe animation mapping
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

// Type-safe fishing configurations
interface FishingSpotConfig {
	spotIds: number[];
	action: string;
}

const FISHING_CONFIGS: Record<FishingOption, FishingSpotConfig> = {
	[FishingOption.SMALL_NET]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1517,
			net.runelite.api.NpcID.FISHING_SPOT_1518,
		],
		action: 'Net',
	},
	[FishingOption.BIG_NET]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1520,
			net.runelite.api.NpcID.FISHING_SPOT_1521,
		],
		action: 'Big Net',
	},
	[FishingOption.FISHING_ROD]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1517,
			net.runelite.api.NpcID.FISHING_SPOT_1518,
		],
		action: 'Bait',
	},
	[FishingOption.FLY_FISHING_ROD]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1517,
			net.runelite.api.NpcID.FISHING_SPOT_1518,
		],
		action: 'Lure',
	},
	[FishingOption.CAGE]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1535,
			net.runelite.api.NpcID.FISHING_SPOT_1536,
		],
		action: 'Cage',
	},
	[FishingOption.HARPOON]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1542,
			net.runelite.api.NpcID.FISHING_SPOT_1544,
		],
		action: 'Harpoon',
	},
	[FishingOption.BAREHAND]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_1542,
			net.runelite.api.NpcID.FISHING_SPOT_1544,
		],
		action: 'Catch',
	},
	[FishingOption.KARAMBWAN_VESSEL]: {
		spotIds: [
			net.runelite.api.NpcID.FISHING_SPOT_4712,
			net.runelite.api.NpcID.FISHING_SPOT_4713,
		],
		action: 'Fish',
	},
};

function isPlayerFishing(): boolean {
	const player = client.getLocalPlayer();
	if (!player) return false;

	const animation = player.getAnimation();
	return animation === FISHING_ANIMATIONS[config.fishingMethod];
}

function findNearestFishingSpot(): net.runelite.api.NPC | null {
	const player = client.getLocalPlayer();
	if (!player) return null;

	const playerLocation = player.getWorldLocation();
	let nearestSpot: net.runelite.api.NPC | null = null;
	let nearestDistance = config.maxDistance;

	const npcs = client.getNpcs();
	const validSpotIds = FISHING_CONFIGS[config.fishingMethod].spotIds;

	for (const npc of npcs) {
		if (!npc || !validSpotIds.includes(npc.getId())) continue;

		const spotLocation = npc.getWorldLocation();
		const distance = playerLocation.distanceTo(spotLocation);

		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestSpot = npc;
		}
	}

	if (config.enableDebug && nearestSpot) {
		api.printGameMessage(
			`Found fishing spot: ${nearestSpot.getId()} at distance ${nearestDistance}`,
		);
	}

	return nearestSpot;
}

export function onStart(): void {
	api.printGameMessage(
		`Started fishing script - Using ${config.fishingMethod}`,
	);
}

export function onGameTick(): void {
	if (isPlayerFishing()) return;

	const nearestSpot = findNearestFishingSpot();
	if (nearestSpot) {
		const fishingAction = FISHING_CONFIGS[config.fishingMethod].action;
		if (config.enableDebug) {
			api.printGameMessage(
				`Attempting to ${fishingAction} at spot ID: ${nearestSpot.getId()}`,
			);
		}
		// Use the correct API method name
		api.interactNpc(nearestSpot.getName(), fishingAction);
	}
}
