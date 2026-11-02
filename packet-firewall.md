# Packet firewall

Runs on Netty event loops through a shaded PacketEvents listener. Nothing here touches the world, so it is
lock-free and Folia-safe.

## Layers

1. **Frame guard** (`frame-guard`): a Netty handler right after Minecraft's frame splitter. It counts frames and bytes per
   connection, separately for pre-play (handshake/status/login) and play. A flood is cut off **before any packet is decoded**,
   and the IP is blocked for `connection-flood.block-seconds`.
2. **Connection flood** (`connection-flood`): connections (including server-list pings) per IP.
3. **Rate** (`packet-rate`): a token bucket per packet type plus a global bucket per player.
4. **Size** (`packet-size`): decoded body size per packet type.
5. **Content checks**: decode the packet and validate it.

| Check | Examples of what is refused |
|---|---|
| `invalid-movement` | NaN/∞ coordinates, outside ±30 000 000, impossible pitch, >160 blocks in one packet without a teleport |
| `book` | >100 pages, >1024 chars/page, multi-byte bombs (>120 KB), impossible slots |
| `sign`, `anvil`, `chat` | Over-long text, control characters, formatting-code injection |
| `window-click` | Mode/button combinations no client produces, slots out of range, >128 changed slots |
| `creative` | Creative packets outside creative, >64 KB items, stack >99 |
| `tab-complete`, `command` | Nested selector bombs, WorldEdit `//calc`, Multiverse ReDoS, PEX/HD exploits (regex list) |
| `plugin-message` | Long channel names, >128 registered channels, legacy exploit channels |
| `invalid-slot` | Hotbar slot ∉ 0–8, bundle/pick indexes out of range |
| `interact` | Self-attack, impossible interaction points, digging/placing far from the player (forced chunk loads) |
| `admin-packet` | Command/structure/jigsaw/test blocks, game rules or difficulty from non-ops |
| `malformed-packet` | Anything that cannot be decoded is always dropped |

## Teleport awareness

Movement and distance checks follow the server's teleports (including relative ones), so ender pearls, `/tp`, respawns and
world changes never produce false positives.
