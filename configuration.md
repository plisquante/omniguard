# Configuration

Everything lives in `plugins/OmniGuard/config.yml`. OmniGuard never rewrites this file; in-game changes go to `state.yml`.

## How a check decides

Every detection adds to the player's **violation level (VL)** for that check. The VL cools down by
`decay-per-second`.

```yaml
checks:
  book:
    enabled: true          # run the check at all
    cancel: true           # drop the packet / action (false = observe only)
    alert-vl: 1            # alert staff from this VL on
    max-vl: 2              # punish at this VL
    decay-per-second: 0.02
    kick: true             # kick at max-vl
    instant-kick: true     # kick immediately for payloads only a crash client can send
    commands: []           # console commands run at max-vl
```

Placeholders for `commands`: `%player% %uuid% %ip% %check% %vl% %detail%`. `%detail%` is cleaned of anything
that could inject arguments.

```yaml
    commands:
      - "litebans:tempban %player% 1d Crash attempt (%check%)"
```

## Rate syntax

Rates are written as `"<per second>/s burst <burst>"`, e.g. `"60/s burst 200"`. `"40/120"` and `"40/s"` also work
(the burst defaults to twice the rate).

## Safety nets

- **Typos never disable protection.** A wrong value is replaced by the default and reported in the console and by `/og reload`.
- **Monitor mode** (`monitor-mode: true` or `/og monitor on`): everything is detected and alerted, nothing is blocked.
- **Bypass**: `omniguard.bypass` (everything) or `omniguard.bypass.<check-id>`.

## Global sections

| Section | Purpose |
|---|---|
| `alerts` | Console / staff / file log, alert cooldown |
| `discord` | Webhook, categories, attack-mode posts, role ping |
| `punishment` | Kick message, instant close |
| `attack-mode` | Thresholds and the limit multiplier during floods |
| `world-shield` | TPS threshold and multiplier for lag-machine limits |
| `forensics` | Evidence files on punishment |
| `auto-tune` | Learning requirements |
| `daily-report` | Daily summary file / Discord |
