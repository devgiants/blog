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

<div class="project-gallery my-8">
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery-en" id="tsm-slide-1" checked />
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery-en" id="tsm-slide-2" />
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery-en" id="tsm-slide-3" />
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery-en" id="tsm-slide-4" />

  <div class="project-gallery__stage">
    <figure class="project-gallery__slide project-gallery__slide--1">
      <img src="/thread-solid-modeler/female_thread.png" alt="Modeled female thread" />
      <figcaption class="project-gallery__caption">Main view of the modeled female thread</figcaption>
    </figure>
    <figure class="project-gallery__slide project-gallery__slide--2">
      <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="Male thread with progressive start" />
      <figcaption class="project-gallery__caption">Male thread with progressive start</figcaption>
    </figure>
    <figure class="project-gallery__slide project-gallery__slide--3">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="Male and female assembly with clearance" />
      <figcaption class="project-gallery__caption">Male / female assembly with clearance</figcaption>
    </figure>
    <figure class="project-gallery__slide project-gallery__slide--4">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="Male and female assembly with clearance, alternate view" />
      <figcaption class="project-gallery__caption">Male / female assembly with clearance, alternate view</figcaption>
    </figure>
  </div>

  <div class="project-gallery__thumbs">
    <label class="project-gallery__thumb" for="tsm-slide-1">
      <img src="/thread-solid-modeler/female_thread.png" alt="Thumbnail of the modeled female thread" />
      <span>Main view</span>
    </label>
    <label class="project-gallery__thumb" for="tsm-slide-2">
      <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="Thumbnail of the male thread with progressive start" />
      <span>Progressive start</span>
    </label>
    <label class="project-gallery__thumb" for="tsm-slide-3">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="Thumbnail of the male and female assembly with clearance" />
      <span>Assembly clearance</span>
    </label>
    <label class="project-gallery__thumb" for="tsm-slide-4">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="Thumbnail of the male and female assembly with clearance, alternate view" />
      <span>Alternate view</span>
    </label>
  </div>
</div>

The model is then built from the template or the dedicated profile, and the original cosmetic thread is removed by suppressing the feature.

The standard generation path supports both standard and tapered threads. The default template is `ISO Template.ipt`, with `BSW Template.ipt` also shipped in the bundle.

The project is complete and the repository is available on [GitHub](https://github.com/devgiants/thread-solid-modeler).
