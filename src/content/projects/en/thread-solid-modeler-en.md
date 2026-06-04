---
key: thread-solid-modeler
slug: thread-solid-modeler-en
publicSlug: thread-solid-modeler
locale: en
title: Thread Solid Modeler
summary: Autodesk Inventor add-in that turns cosmetic threads into modeled 3D geometry.
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

ThreadSolidModeler is an Autodesk Inventor add-in that turns existing cosmetic threads into fully modeled 3D geometry.

The project builds on `ThreadModeler` by coolOrange / Philippe Leefsma and continues it for Autodesk Inventor 2026.

The add-in works on selected `ThreadFeature` objects in a Part document. It exposes two commands in the Part ribbon:

- the ISO workflow
- the `3D Print` workflow

The ISO workflow opens a modeless dialog to choose the sketch template and the pitch offset.

The `3D Print` workflow starts from the selected thread geometry, pre-fills a trapezoidal profile based on the nominal diameter, and lets you tune the dimensions manually. It relies on part of the original thread characteristics, but lets you adjust the parameters so the output stays printable and usable. In particular, it lets you add clearance to match the accuracy of the 3D printer you are targeting.

<div class="grid gap-4 md:grid-cols-12 my-8">
  <figure class="m-0 md:col-span-12">
    <img src="/thread-solid-modeler/female_thread.png" alt="Modeled female thread" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg" />
    <figcaption class="mt-2 text-sm text-slate-400">Main view of the modeled female thread</figcaption>
  </figure>
  <figure class="m-0 md:col-span-4">
    <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="Male thread with progressive start" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg" />
    <figcaption class="mt-2 text-sm text-slate-400">Male thread with progressive start</figcaption>
  </figure>
  <figure class="m-0 md:col-span-4">
    <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="Male and female assembly with clearance" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg" />
    <figcaption class="mt-2 text-sm text-slate-400">Male / female assembly with clearance</figcaption>
  </figure>
  <figure class="m-0 md:col-span-4">
    <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="Male and female assembly with clearance, alternate view" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg" />
    <figcaption class="mt-2 text-sm text-slate-400">Male / female assembly with clearance, alternate view</figcaption>
  </figure>
</div>

The model is then built from the template or the dedicated profile, and the original cosmetic thread is removed by suppressing the feature.

The standard generation path supports both standard and tapered threads. The default template is `ISO Template.ipt`, with `BSW Template.ipt` also shipped in the bundle.

The project is complete and the repository is available on [GitHub](https://github.com/devgiants/thread-solid-modeler).
