# Installation

## Requirements

| | Supported |
|---|---|
| Server | Spigot, Paper, Purpur, Folia |
| Minecraft | 1.17.1 → 26.x |
| Java | 17+ (Minecraft 26.x itself needs Java 25) |
| Dependencies | none (PacketEvents and Adventure are shaded and relocated) |
| Works next to | ViaVersion, ProtocolLib, PlaceholderAPI, LuckPerms, anticheats |

## Steps

1. Stop the server.
2. Copy `OmniGuard-x.y.z.jar` into `plugins/`.
3. Start the server. You should see `OmniGuard x.y.z enabled on Paper in … ms`.
4. Run `/og doctor` in game or in the console.

!> Never install or update OmniGuard with `/reload` or plugin managers. Netty handlers must be injected while the server starts.

## Behind a proxy (BungeeCord / Velocity)

`checks.connection-flood.behind-proxy: auto` detects forwarding (spigot.yml `bungeecord`, Paper Velocity settings).
In proxy mode, per-IP connection limits switch off because all traffic comes from the proxy. Every other protection keeps working,
including per-IP *login* limits, which use the forwarded player IP.

## Updating

Replace the jar and restart. New config keys fall back to their defaults until you add them. `/og reload` lists
anything it had to fall back on.

## Files

| Path | Content |
|---|---|
| `config.yml` | All settings (never rewritten by OmniGuard) |
| `lang/en.yml`, `lang/tr.yml` | Messages |
| `state.yml` | In-game toggles, learned limits, lockdown |
| `logs/<date>.log` | Every alert |
| `forensics/<date>/*.txt` | Evidence of each punishment |
| `reports/<date>.txt` | Daily security report |
| `ledger/` | Ignored and compromised item identities |
| `alts.yml`, `verified-ips.txt` | Account links, verified IPs |
