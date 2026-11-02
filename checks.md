# All checks

OmniGuard ships **35 checks**. Each one is configured under `checks.<id>` and can be bypassed with `omniguard.bypass.<id>`. Common keys: `enabled`, `cancel`, `alert-vl`, `max-vl`, `decay-per-second`, `kick`, `instant-kick`, `commands` (see [Configuration](configuration.md)).

| Check id | Layer | Protects against | Default kick | Specific settings |
|---|---|---|---|---|
| `frame-guard` | <span class="badge b-packet">Packet</span> | Netty frame / byte flood | instant | `play-frames`, `play-bytes`, `pre-play-frames`, `pre-play-bytes`, `max-frame-bytes`, `max-pre-play-frame-bytes` |
| `connection-flood` | <span class="badge b-conn">Connection</span> | Connection flood per IP | no | `per-ip`, `block-seconds`, `behind-proxy`, `whitelist` |
| `packet-rate` | <span class="badge b-packet">Packet</span> | Packet rate limiter | at max-vl | `global`, `limits`, `configuration` |
| `packet-size` | <span class="badge b-packet">Packet</span> | Oversized packet | instant | `limits` |
| `malformed-packet` | <span class="badge b-packet">Packet</span> | Malformed packet | at max-vl | — |
| `invalid-movement` | <span class="badge b-packet">Packet</span> | Invalid movement / position crash | instant | `strict-pitch`, `max-move-per-packet` |
| `book` | <span class="badge b-packet">Packet</span> | Book exploit | instant | `max-pages`, `max-page-chars`, `max-title-chars`, `max-total-bytes` |
| `sign` | <span class="badge b-packet">Packet</span> | Sign exploit | at max-vl | `max-line-chars`, `max-lines` |
| `window-click` | <span class="badge b-packet">Packet</span> | Invalid inventory click | at max-vl | `max-changed-slots` |
| `creative` | <span class="badge b-packet">Packet</span> | Creative item exploit | at max-vl | `require-creative-mode`, `max-item-bytes`, `max-stack-size` |
| `tab-complete` | <span class="badge b-packet">Packet</span> | Tab-complete crash | at max-vl | `max-length`, `max-nesting-depth`, `max-selectors` |
| `command` | <span class="badge b-packet">Packet</span> | Crash / exploit command | no | `max-length`, `max-nesting-depth`, `blocked-patterns` |
| `chat` | <span class="badge b-packet">Packet</span> | Chat exploit | at max-vl | `max-length` |
| `plugin-message` | <span class="badge b-packet">Packet</span> | Plugin channel abuse | at max-vl | `max-channel-length`, `max-registered-channels`, `max-brand-length`, `blocked-channels` |
| `anvil` | <span class="badge b-packet">Packet</span> | Anvil rename exploit | at max-vl | `max-length` |
| `invalid-slot` | <span class="badge b-packet">Packet</span> | Out-of-range slot index | instant | — |
| `admin-packet` | <span class="badge b-packet">Packet</span> | Unauthorized admin packet | no | — |
| `interact` | <span class="badge b-packet">Packet</span> | Interaction / reach exploit | at max-vl | `max-distance`, `block-self-interact` |
| `client-settings` | <span class="badge b-packet">Packet</span> | Invalid client settings | at max-vl | `max-locale-length` |
| `item-ledger` | <span class="badge b-dupe">Dupe</span> | Duplicated item (provenance ledger) | no | `action`, `tracked-items`, `track-unstackable-enchanted`, `scan-interval-seconds`, `ignore-creative`, `custody-depth`, `ignore-worlds` |
| `gain-monitor` | <span class="badge b-dupe">Dupe</span> | Abnormal item gain | no | `window-seconds`, `thresholds` |
| `dupe-patches` | <span class="badge b-dupe">Dupe</span> | Known dupe vector | no | `block-inventory-entities-in-portals`, `close-inventories-safely`, `block-dead-player-actions`, `max-drops-per-second` |
| `redstone` | <span class="badge b-world">World</span> | Redstone clock / lag machine | no | `max-updates-per-chunk`, `throttle-seconds`, `action` |
| `piston` | <span class="badge b-world">World</span> | Piston flood | no | `max-per-chunk-per-second`, `throttle-seconds` |
| `entity-cap` | <span class="badge b-world">World</span> | Entity cap per chunk | no | `limits`, `ignore-spawn-reasons` |
| `explosion` | <span class="badge b-world">World</span> | Explosion flood | no | `max-per-chunk-per-second` |
| `chunk-ban` | <span class="badge b-world">World</span> | Chunk / book ban | no | `max-container-bytes`, `max-player-inventory-bytes`, `max-item-bytes`, `max-lectern-book-bytes` |
| `hopper` | <span class="badge b-world">World</span> | Hopper lag machine | no | `max-moves-per-chunk`, `throttle-seconds` |
| `login-guard` | <span class="badge b-conn">Connection</span> | Bot join flood | no | `name-pattern`, `max-rejoins`, `rejoin-window-seconds`, `max-accounts-per-ip`, `per-ip`, `reconnect-min-seconds`, `reconnect-max-seconds`, `whitelist` |
| `alt-link` | <span class="badge b-conn">Connection</span> | Ban evasion / linked account | no | `window-hours`, `block-evasion` |
| `privilege-guard` | <span class="badge b-server">Server</span> | Untrusted operator / creative | no | `trusted-operators`, `enforce-creative` |
| `illegal-items` | <span class="badge b-dupe">Dupe</span> | Illegal item (enchant / stack / unbreakable) | no | `fix`, `max-enchant-level`, `allow-unbreakable`, `check-stack-size`, `ignore-creative` |
| `fingerprint` | <span class="badge b-server">Server</span> | Plugin fingerprinting command | no | `blocked-commands`, `block-namespaced` |
| `chunk-gen` | <span class="badge b-world">World</span> | Chunk generation flood | no | `max-new-chunks-per-second`, `pause-seconds` |
| `external` | <span class="badge b-server">Server</span> | Reported by another plugin (API) | no | — |
