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
        "dnd4e.updateItem"
      ]
    }
  );

  Hooks.on("dnd4e.usePower", usePower);
  Hooks.on("updateItem", updateItem);
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
  return _executeAppliedEffects(actor, "dnd4e.usePower", { rolls, data });
}

/* -------------------------------------------------- */

/**
 * On update of item.
 * @param {Roll[]} rolls    The damage rolls.
 * @param {object} data     Roll configuration data.
 */
async function updateItem(rolls, data) {
  debugger;
  const actor = data.subject?.item?.actor;
  if (!actor) return;
  return _executeAppliedEffects(actor, "updateItem", { rolls, data });
}
