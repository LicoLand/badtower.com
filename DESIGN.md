---
name: BadTower Website
description: Gold towers on warm black. A field of Stations that carry sealed units and read none of them.
colors:
  ground: "#0b0a08"
  raise: "#16130d"
  line: "#2a251b"
  ink: "#fff8ea"
  soft: "#cfc4a6"
  gold: "#ffc72e"
  gold-deep: "#f0ac0c"
  champagne: "#f2e4bb"
  on-champagne: "#17130a"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(46px, 7.4vw, 118px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(42px, 6.4vw, 100px)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.038em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, PingFang SC, Noto Sans SC, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: "999px"
  panel: "16px"
---

# Design System: BadTower Website

Updated: 2026-11-16

## Overview

BadTower is shown as what it is: infrastructure made of many towers. The home
page opens on a field of gold towers standing on a slanted board over warm
black. Sealed units hop from tower to tower along lit routes; a tower flashes
when a unit passes and never opens it. The statement stands in the clear
ground in front of the field. Product facts remain owned by the BadTower and
BadTower.js repositories.

## The field

`net.js` places the towers on a staggered grid, links each to its neighbours
and sends units along routes between the edges. `site.js` gives the field its
look: gold blocks with a lighter top and darker sides, brighter gold where a
unit passes or the pointer rests, and darker towers with a gold edge in the
ground kept clear for the header. No tower is drawn behind the words.

## Colors

Warm black is the ground and gold is the subject. Gold also marks what a
visitor can act on: the primary button, links, the current page, list markers
and focus. Champagne carries the contract section with dark ink, so the four
verbs read as a document rather than as a sign. Text on black is warm white;
secondary text is a warm grey. There are no gradients on text and no other
accent colour.

## Layout

The home page follows a visitor's questions in order: what it is (the field
and the statement), what it does (four verbs, with a unit that folds, seals
and passes through them), why it is safe to distrust (what a Station Signal
never proves), how far it is built (the five stages), how protocols attach,
and how to run one. Documentation pages use a side list of the page's sections
and a single column capped at 46rem.

## Motion

Units travel the field, the folded unit crosses the four verbs, and controls
answer presses with a small spring. The page's pause control and the
reduced-motion preference stop all of it; the field then stands still with a
few units placed on it.

## Do's and Don'ts

- **Do** keep every statement aligned with the owning product repositories.
- **Do** keep navigation, links and copy working without JavaScript.
- **Do** keep gold for towers, traffic and actions.
- **Don't** fill a reading surface with saturated gold.
- **Don't** put a product fact only in the canvas.
- **Don't** depend on external fonts, scripts or analytics.
