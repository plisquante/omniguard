# Test results

Date: 2026-11-02 · Build: OmniGuard 1.4.0 (PacketEvents 2.14.0 shaded)

## 1. Attack replay (Paper 1.21.11, default config)

Done with `test-harness/attacks.js` against a real Paper server. Two normal players were connected the whole
time: one calm, and one very active (20 moves/s, clicks, digging, hotbar scrolling, tab-complete, renames,
commands). Neither was flagged.

| # | Scenario | Result | Check |
|---|---|---|---|
| 1 | Book: 300 KB multi-byte book ("book ban") | Blocked + kicked | book |
| 2 | Book: 200 pages | Blocked | malformed-packet |
| 3 | Book: edit in an impossible slot | Blocked + kicked | book |
| 4 | Movement: NaN coordinates | Blocked + kicked | invalid-movement |
| 5 | Movement: coordinates outside the world | Blocked + kicked | invalid-movement |
| 6 | Movement: 10 000-block jumps (forced chunk loading) | Blocked | invalid-movement |
| 7 | Movement: impossible pitch | Blocked | invalid-movement |
| 8 | Hotbar slot 40 | Blocked + kicked | invalid-slot |
| 9 | Negative bundle index | Blocked | malformed-packet |
| 10 | Impossible inventory click | Blocked | window-click |
| 11 | 3 000 inventory clicks in one burst | Blocked + kicked | packet-rate |
| 12 | Creative item packet in survival | Blocked | creative |
| 13 | Nested NBT selector in tab-complete | Blocked | tab-complete |
| 14 | WorldEdit `//calc` DoS | Blocked | command |
| 15 | Multiverse regex ReDoS | Blocked | command |
| 16 | 300-channel REGISTER | Blocked | plugin-message |
| 17 | 200-character channel name | Blocked | plugin-message |
| 18 | 300-character sign line | Blocked | sign |
| 19 | Control characters on a sign | Blocked | sign |
| 20 | 120-character anvil rename | Blocked | anvil |
| 21 | Digging 200 000 blocks away | Blocked | interact |
| 22 | Attacking yourself | Blocked | interact |
| 23 | Command-block edit as a non-op | Blocked | admin-packet |
| 24 | 6 000 packets in a burst | Blocked + kicked | packet-rate, frame-guard |
| 25 | 60 sockets from one IP | 48/60 refused, IP blocked | connection-flood |
| 26 | 100 KB handshake frame | Connection closed before decoding | frame-guard |
| 27 | 25 bots from one IP | 21/25 refused | connection-flood, login-guard |
| 28 | Invalid username | Refused | login-guard |
| 29 | 500 logins from 100 IPs in ~4 s | Attack mode turned on automatically | attack mode |
| 30 | New real player during attack mode | Asked to reconnect once, then joined | login-guard |
| 31 | Tracked elytra copied into a chest | Duplicate detected (player + chest) | item-ledger |
| 32 | Two copies inside one inventory | Duplicate detected | item-ledger |
| 33 | 1 500 diamonds appearing from nowhere | Alert raised | gain-monitor |
| 34 | Redstone clock on 225 wires | Chunk frozen | redstone |
| 35 | 70 minecarts in one chunk | Capped at 48 | entity-cap |
| 36 | 120 TNT going off at once | Capped and throttled | entity-cap, explosion |
| 37 | 512 hoppers in one chunk | Chunk frozen for 5 s | hopper |

**37/37 handled · server stayed responsive the whole run · 0 false positives on the two normal players.**

## 2. Compatibility (`test-harness/smoke.js`)

One normal player joins, moves for 20 seconds and leaves. A pass needs a clean start, no disconnect, no alert
about that player and no OmniGuard error in the console.

| Server | Java | Result |
|---|---|---|
| Paper 1.17.1 | 21 | ✅ |
| Paper 1.20.4 | 21 | ✅ |
| Paper 1.21.11 | 21 | ✅ (plus the full attack replay above) |
| Folia 1.21.11 | 21 | ✅ |
| Paper 26.1.2 | 25 | ✅ |
| Folia 26.1.2 | 25 | ✅ |

## 3. Unit tests

`mvn test`: 57 tests in 18 classes (auto-tune, forensics ring and custody trail included). They cover the rate limiter, violation decay, every validator, the ledger
conflict logic, the gain tracker, the chunk counters, the alert helpers, and a check that the bundled
`config.yml` parses with **zero** problems and that `en.yml` and `tr.yml` have the same keys.

