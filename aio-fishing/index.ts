// No need to import types as they are globally available in the Botmaker environment

// Enum for fishing options
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

// Configuration class
class Config {
	fishingMethod: FishingOption = FishingOption.CAGE;
	maxDistance: number = 20;
	enableDebug: boolean = true;
	timeout: number = 3;
	isRunning: boolean = false;
	currentAction: string = 'Waiting to start...';
	startTime: number = 0;
}

const config = new Config();

// Animation IDs for different fishing methods
const FISHING_ANIMATIONS = {
	[FishingOption.SMALL_NET]: 621,
	[FishingOption.BIG_NET]: 620,
	[FishingOption.FISHING_ROD]: 623,
	[FishingOption.FLY_FISHING_ROD]: 622,
	[FishingOption.CAGE]: 619,
	[FishingOption.HARPOON]: 618,
	[FishingOption.BAREHAND]: 624,
	[FishingOption.KARAMBWAN_VESSEL]: 1193,
} as const;

// Fishing spot configurations
const FISHING_CONFIGS: Record<
	FishingOption,
	{ spotIds: number[]; action: string }
> = {
	[FishingOption.CAGE]: {
		spotIds: [
			1510, 1519, 1522, 2146, 3657, 3914, 5821, 7199, 7460, 7465, 7470,
			7946, 9173, 9174,
		],
		action: 'Cage',
	},
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

// Check if the local player is currently fishing
function isPlayerFishing(): boolean {
	const player = client.getLocalPlayer();
	if (!player) return false;

	const animation = player.getAnimation();
	return animation === FISHING_ANIMATIONS[config.fishingMethod];
}

// Checks if the local player is idle
function isPlayerIdle(): boolean {
	return !isPlayerFishing() && bot.localPlayerIdle();
}

// Click on an NPC with the specified action
function clickNpc(npcIds: number[], action: string): boolean {
	const npcs = bot.npcs.getWithIds(npcIds);
	if (!npcs || npcs.length < 1) {
		config.currentAction = 'No fishing spots found';
		if (config.enableDebug) {
			api.printGameMessage('No fishing spots found nearby');
		}
		return false;
	}

	// Find closest NPC manually since getClosest isn't available
	let closestNpc = npcs[0];
	let closestDistance = Number.MAX_VALUE;
	const player = client.getLocalPlayer();

	if (player) {
		const playerLocation = player.getWorldLocation();
		for (const npc of npcs) {
			const npcLocation = npc.getWorldLocation();
			if (playerLocation && npcLocation) {
				const distance =
					Math.abs(playerLocation.getX() - npcLocation.getX()) +
					Math.abs(playerLocation.getY() - npcLocation.getY());
				if (distance < closestDistance) {
					closestDistance = distance;
					closestNpc = npc;
				}
			}
		}
	}

	try {
		// Use interactSupplied instead of interact
		bot.npcs.interactSupplied(closestNpc, action);
		config.currentAction = `Fishing using ${action}`;
		return true;
	} catch (err) {
		const error = err as Error;
		config.currentAction = `Error: ${error?.message || 'Unknown error'}`;
		return false;
	}
}

// Main fishing function
function fish(): void {
	if (!config.isRunning) return;

	const fishingConfig = FISHING_CONFIGS[config.fishingMethod];
	if (!fishingConfig) {
		config.currentAction = 'Invalid fishing method';
		return;
	}

	if (isPlayerFishing()) {
		config.currentAction = 'Currently fishing...';
		return;
	}

	clickNpc(fishingConfig.spotIds, fishingConfig.action);
}

// Status display using game messages since overlay isn't available
function updateStatus(): void {
	if (!config.isRunning) return;

	const runtime = Math.floor((Date.now() - config.startTime) / 1000);
	const hours = Math.floor(runtime / 3600);
	const minutes = Math.floor((runtime % 3600) / 60);
	const seconds = runtime % 60;

	const status = [
		`-----------------`,
		`AIO Fisher Status`,
		`Method: ${config.fishingMethod}`,
		`Action: ${config.currentAction}`,
		`Runtime: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
		`-----------------`,
	].join('\n');

	api.printGameMessage(status);
}

// Exported functions for the bot
export function onStart(): void {
	api.printGameMessage('AIO Fishing script started');
	config.isRunning = true;
	config.startTime = Date.now();
}

export function onGameTick(): void {
	if (!config.isRunning) return;

	if (isPlayerIdle()) {
		fish();
	}

	// Update status every 4 ticks (about 2.4 seconds)
	if (client.getTickCount() % 4 === 0) {
		updateStatus();
	}
}
