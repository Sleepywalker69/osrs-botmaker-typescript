/**
 * Available bindings:
 *
 * bot
 * client
 * clientThread
 * configManager
 *
 */

   //initalize values
var nextAttack = 'RANGED'
var lastAttack = 'RANGED';

var lastOverhead;

var attackCount = 0;

//echo hunleff animations
const ANIM_SWAP_MAGE = 11869
const ANIM_SWAP_RANGE = 11870



// echo hunleff npc ids
var HUNLEFF_IMMUNE = 9037;
var HUNLEFF_MELEE = 9036;
var HUNLEFF_MAGIC = 9035;
var HUNLEFF_RANGE = 9038;

// projectiles ids
var PROJECTILE_DISABLE = 1714;
var PROJECTILE_MAGIC = 3159;
var PROJECTILE_RANGE = 3161;
var PROJECTILE_INVERSION = 3164;

// Weapon IDs
var WEAPON_MELEE = 23851;
var WEAPON_IMMUNE = 30340; // dagger
var WEAPON_RANGE = 23857;
var WEAPON_MAGIC = 23854;
var WEAPON_PREFERRED = 30340;
var overheadSwapTick = 0;
var hasDagger,hasBow,hasStaff;
var shouldAttack = false;


let Prayer = net.runelite.api.Prayer


var player,currentOverhead = null;


var FoodId = 23874 ;
var Juice = [ 23885 ,23884 ,23883 ,23882];





function isGearSwapping(){
   return(bot.variables.getBooleanVariable('swapGear?'))
}


function immuneHunleffActive(){
   return(bot.npcs.getWithIds([HUNLEFF_IMMUNE])[0] !== undefined)
}

function magicHunleffActive(){
   return(bot.npcs.getWithIds([HUNLEFF_MAGIC])[0] !== undefined)
}

function rangeHunleffActive(){
   return(bot.npcs.getWithIds([HUNLEFF_RANGE])[0] !== undefined)
}

function meleeHunleffActive(){
   return(bot.npcs.getWithIds([HUNLEFF_MELEE])[0] !== undefined)
}



function equipMelee(){
   !bot.equipment.containsId(WEAPON_MELEE) ? bot.inventory.interactWithIds([WEAPON_MELEE], ['Wield']) : null;
}

function equipSpec(){
   !bot.equipment.containsId(WEAPON_IMMUNE) ? bot.inventory.interactWithIds([WEAPON_IMMUNE], ['Wield']) : null;
}

function equipPreferred(){
   !bot.equipment.containsId(WEAPON_PREFERRED) ? bot.inventory.interactWithIds([WEAPON_PREFERRED], ['Wield']) : null;
}

function equipRange(){
   !bot.equipment.containsId(WEAPON_RANGE) ? bot.inventory.interactWithIds([WEAPON_RANGE], ['Wield']): null;
}

function equipMagic(){
   !bot.equipment.containsId(WEAPON_MAGIC) ? bot.inventory.interactWithIds([WEAPON_MAGIC], ['Wield']) : null;

}

function magicProjectilePresent(){
   lastAttack = "MAGIC";
   return(bot.projectiles.getProjectilesWithIds([PROJECTILE_MAGIC])[0] != undefined)
}


function rangeProjectilePresent(){
   lastAttack = "RANGED"
   return(bot.projectiles.getProjectilesWithIds([PROJECTILE_RANGE])[0] != undefined)
}

function inversionProjectilePresent(){
   return(bot.projectiles.getProjectilesWithIds([PROJECTILE_INVERSION])[0] != undefined)
}

function ensureEnabledOverhead(overheadString){
   nextAttack = overheadString;
   if(currentOverhead !== overheadString && currentOverhead !== undefined){
      bot.printGameMessage('OTS: ' + overheadString + ' COH: ' + currentOverhead)
      overheadString == "RANGED" ? bot.prayer.togglePrayer(Prayer.PROTECT_FROM_MISSILES, true) : null;
      overheadString == "MAGIC" ? bot.prayer.togglePrayer(Prayer.PROTECT_FROM_MAGIC, true) : null;
      overheadString == "MELEE" ? bot.prayer.togglePrayer(Prayer.PROTECT_FROM_MELEE, true) : null;

      currentOverhead = overheadString;

   }

   //or the prayer matches the string input and no action is taken
}

function disableOverhead(overheadString){
   overheadString == "RANGED" ? bot.prayer.togglePrayer(Prayer.PROTECT_FROM_MISSILES, true) : null;
   overheadString == "MAGIC" ? bot.prayer.togglePrayer(Prayer.PROTECT_FROM_MAGIC, true) : null;
   overheadString == "MELEE" ? bot.prayer.togglePrayer(Prayer.PROTECT_FROM_MELEE, true) : null;
}




function swapGear(){
   if(isGearSwapping()){
      magicHunleffActive() ? equipRange() : null;
      rangeHunleffActive() ? equipMagic(): null;
      meleeHunleffActive() ? equipPreferred() : null;
      immuneHunleffActive() ? equipSpec() : null;
   }
}



function onStart() {
   bot.printGameMessage('Executed JS onStart Method');
}

function onEnd() {
   bot.printGameMessage('Executed JS onEnd Method');
}

