# Auto-Tune & forensics

## Auto-Tune

Default packet limits are deliberately generous. Auto-Tune measures what **your** players actually send:

- It records packets per second, per packet type and per player.
- Only players who were **never flagged** on that connection contribute, so attackers cannot teach it to be lax.
- After `auto-tune.min-samples` player-seconds (3600 ≈ one player for an hour), `/og tune` recommends
  `rate = 1.5 × p99.9` and `burst ≥ 2 × rate`. A recommendation is never below `min-rate`, and never below
  25 % of the default.
- `/og tune apply` stores the limits in `state.yml`, where they override `packet-rate.limits`. `/og tune reset` undoes it.

```
[OmniGuard] Learned from 41 233 clean player-seconds since 3h 12m ago:
 - PLAYER_POSITION_AND_ROTATION p99.9 21/s max 26/s | now 80/s burst 300 → 32/s burst 75
 - CLICK_WINDOW p99.9 18/s max 140/s | now 60/s burst 400 → 27/s burst 210
```

## Packet forensics

When a player is punished, `forensics/<date>/<player>-<time>.txt` is written:

```
OmniGuard incident report
player : Atk1
client : 1.21.11 / vanilla
check  : book
detail : book too large (122880 > 120000 bytes)

Last 4 packets (oldest first, ms relative to the last one):
   -456.4 ms  TELEPORT_CONFIRM                        1 B
   -456.0 ms  PLAYER_POSITION_AND_ROTATION           33 B
   -455.7 ms  PLAYER_LOADED                           0 B
      0.0 ms  EDIT_BOOK                          307403 B  BLOCKED
```

Use these files to answer ban appeals in a minute.
