# Not a video the browser can open

`menu-screens.mp4` is named .mp4 but is not one. Its first byte is 0x47 — the
MPEG-2 Transport Stream sync byte — and it contains no `ftyp`, `moov` or `mdat`
box anywhere. It is a raw .ts stream with an .mp4 extension, which is why it
rendered as an empty black frame on the page while its caption sat underneath.

Re-export it as H.264 MP4 (1080p is plenty; the page never shows it larger than
about 1200px) and drop it back in the folder as `menu-screens.mp4`. Aim under
2 MB — the original was 9.6.

`npm run images` now checks every .mp4 for an `ftyp` box and moves anything
without one in here, so this cannot silently ship again.
