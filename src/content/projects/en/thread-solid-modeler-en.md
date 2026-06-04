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

<div class="project-gallery my-8" data-thread-gallery>
  <div class="project-gallery__stage">
    <figure class="project-gallery__slide is-active" data-gallery-slide>
      <img src="/thread-solid-modeler/female_thread.png" alt="Modeled female thread" data-gallery-main-image />
      <figcaption class="project-gallery__caption" data-gallery-main-caption>Main view of the modeled female thread</figcaption>
    </figure>
  </div>

  <div class="project-gallery__thumbs" role="tablist" aria-label="Thread Solid Modeler gallery">
    <button class="project-gallery__thumb is-active" type="button" data-gallery-thumb data-image="/thread-solid-modeler/female_thread.png" data-alt="Modeled female thread" data-caption="Main view of the modeled female thread">
      <img src="/thread-solid-modeler/female_thread.png" alt="" aria-hidden="true" />
      <span>Main view</span>
    </button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/thread-solid-modeler/male_thread_with_progressive_start.png" data-alt="Male thread with progressive start" data-caption="Male thread with progressive start">
      <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="" aria-hidden="true" />
      <span>Progressive start</span>
    </button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/thread-solid-modeler/thread_male_female_with_clearance_1.png" data-alt="Male and female assembly with clearance" data-caption="Male / female assembly with clearance">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="" aria-hidden="true" />
      <span>Assembly clearance</span>
    </button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/thread-solid-modeler/thread_male_female_with_clearance_2.png" data-alt="Male and female assembly with clearance, alternate view" data-caption="Male / female assembly with clearance, alternate view">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="" aria-hidden="true" />
      <span>Alternate view</span>
    </button>
  </div>
</div>

The model is then built from the template or the dedicated profile, and the original cosmetic thread is removed by suppressing the feature.

The standard generation path supports both standard and tapered threads. The default template is `ISO Template.ipt`, with `BSW Template.ipt` also shipped in the bundle.

The project is complete and the repository is available on [GitHub](https://github.com/devgiants/thread-solid-modeler).

<script is:inline>
  const gallery = document.querySelector('[data-thread-gallery]');
  if (gallery) {
    const mainImage = gallery.querySelector('[data-gallery-main-image]');
    const mainCaption = gallery.querySelector('[data-gallery-main-caption]');
    const thumbButtons = [...gallery.querySelectorAll('[data-gallery-thumb]')];

    const activate = (button) => {
      thumbButtons.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button));
      mainImage.src = button.dataset.image;
      mainImage.alt = button.dataset.alt || '';
      mainCaption.textContent = button.dataset.caption || '';
    };

    thumbButtons.forEach((button) => {
      button.addEventListener('click', () => activate(button));
    });
  }
</script>
