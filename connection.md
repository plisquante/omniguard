# Connection shield

| Check | What it does |
|---|---|
| `connection-flood` | Per-IP connections at the Netty level; floods are blocked for 60 s |
| `login-guard` | Username pattern, per-IP login rate, accounts per IP, **rejoin cycling** (6 logins/60 s per account) |
| `alt-link` | Links accounts that share IPs and alerts when an account joins from a banned or recently punished account's IP |

## Attack mode

When connections/s, logins/s or blocked packets/s stay above `attack-mode` thresholds for `trigger-seconds`,
OmniGuard:

- multiplies connection and login limits by `limit-multiplier`;
- asks **unknown** IPs to reconnect once (between `reconnect-min-seconds` and `reconnect-max-seconds`). Real players
  pass, bots usually do not. IPs that joined before are never asked;
- groups refusal alerts into a single summary when the attack ends (`Attack mode ended after 32s, refused N connections and M logins`).

Force it with `/og attackmode on|off|auto`.

## Lockdown

`/og lockdown on` lets only already-verified IPs in. Use it while dealing with a raid or a grief wave. The setting is
saved in `state.yml` and survives restarts.

## Ban evasion

`/og alts <player>` shows every linked account; punished ones are red. `alt-link.block-evasion: true` also refuses
such logins. It is off by default because families and schools share IPs.
