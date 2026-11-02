# OmniGuard

**All-in-one security for Spigot, Paper, Purpur and Folia, Minecraft 1.17.1 → 26.x.**
One jar, no dependencies, Java 17+.

| Layer | What it stops |
|---|---|
| <span class="badge b-packet">Packet firewall</span> | Crash exploits, book bans, NaN/out-of-world movement, packet and byte floods, invalid slots/clicks, crash commands, channel abuse. All handled on the network thread, before the server works on them |
| <span class="badge b-dupe">Anti-dupe</span> | **Item Provenance Ledger**: valuable items carry an invisible identity, so a dupe is caught *however* it was made. Includes chain of custody, gain monitor, known dupe patches and illegal-item repair |
| <span class="badge b-world">World shield</span> | Redstone clocks, piston and hopper floods, entity caps, explosion floods, chunk and book bans, chunk-generation floods. Limits tighten automatically when TPS drops |
| <span class="badge b-conn">Connection shield</span> | Connection and login floods, automatic attack mode, ban-evasion links, rejoin cycling, lockdown |
| <span class="badge b-server">Hardening</span> | Untrusted OPs, plugin fingerprinting, `/og doctor` configuration audit |

## Why admins pick it

- **Proof, not promises.** Every release is replayed against a real Paper server: 37/37 exploit scenarios handled with 0 false positives on legitimate players. See [Test results](testing.md).
- **Low false positives by design.** Violation levels decay over time, `monitor-mode` lets you observe before blocking, and an internal error never punishes a player.
- **Learns your server.** [Auto-Tune](auto-tune.md) builds packet limits from your own players' real traffic.
- **Evidence.** Every punishment saves the connection's last 64 packets to a file.
- **Built for developers.** A typed [service API](api.md) with events, exemptions and ledger access.

## Quick start

1. Put `OmniGuard-x.y.z.jar` in `plugins/` and restart (do not use `/reload`).
2. Run `/og doctor` and fix anything marked **CRIT**.
3. Add your staff to `checks.privilege-guard.trusted-operators`.
4. Optional: add a Discord webhook. See [Alerts](alerts.md).
