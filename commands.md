# Commands & permissions

`/omniguard`, alias `/og`. Players without permission cannot see or tab-complete it.

| Command | Permission | Description |
|---|---|---|
| `/og status` | `omniguard.admin` | Live dashboard: packets/s, blocked/s, kicks, dupes, attack and monitor mode, top checks |
| `/og gui` | `omniguard.admin` | Turn every check on or off in-game (stored in `state.yml`) |
| `/og alerts` | `omniguard.alerts` | Toggle your own alerts |
| `/og inspect <player>` | `omniguard.admin` | Client version, brand, ping, IP, bypasses, current violation levels |
| `/og ledger info` | `omniguard.admin` | Identity of the item in your hand |
| `/og ledger trace [uid]` | `omniguard.admin` | Chain of custody of an item |
| `/og ledger scan <player>` | `omniguard.admin` | Scan a player right now |
| `/og ledger ignore <uid>` | `omniguard.admin` | Ignore an identity (e.g. a kit template) |
| `/og tune [apply\|reset]` | `omniguard.admin` | Learned packet limits |
| `/og alts <player>` | `omniguard.admin` | Linked accounts (punished in red) |
| `/og lockdown <on\|off>` | `omniguard.admin` | Only verified players may join |
| `/og lag` | `omniguard.admin` | Heaviest loaded chunks (not on Folia) |
| `/og doctor` | `omniguard.admin` | Security check-up of your server configuration |
| `/og monitor <on\|off>` | `omniguard.admin` | Detect-only mode |
| `/og attackmode <auto\|on\|off>` | `omniguard.admin` | Force attack mode |
| `/og unblock <ip>` | `omniguard.admin` | Lift an IP block and verify the IP |
| `/og reload` | `omniguard.admin` | Reload config and messages; lists config problems |

## Permissions

| Permission | Default | Meaning |
|---|---|---|
| `omniguard.admin` | op | All commands and the GUI |
| `omniguard.alerts` | op | Receive alerts |
| `omniguard.bypass` | false | Bypass **every** check (never give to players) |
| `omniguard.bypass.<check-id>` | false | Bypass one check |
| `omniguard.fingerprint.bypass` | op | May use `/plugins`, `/version`, namespaced commands |
| `omniguard.creative` | false | May be in creative without being a trusted operator |
