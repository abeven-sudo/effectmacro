import { TRIGGERS } from "../../triggers.mjs";

export default function init() {
  debugger;

  if (game.system.id !== "dnd4e") return;

  // Add D&D 4e system triggers - organized by category
  TRIGGERS.push(
    {
      label: "EFFECTMACRO.dnd4e.4eTriggers",
      options: [
        "dnd4e.usePower",
        "dnd4e.equipItem",
        "dnd4e.unequipItem",
        "dnd4e.damaged",
        "dnd4e.healed",
        "dnd4e.attackRoll"
      ]
    }
  );

  Hooks.on("dnd4e.usePower", usePower);
  Hooks.on("updateItem", equipItem);
  Hooks.on("updateItem", unequipItem);
  Hooks.on("updateActor", damaged);
  Hooks.on("updateActor", healed);
  Hooks.on("closeRollDialog", attackRoll);
}

/* -------------------------------------------------- */

/**
 * Execute all effects that affect an actor and contain this trigger.
 * This method is called on all clients, but filters out those not to execute it.
 * @param {foundry.documents.Actor} actor   The actor with the effects.
 * @param {string} hook                     The trigger name.
 * @param {object} context                  Additional context to pass to the macro.
 */
async function _executeAppliedEffects(actor, hook, context = {}) {
  if (!effectmacro.utils.isExecutor(actor)) return;

  for (const e of actor.appliedEffects.filter((e) => effectmacro.utils.hasMacro(e, hook)))
    await effectmacro.utils.callMacro(e, hook, context);
}

/* -------------------------------------------------- */

/**
 * On dnd4e power usage.
 * @param {power} item4e    The used power.
 * @param {data} data      The actor, alias, scene and token.
 */
async function usePower(power, data) {
  debugger;
//  const actor = data.subject?.item?.actor;
  const actor = game.actors.get(data.actor);
  if (!actor) return;
  return _executeAppliedEffects(actor, "dnd4e.usePower", { power, data });
}

/* -------------------------------------------------- */

/**
 * On update of item, and item is equipped.
 * @param {Roll[]} rolls    The damage rolls.
 * @param {object} data     Roll configuration data.
 */
async function equipItem(item, changed, action, id) {
  const actor = action.parent;
  if (!changed.system?.equipped) return;
  return _executeAppliedEffects(actor, "dnd4e.equipItem", { item, changed, action, id });
}


/* -------------------------------------------------- */

/**
 * On update of item, and item is unequipped.
 * @param {Roll[]} rolls    The damage rolls.
 * @param {object} data     Roll configuration data.
 */
async function unequipItem(item, changed, action, id) {
  const actor = action.parent;
  if (changed.system?.equipped) return;
  return _executeAppliedEffects(actor, "dnd4e.unequipItem", { item, changed, action, id});
}

/* -------------------------------------------------- */

/**
 * On update of Actor, and the Actor is damaged.
 * @param {Roll[]} rolls    The damage rolls.
 * @param {object} data     Roll configuration data.
 */
async function damaged(actor, changed, action, id) {
//  const actor = action.parent;
  debugger;
  if (action?.dhp > 0) return;
  return _executeAppliedEffects(actor, "dnd4e.damaged", { actor, changed, action, id });
}


/* -------------------------------------------------- */

/**
 * On update of Actor, and the Actor is healed.
 * @param {Roll[]} rolls    The damage rolls.
 * @param {object} data     Roll configuration data.
 */
async function healed(actor, changed, action, id) {
//  const actor = action.parent;
  debugger;
  if (action?.dhp < 0) return;
  return _executeAppliedEffects(actor, "dnd4e.healed", { actor, changed, action, id });
}

/* -------------------------------------------------- */

/**
 * On closing of a Roll Dialog, check if that roll was an attack roll.
 * @param {Roll[]} rolls    The damage rolls.
 * @param {object} data     Roll configuration data.
 */
async function attackRoll(rollDialog) {
  const actor = rollDialog.rollConfig.actor;
  debugger;
  if (!rollDialog.dialogData.data.isAttackRoll) return;
  return _executeAppliedEffects(actor, "dnd4e.attackRoll", { rollDialog });
}