function onGameTick() {
   //bot.printGameMessage('Executed JS onGameTick Method');
   player = client.getLocalPlayer()
   currentOverhead = player.getOverheadIcon()
   equipment = bot.equipment.getEquipment()
   let currentHP = getLocalPlayerHP(); // Get the local player's HP
   let needsFood = shouldEat(currentHP);
   let currentPray = getLocalPlayerPray();
   let needsRestore = shouldRestore(currentPray)
   let numFood = bot.inventory.getQuantityOfId(FoodId);
   let numPray = bot.inventory.getQuantityOfAllIds(Juice);
   
   Debug();

   if(inversionProjectilePresent()){
      if(currentOverhead != undefined){
         bot.printGameMessage('Disable Prayer')
         disableOverhead(currentOverhead);
      }
      bot.printGameMessage('Inversion Projectile Active ')
      // return to prevent pray enabling below.
      return
   }

   currentOverhead == undefined ?  ensureEnabledOverhead(nextAttack) : null;



   if(needsFood && numFood > 0){
      eatFood()
      return 
   }

   if(needsRestore && numPray > 0 ){
      drinkEggnog();
      return
   }
   

   swapGear();

   if(shouldAttack){
      if(!client.getLocalPlayer().isInteracting()){
         bot.npcs.interactWithIds([9035,9036,9037,9038], ['Attack'])
      }
   }



   overheadSwapTick++
}

function getLocalPlayerHP() {
   return client.getBoostedSkillLevel(net.runelite.api.Skill.HITPOINTS);
}

function getLocalPlayerPray(){
   return client.getBoostedSkillLevel(net.runelite.api.Skill.PRAYER);
}


function shouldEat(currentHP){
   let min = bot.variables.getIntVariable('Eat at Hp (0 to disable)')

   if(min == 0 || min < currentHP){
      return false
   }
   return true
}


function shouldRestore(currentPray){
   let min = bot.variables.getIntVariable('Restore at Pray (0 to disable)')
      if(min == 0 || min < currentPray){
      return false
   }
   return true
}


function eatFood(){
   if(bot.inventory.getQuantityOfId(FoodId) > 0){
      bot.inventory.interactWithIds([FoodId], ['Eat'])
   }
}

function drinkEggnog(){
      if(bot.inventory.getQuantityOfAllIds(Juice) > 0){
      bot.inventory.interactWithIds(Juice, ['Drink'])
   }
}





function onNpcAnimationChanged(npc) {
   let NPC_ID = npc.getId();
   let Animation = npc.getAnimation();
   let validNPC;
   if(NPC_ID == HUNLEFF_MELEE || NPC_ID == HUNLEFF_RANGE || NPC_ID == HUNLEFF_MAGIC || NPC_ID == HUNLEFF_IMMUNE){
      validNPC = true
   }else{
      validNPC = false
   }

   if(validNPC){
      ANIM_SWAP_MAGE == Animation ? ensureEnabledOverhead("MAGIC"):null;
      ANIM_SWAP_RANGE == Animation ? ensureEnabledOverhead("RANGED"):null;
   }
}


function Debug(){

   if (!bot.equipment) {
      bot.printGameMessage('Cum');
      return;
   }

   printEquipment();
   printHunleffProtection();
   printOverheads()
}


function enablePrayer(){
   if(currentOverhead == undefined){
      ensureEnabledOverhead(nextAttack);
   }
}


function printEquipment(){

   hasDagger = bot.equipment.containsId(WEAPON_IMMUNE) || false;
   hasBow = bot.equipment.containsId(WEAPON_RANGE) || false;
   hasStaff = bot.equipment.containsId(WEAPON_MAGIC) || false;

   if (hasDagger) {
      bot.printGameMessage('Dagger Currently Equipped');
   }
   if (hasBow) {
      bot.printGameMessage('Bow Currently Equipped');
   }
   if (hasStaff) {
      bot.printGameMessage('Staff Currently Equipped');
   }

   if (!hasDagger && !hasBow && !hasStaff) {
      bot.printGameMessage('No recognized weapon equipped.');
   }
}




function printHunleffProtection(){
   immuneHunleffActive() ? bot.printGameMessage('Hunleff Prayer: Immune') : null;
   magicHunleffActive() ? bot.printGameMessage('Hunleff Prayer: Magic') : null;
   rangeHunleffActive() ? bot.printGameMessage('Hunleff Prayer: Range') : null;
}

function printOverheads(){
   currentOverhead !== null ? bot.printGameMessage("Current Overhead: " + currentOverhead) : bot.printGameMessage("We are not praying");
   bot.printGameMessage('Last Attack: ' + lastAttack);
   bot.printGameMessage('Expected Next Attack: ' + nextAttack);
}

function onActorDeath(actor) {
   //bot.printGameMessage('Executed JS onActorDeath Method');
}

function onHitsplatApplied(actor, hitsplat) {
   //bot.printGameMessage('Executed JS onHitsplatApplied Method');
}

function onInteractingChanged(sourceActor, targetActor) {
   //bot.printGameMessage('Executed JS onInteractingChanged Method');
}

function onChatMessage(type, name, message) {
   //bot.printGameMessage('Executed JS onChatMessage Method: ' + name);
}