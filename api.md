# Developer API

OmniGuard exposes a typed service in Bukkit's `ServicesManager`, plus Bukkit events.

## Setup

Add the OmniGuard jar to your compile classpath (scope `provided` / `compileOnly`) and declare the dependency:

```yaml
# plugin.yml
depend: [OmniGuard]        # or softdepend
```

```java
OmniGuardService og = Bukkit.getServicesManager().load(OmniGuardService.class);
if (og == null) {
    // OmniGuard not installed
}
```

!> Only use classes in `dev.omniguard.api` and `dev.omniguard.api.event`. Everything else is internal and may change.

## OmniGuardService

| Method | Description |
|---|---|
| `version()` | Plugin version |
| `isAttackMode()` / `setAttackMode("auto"\|"on"\|"off")` | Attack mode |
| `isMonitorMode()` | Detect-only mode |
| `isLockdown()` / `setLockdown(boolean)` | Lockdown |
| `stats()` | `StatsSnapshot(packets, blocked, kicks, refusedConnections, dupes, packetsPerSecond, blockedPerSecond, trackedItems)` |
| `checks()` | Map of check id → enabled |
| `getViolationLevel(uuid, checkId)` / `getViolations(uuid)` | Current violation levels |
| `exempt(uuid, checkId, Duration)` | Temporary exemption from one check, or `"*"` for all |
| `clearExemptions(uuid)` / `isExempt(uuid, checkId)` | Manage exemptions |
| `reportViolation(player, source, detail, amount)` | Feed your own detections into OmniGuard's alerts, Discord, logs and the `external` check's punishments |
| `getLinkedAccounts(name)` | Accounts that shared an IP |
| `getItemIdentity(item)` | Ledger identity of an item |
| `trackItem(item)` | Give an item an identity now (e.g. crate rewards); call on the item's owning thread |
| `getCustody(uuid)` | Chain of custody (`CustodyStep(timeMillis, holder)`) |
| `isCompromised(uuid)` | Whether the identity was confirmed duplicated |

All methods are thread-safe except `trackItem`. Unknown check ids throw `IllegalArgumentException`.

## Examples

### Exempt a player during your launch pad

```java
og.exempt(player.getUniqueId(), "invalid-movement", Duration.ofSeconds(5));
player.setVelocity(new Vector(0, 3, 8));
```

### Report your own detection

```java
og.reportViolation(player, "MyAntiCheat", "reach 6.2 blocks", 1.0);
```

### Track crate rewards

```java
ItemStack reward = new ItemStack(Material.NETHERITE_SWORD);
UUID id = og.trackItem(reward);
player.getInventory().addItem(reward);
```

## Events

| Event | Cancellable | When |
|---|---|---|
| `OmniGuardViolationEvent` | yes (suppresses alert and punishment) | Every failed check |
| `OmniGuardPunishEvent` | yes (handle punishment yourself) | Right before a kick or punishment commands |
| `OmniGuardDupeEvent` | yes (no confiscation, no alert) | A duplicate is confirmed |
| `OmniGuardAttackModeEvent` | no | Attack mode starts or stops |

!> Violation and punish events may be **asynchronous** because packet checks run on Netty threads. Use the scheduler before touching the world. Cancelling never lets the malicious packet through.

```java
@EventHandler
public void onPunish(OmniGuardPunishEvent e) {
    if (e.getCheckId().equals("packet-rate")) {
        e.setCancelled(true);                         // no kick from OmniGuard…
        jail.send(e.getPlayerId(), e.getDetail());    // …your own handling
    }
}
```

## Static helper

`OmniGuardAPI` (static) still exists for quick reads: `isAttackMode()`, `getViolationLevel(...)`,
`getBlockedCount(...)`, `getItemIdentity(...)`, and `service()`, which returns the full `OmniGuardService`.
