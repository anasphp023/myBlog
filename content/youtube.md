---
title: "YouTube"
type: "youtube"
description: "Offensive-security and bug-bounty videos by Anas Hamidi — recon, web exploitation, and practical hunting, mostly in Arabic."
channel: "https://www.youtube.com/@anashamidii"
# Thumbnails are self-hosted so the page does not leak visitor IPs to Google
# (same reason the fonts are local and the embeds use youtube-nocookie).
# Add one with:
#   curl -L -o assets/images/yt-<id>.jpg "https://i.ytimg.com/vi/<id>/hqdefault.jpg"
# A video with no thumb still renders, with a placeholder tile.
videos:
  - id: "8Qdxsi_jSKo"
    title: "Dorking for Bug Bounty — Recon with Search Engines (EP 01)"
    description: "How to use search engines and dorking as your first recon tool — no tooling, and without ever touching the target. One target, many engines, different results."
    thumb: "images/youtube-latest.jpg"
  - id: "ly-5VRldmSE"
    title: "Bug Bounty for Beginners (Arabic) — How to Start"
    description: "What bug bounty is and how it works, how a security researcher looks at a website, a hands-on IDOR example, and the right way to start — step by step."
    # File not present yet: the card shows the placeholder until it is, then
    # picks it up with no further edit.
    thumb: "images/yt-ly-5VRldmSE.jpg"
---

I make videos on offensive security and bug bounty — mostly in Arabic, for beginners and beyond. If they help, subscribe so you don't miss the next one.
