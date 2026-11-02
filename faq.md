# FAQ & troubleshooting

**Does it replace my anticheat?**
No. OmniGuard protects the *server* (crashes, dupes, lag, floods, takeovers). Run it next to an anticheat. Anticheats can
feed their detections into OmniGuard with `reportViolation`.

**A legitimate player was flagged.**
Run `/og inspect <player>` and look at `forensics/` if they were kicked. Raise that check's limit, or switch it to `cancel: true`,
`kick: false` while you investigate. For packet rates, let [Auto-Tune](auto-tune.md) learn your real traffic.

**Players with inventory mods (Item Scroller, mouse tweaks) get click-rate alerts.**
Raise `packet-rate.limits.CLICK_WINDOW` (the burst matters most), e.g. `"80/s burst 800"`.

**Kits trigger dupe alerts.**
The kit hands out copies of one saved, tracked item. Use `/og ledger ignore <uid>` (shown in the alert), or remove the
identity from the saved kit item.

**I run BungeeCord/Velocity.**
Leave `behind-proxy: auto`. Per-IP connection limits switch off; the proxy should run its own antibot.

**Alerts look garbled in the console.**
They are ASCII-safe since 1.0.0. Check your console's charset if colors leak.

**Folia?**
Fully supported: all world work goes through region and entity schedulers. `/og lag` is unavailable because Folia has no
global chunk view.

**Performance?**
Packet checks are lock-free and only decode packets of the types that are checked. World checks are O(1) per event,
and ledger scans are spread over time. Profile with `/spark` on your own server if you need numbers.
