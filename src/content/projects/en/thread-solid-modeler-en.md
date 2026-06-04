---
key: thread-solid-modeler
slug: thread-solid-modeler-en
publicSlug: thread-solid-modeler
locale: en
title: ThreadSolidModeler
summary: An Autodesk Inventor add-in that turns cosmetic threads into modeled 3D thread geometry.
url: https://github.com/devgiants/thread-solid-modeler
date: 2026-02-01
status: Completed
stack:
  - C#
  - .NET Framework 4.8
  - Autodesk Inventor
  - Windows
featured: true
---

ThreadSolidModeler is an Autodesk Inventor add-in that turns existing cosmetic threads into fully modeled 3D thread geometry.

The project is a continuation of the original `ThreadModeler` by coolOrange / Philippe Leefsma, extended for Autodesk Inventor 2026.

The add-in works on selected `ThreadFeature` objects in a Part document. It exposes two commands in the Part ribbon:

- the ISO workflow
- the `3D Print` workflow

The ISO workflow opens a modeless dialog where you can choose the sketch template and the pitch offset. The `3D Print` workflow reads the selected thread feature, pre-fills a trapezoidal profile from the nominal diameter, and lets you override the dimensions manually.

The model is then built from the template or the dedicated profile, and the original cosmetic thread is suppressed once the modeled geometry is created.

The project supports both standard and tapered threads. The default template is `ISO Template.ipt`, with `BSW Template.ipt` still shipped in the bundle.

The project is complete and the repository is available on [GitHub](https://github.com/devgiants/thread-solid-modeler).
