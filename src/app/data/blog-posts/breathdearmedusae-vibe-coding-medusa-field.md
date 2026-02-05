---
slug: breathdearmedusae-vibe-coding-medusa-field
title: "How I Recreated the Google Antigravity Landing Page Particle Effect"
date: 2026-02-05
---

I started this project inspired by the **antigravity.google** homepage. The motion felt alive and intentional, so I tried to vibe code my way into something similar. The early attempts did not really land: the flow was stiff, the motion felt synthetic, and I could not get the halo and particle field to breathe the way I wanted.

## The Starting Point

Then I stumbled on a repo that was extremely close to what I was imagining: the BreathDearMedusae project by Hinarosha. It had the right energy and the right scaffolding, especially around particle motion and the halo interactions.

Link to the starting point (GitHub repo):

```
https://github.com/Hinarosha/BreathDearMedusae
```

## What Changed

After reading through the codebase, I learned about the medusae jellyfish effect in animation, and decided this was the best way to achieve the look I wanted.

I forked it and started shaping it into my own version. The big breakthrough was adding **oscillating variables** to make the movement feel organic, plus a full **settings dialog** to tweak the scene in realtime. That made it possible to dial in the animation without hardcoding endless values. It also let me experiment with cursor influence, rotation jitter, oscillation factors, and halo behavior until it felt right.

## Current Build

Preview of the current build:

```
https://breath-dear-medusae.vercel.app/
```

## Why It Matters

This is an open-source vibe collaboration, shaped with help from Gemini and Codex. It is a preview of a future world where creative coding is faster, more collaborative, and more fluid than ever.
