---
key: din-electrical-panel-labeler
slug: din-electrical-panel-labeler-en
publicSlug: din-electrical-panel-labeler
locale: en
title: DIN Electrical Panel Labels Generator
summary: A standalone HTML tool to generate printable DIN electrical panel labels at real scale.
url: https://gitlab.com/devgiants/web/din-electrical-panel-labeler
date: 2026-03-01
status: Completed
stack:
  - HTML
  - CSS
  - JavaScript
  - Print
featured: true
---

DIN Electrical Panel Labels Generator is a standalone HTML/CSS/JavaScript tool for generating printable DIN electrical panel labels at real physical scale.

The file is intentionally single-file and requires no installation, no build step, and no dependencies. It opens directly in the browser, so labels can be edited and then printed or exported to PDF at 100% scale.

The document includes DIN calibration with `1U = 17.5 mm` and provides fine-grained panel configuration:

- number of rows
- modules per row
- label height
- automatic slot positioning
- multiline text support
- monochrome SVG icons
- optional room tag
- optional background color
- JSON save/load support

Labels can include row number, position, width in modules, an icon, a room tag, a background color, and multiline text.

The project is complete and the repository is available on [GitLab](https://gitlab.com/devgiants/web/din-electrical-panel-labeler).
