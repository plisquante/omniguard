# Alerts, Discord & reports

## Where alerts go

| Channel | Setting |
|---|---|
| Staff in game (hover for details, click to `/og inspect`) | `alerts.staff`, permission `omniguard.alerts`, toggle `/og alerts` |
| Console (ASCII-safe for any host) | `alerts.console` |
| `logs/<date>.log` (kept `keep-days`) | `alerts.file-log` |
| Discord | `discord.*` |

The same alert (same player and check) is not repeated within `alerts.cooldown-millis`.

## Discord

```yaml
discord:
  enabled: true
  webhook-url: "https://discord.com/api/webhooks/…"
  categories: [PACKET, DUPE, WORLD, CONNECTION, SERVER]
  attack-mode: true
  mention-role-id: "123456789012345678"   # pinged on dupes and attack mode
```

Embeds are batched (up to 10 per request), Discord's 429 `retry_after` is respected, and during alert storms the
oldest entries are dropped with a notice. `@everyone` can never be triggered (`allowed_mentions`).

## Daily report

`reports/<date>.txt`, also posted to Discord when `daily-report.discord: true`:

```
OmniGuard daily security report — 2026-11-02
packets inspected : 18342210
actions blocked   : 4211
players kicked    : 7
connections refused: 980
dupes caught      : 1
attack-mode events: 2
top checks:
  connection-flood: 980
  packet-rate: 2100
```
