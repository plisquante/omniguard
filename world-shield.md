# World shield

All limits are per chunk and per second, and thread-safe for Folia. When TPS falls below
`world-shield.low-tps-threshold`, every limit is multiplied by `low-tps-multiplier`.

| Check | Default | Action |
|---|---|---|
| `redstone` | 900 updates/chunk/s | Freeze redstone in the chunk for 10 s (`action: BREAK` also breaks the trigger) |
| `piston` | 120 moves/chunk/s | Freeze pistons for 10 s |
| `hopper` | 400 item moves/chunk/s | Freeze hoppers for 5 s |
| `explosion` | 40 primes/chunk/s | Cancel extra explosions |
| `entity-cap` | items 600, xp 200, vehicles 48, armor stands 48, falling blocks 120, projectiles 160, TNT 80, mobs 120, hanging 64 | Cancel new spawns |
| `chunk-ban` | container / player inventory 2 MB, item 400 KB, lectern book 120 KB | Refuse the insertion |
| `chunk-gen` | 60 new chunks/s server-wide | Pause elytra firework boosts for 15 s |

`/og lag` lists the heaviest loaded chunks to help you find the source.
