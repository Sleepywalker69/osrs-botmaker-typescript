/*
    Easy Clue Scroll Solver
    - Opens scroll boxes and reads clues
    - Navigates to hint arrow locations
    - Attempts to interact with NPCs, objects, or dig spots
    - Includes path finding and stuck detection
    Version 4.0
*/

/* State Management */
var mainState = 0;
var subState = 0;
var timeout = 0;

/* Script Control Variables */
var isScriptStarted = false;
var hasClueBox = false;
var currentClueLocation = null;

/* Position Tracking for Stuck Detection */
var lastPosition = null;
var stuckTicks = 0;
const STUCK_THRESHOLD = 5; // About 3 seconds worth of game ticks

/* Main Loop */
function onGameTick() {
    if (timeout > 0) {
        return timeout--;
    }

    switch (mainState) {
        case 0:
            setupClueScroll();
            break;
        case 1:
            solveClueScroll();
            break;
        default:
            break;
    }
}

/* Core Interaction Functions - These handle all interactions with game elements */
function handleNPCInteraction() {
    var npc = client.getHintArrowNpc();
    if (npc !== null) {
        api.interactNpc(npc.getName(), "Talk-to");
        api.PrintDebugMessage("Attempting to talk to " + npc.getName());
        return true;
    }
    return false;
}

function handleObjectInteraction() {
    // Objects that need to be opened first
    var containerObjects = ["Drawers", "Closed Chest", "Wardrobe", "Cupboard"];
    // Objects that can be searched directly
    var searchObjects = ["Open Chest", "Crate", "Bookcase", "Coffin", "Bush"];

    // Try opening then searching containers
    for (var i = 0; i < containerObjects.length; i++) {
        api.interactObject(containerObjects[i], "Open");
        api.interactObject(containerObjects[i], "Search");
    }
    
    // Try direct search objects
    for (var i = 0; i < searchObjects.length; i++) {
        api.interactObject(searchObjects[i], "Search");
    }
}

function handleDigging() {
    if (!hasItem("Spade")) {
        api.PrintDebugMessage("No spade in inventory!");
        return false;
    }
    api.interactInventoryWithNames(["Spade"], ["Dig"]);
    return true;
}

/* Setup Phase Functions */
function setupClueScroll() {
    switch (subState) {
        case 0:
            checkInventoryState();
            break;
        case 1:
            openClueBox();
            break;
        case 2:
            readClueScroll();
            break;
        case 3:
            // Move straight to solving after reading
            mainState = 1;
            subState = 0;
            return timeout = 1;
        default:
            resetStates();
            break;
    }
}

/* Inventory Management Functions */
function checkInventoryState() {
    hasClueBox = hasItem("Scroll box (easy)");
    
    if (!hasClueBox && !hasClueScroll()) {
        api.PrintDebugMessage("No Scroll box or Clue scroll found in inventory!");
        return timeout = 10;
    }

    subState++;
    return timeout = 1;
}

function hasItem(itemName) {
    var inv = client.getItemContainer(93);
    if (inv != null) {
        var items = inv.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item != null) {
                var itemComp = client.getItemDefinition(item.getId());
                if (itemComp && itemComp.getName().includes(itemName)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function hasClueScroll() {
    return hasItem("Clue scroll (easy)");
}

/* Item Interaction Functions */
function openClueBox() {
    if (!hasItem("Scroll box (easy)")) {
        subState++;
        return timeout = 1;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    api.interactInventoryWithNames(["Scroll box (easy)"], ["Open"]);
    subState++;
    return timeout = 2;
}

function readClueScroll() {
    if (!hasClueScroll()) {
        return timeout = 1;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    api.interactInventoryWithNames(["Clue scroll (easy)"], ["Read"]);
    subState++;
    return timeout = 2;
}

/* Clue Solving Functions */
function solveClueScroll() {
    switch (subState) {
        case 0:
            activateCompass();
            break;
        case 1:
            walkToClueLocation();
            break;
        case 2:
            performClueAction();
            break;
        default:
            resetStates();
            break;
    }
}

function activateCompass() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    api.interactInventoryWithNames(["Clue compass"], ["Current-step"]);
    subState++;
    return timeout = 2;
}

function walkToClueLocation() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    var hintArrow = client.getHintArrowPoint();
    if (!hintArrow) {
        return timeout = 1;
    }

    var playerLocation = client.getLocalPlayer().getWorldLocation();
    var distance = playerLocation.distanceTo(hintArrow);
    
    // Handle stuck detection
    if (lastPosition !== null) {
        if (lastPosition.getX() === playerLocation.getX() && 
            lastPosition.getY() === playerLocation.getY()) {
            stuckTicks++;
            
            if (stuckTicks >= STUCK_THRESHOLD) {
                api.PrintDebugMessage("Detected stuck state - attempting interactions");
                performClueAction();
                stuckTicks = 0;
                return timeout = 2;
            }
        } else {
            stuckTicks = 0;
        }
    }
    
    lastPosition = playerLocation;

    // If we're close enough, move to interaction phase
    if (distance <= 2) {
        stuckTicks = 0;
        lastPosition = null;
        subState++;
        return timeout = 1;
    }

    // Keep walking toward the hint arrow
    api.walkToWorldPoint(hintArrow.getX(), hintArrow.getY());
    return timeout = 1;
}

function performClueAction() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    // Try all possible interactions in sequence
    handleNPCInteraction();
    handleObjectInteraction();
    handleDigging();

    resetStates();
    return timeout = 2;
}

/* Helper Functions */
function isPlayerBusy() {
    return (api.isWebWalking() || api.localPlayerMoving() || !api.localPlayerIdle());
}

function resetStates() {
    mainState = 0;
    subState = 0;
    timeout = 0;
    currentClueLocation = null;
    lastPosition = null;
    stuckTicks = 0;
}

/* Script Startup */
function startScript() {
    api.PrintDebugMessage("Starting Easy Clue Solver Script v4.0");
    api.PrintDebugMessage("Ensure you have:");
    api.PrintDebugMessage("1. A spade in your inventory for dig clues");
    api.PrintDebugMessage("2. Either a scroll box or clue scroll to start");
    isScriptStarted = true;
    resetStates();
}