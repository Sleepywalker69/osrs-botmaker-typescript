import {} from '@deafwave/osrs-botmaker-types';

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

// Configuration class with GUI support
class Config {
	fishingMethod: FishingOption = FishingOption.CAGE;
	maxDistance: number = 20;
	enableDebug: boolean = true;
	timeout: number = 3;
	isRunning: boolean = false; // Controls if the bot is running
	currentAction: string = 'Waiting to start...'; // Current status for overlay
	startTime: number = 0; // For tracking session duration
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
};

// Fishing spot configurations
const FISHING_CONFIGS = {
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
	// Add other configurations as needed
};

// Create configuration GUI
function createConfigGui(): void {
	// Main panel for configuration
	const panel = bot.createConfigPanel('AIO Fisher Configuration');

	// Add fishing method dropdown
	panel.addDropdown(
		'fishing-method',
		'Fishing Method',
		config.fishingMethod,
		Object.values(FishingOption),
		(value) => {
			config.fishingMethod = value as FishingOption;
		},
	);

	// Add max distance slider
	panel.addSlider(
		'max-distance',
		'Max Distance',
		config.maxDistance,
		1,
		30,
		1,
		(value) => {
			config.maxDistance = value;
		},
	);

	// Add debug mode checkbox
	panel.addCheckbox(
		'debug-mode',
		'Enable Debug',
		config.enableDebug,
		(value) => {
			config.enableDebug = value;
		},
	);

	// Add start/stop button
	panel.addButton(
		'toggle-bot',
		config.isRunning ? 'Stop Bot' : 'Start Bot',
		() => {
			config.isRunning = !config.isRunning;
			if (config.isRunning) {
				config.startTime = Date.now();
				config.currentAction = 'Starting fishing...';
			} else {
				config.currentAction = 'Bot stopped';
			}
			// Update button text
			panel.updateButton(
				'toggle-bot',
				config.isRunning ? 'Stop Bot' : 'Start Bot',
			);
		},
	);
}

// Create overlay for displaying current status
function createOverlay(): void {
	const overlay = bot.createOverlay('AIO Fisher Status');

	// Update overlay every game tick
	overlay.setContentLoader(() => {
		const runtime = Math.floor((Date.now() - config.startTime) / 1000);
		const hours = Math.floor(runtime / 3600);
		const minutes = Math.floor((runtime % 3600) / 60);
		const seconds = runtime % 60;

		return [
			`Status: ${config.currentAction}`,
			`Method: ${config.fishingMethod}`,
			`Runtime: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
			`Debug: ${config.enableDebug ? 'Enabled' : 'Disabled'}`,
		];
	});
}

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
	// Get NPCs with matching IDs
	const npcs = bot.npcs.getWithIds(npcIds);
	if (!npcs || npcs.length < 1) {
		config.currentAction = 'No fishing spots found';
		return false;
	}

	// Get the closest NPC from the list
	const closestNpc = bot.npcs.getClosest(npcs);
	if (!closestNpc) {
		config.currentAction = 'Cannot reach fishing spot';
		return false;
	}

	try {
		// Interact with the NPC using the specified action
		bot.npcs.interact(closestNpc, action);
		config.currentAction = `Fishing at ${closestNpc.getName()}`;
		return true;
	} catch (error) {
		config.currentAction = `Error: ${error.message}`;
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

// Exported functions for the bot
export function onStart(): void {
	api.printGameMessage('Started AIO Fishing script');
	createConfigGui();
	createOverlay();
}

export function onGameTick(): void {
	if (!config.isRunning) return;

	if (isPlayerIdle()) {
		fish();
	}
}
