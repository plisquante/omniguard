# Item Ledger & anti-dupe

## How the ledger works

1. **Identity.** Valuable unstackable items (elytra, totems, tridents, maces, netherite gear, and every enchanted unstackable
   item by default) get a random UUID in their persistent data. Players cannot see it, and stacking is unaffected.
2. **Sightings.** Online inventories, ender chests, cursors and the contents of shulkers and bundles are scanned in the
   background, spread over `scan-interval-seconds`. Containers are scanned when opened and closed.
3. **Detection.**
   - The same identity **twice in one holder** is a certain dupe.
   - The same identity in **two holders** within the window is checked again on each holder's own thread. On Folia
     this happens twice, one second apart, so an item that is simply being moved never counts as a dupe.
4. **Action.** `ALERT` (default) or `REMOVE_COPY` (confiscates the copy that showed up last).

## Chain of custody

Each identity remembers its last `custody-depth` holders. Dupe alerts (in game, log file and Discord) include the
chain, e.g. `player Steve → chest world 10 64 -3 → player Alex`. Use `/og ledger trace` to look at any item.

## Creative and kits

Items handled by creative-mode players get a fresh identity, so creative cloning is never reported. If a kit
plugin hands out copies of one saved item, `/og ledger ignore <uid>` silences that template.

## Gain monitor

For stackable valuables (`gain-monitor.thresholds`), OmniGuard compares inventory + ender chest + shulker contents
over a window, minus gains that a legitimate source explains: pickups, crafting, furnaces, trades and container
withdrawals. It is alert-only.

## Known dupe patches (`dupe-patches`)

- Inventory entities (chest donkeys, llamas, chest minecarts and boats) cannot go through portals while loaded.
- Inventories close safely on quit, world change, owner death, vehicle break, block break/explosion and chunk unload.
- No inventory actions while dead.
- Drop-spam rate limit.

## Illegal items (`illegal-items`)

Survival items with enchantments above `max-enchant-level`, stacks larger than allowed or (optionally) unbreakable
flags are repaired on join, inventory close, container open and pickup.
