import { FishingSpot, FishingMethod } from '@deafwave/osrs-botmaker-types';

// Enum to represent all available fishing methods
enum FishingOption {
    SMALL_NET = "Small Net",
    BIG_NET = "Big Net",
    FISHING_ROD = "Fishing Rod",
    FLY_FISHING_ROD = "Fly Fishing Rod",
    CAGE = "Cage",
    HARPOON = "Harpoon",
    BAREHAND = "Barehand",
    KARAMBWAN_VESSEL = "Karambwan Vessel"
}

// Configuration class that will create the UI elements
class Config {
    fishingMethod: FishingOption = FishingOption.SMALL_NET;
    maxDistance: number = 20;
    enableDebug: boolean = false;
}

// Create a new configuration instance
const config = new Config();

// Mapping of fishing methods to their animation IDs
const FISHING_ANIMATIONS: Record<FishingOption, number> = {
    [FishingOption.SMALL_NET]: 621,
    [FishingOption.BIG_NET]: 620,
    [FishingOption.FISHING_ROD]: 623,
    [FishingOption.FLY_FISHING_ROD]: 622,
    [FishingOption.CAGE]: 619,
    [FishingOption.HARPOON]: 618,
    [FishingOption.BAREHAND]: 624,
    [FishingOption.KARAMBWAN_VESSEL]: 1193
};

// Mapping of fishing methods to their spot IDs and actions
const FISHING_CONFIGS: Record<FishingOption, {spotIds: number[], action: string}> = {
    [FishingOption.SMALL_NET]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1528, net.runelite.api.NpcID.FISHING_SPOT_1530],
        action: "Net"
    },
    [FishingOption.BIG_NET]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1521, net.runelite.api.NpcID.FISHING_SPOT_1522],
        action: "Big Net"
    },
    [FishingOption.FISHING_ROD]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1526, net.runelite.api.NpcID.FISHING_SPOT_1527],
        action: "Bait"
    },
    [FishingOption.FLY_FISHING_ROD]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1527, net.runelite.api.NpcID.FISHING_SPOT_1525],
        action: "Lure"
    },
    [FishingOption.CAGE]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1535, net.runelite.api.NpcID.FISHING_SPOT_1536],
        action: "Cage"
    },
    [FishingOption.HARPOON]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1542, net.runelite.api.NpcID.FISHING_SPOT_1544],
        action: "Harpoon"
    },
    [FishingOption.BAREHAND]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_1542, net.runelite.api.NpcID.FISHING_SPOT_1544],
        action: "Catch"
    },
    [FishingOption.KARAMBWAN_VESSEL]: {
        spotIds: [net.runelite.api.NpcID.FISHING_SPOT_4712, net.runelite.api.NpcID.FISHING_SPOT_4713],
        action: "Fish"
    }
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
        api.printGameMessage(`Found fishing spot: ${nearestSpot.getId()} at distance ${nearestDistance}`);
    }

    return nearestSpot;
}

export function onStart(): void {
    api.printGameMessage(`Started fishing script - Using ${config.fishingMethod}`);
}

export function onGameTick(): void {
    // Skip if already fishing
    if (isPlayerFishing()) return;

    // Find and interact with nearest fishing spot
    const nearestSpot = findNearestFishingSpot();
    if (nearestSpot) {
        const fishingAction = FISHING_CONFIGS[config.fishingMethod].action;
        if (config.enableDebug) {
            api.printGameMessage(`Attempting to ${fishingAction} at spot ID: ${nearestSpot.getId()}`);
        }
        api.interact(nearestSpot, fishingAction);
    }
}