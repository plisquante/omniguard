# Server hardening

## Privilege guard (`privilege-guard`)

```yaml
  privilege-guard:
    trusted-operators: [YourName, 069a79f4-44e9-4726-a5be-fca90e38aaf5]
    enforce-creative: true
```

Anyone with OP who is not listed is de-opped within seconds and alerted on. Untrusted players are kept out of
creative and spectator unless they have `omniguard.creative`. This stops the classic backdoor plugin
(`/op` through a hidden command) and stolen staff accounts. **While the list is empty the guard does nothing.**

## Fingerprint guard (`fingerprint`)

Hides `/plugins`, `/version`, `/?`, `/bukkit`, `/paper`, `/timings`… and every namespaced command
(`/minecraft:op`, `/bukkit:plugins`) from players. The commands are also removed from tab-completion. Exploit kits
use this information to pick an exploit.

## `/og doctor`

Audits your setup and rates each finding CRIT / WARN / INFO:

- `online-mode=false` without a proxy
- BungeeCord forwarding (needs a firewall) and RCON with a weak password
- Query enabled, command blocks enabled
- Operators not in `trusted-operators`
- Monitor mode on, packet layer failed, Discord alerts off
