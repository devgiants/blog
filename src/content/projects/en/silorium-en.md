---
key: silorium
slug: silorium-en
publicSlug: silorium
locale: en
title: Silorium
summary: Local, resilient household reserve management with mobile capture, stock rotation, and offline synchronization.
url: https://gitlab.com/devgiants/kotlin/silorium
date: 2026-09-08
status: In progress
stack: [Kotlin Multiplatform, Compose Desktop & Android, Ktor, SQLDelight, Hexagonal architecture]
featured: true
---

## The problem

A reserve is useful only when the household knows what it contains, where each lot is stored, and what should be used first. Silorium aims to make tracking fast enough to remain faithful to physical stock: immediate intake after shopping, guided retrieval during daily use, and progressive enrichment of product data.

The product combines a central administration application with an Android companion used near storage locations. The companion keeps recording movements offline, then clearly exposes synchronization state and any divergence requiring a decision.

<div class="project-gallery my-8" data-project-gallery>
  <div class="project-gallery__stage"><figure class="project-gallery__slide is-active"><img src="/silorium/central-dashboard.png" alt="Silorium central dashboard" data-gallery-main-image /><figcaption class="project-gallery__caption" data-gallery-main-caption>The dashboard surfaces decisions, target gaps, and upcoming expiries.</figcaption></figure></div>
  <div class="project-gallery__thumbs" role="tablist" aria-label="Silorium mockups">
    <button class="project-gallery__thumb is-active" type="button" data-gallery-thumb data-image="/silorium/central-dashboard.png" data-alt="Silorium central dashboard" data-caption="The dashboard surfaces decisions, target gaps, and upcoming expiries."><img src="/silorium/central-dashboard.png" alt="" aria-hidden="true" /><span>Central view</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/silorium/companion-home.png" data-alt="Silorium mobile companion home" data-caption="The companion keeps both core actions available, including offline."><img src="/silorium/companion-home.png" alt="" aria-hidden="true" /><span>Mobile home</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/silorium/companion-intake.png" data-alt="Silorium intake journey" data-caption="Capture prioritizes speed, with enrichment and confirmation at the right time."><img src="/silorium/companion-intake.png" alt="" aria-hidden="true" /><span>Store</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/silorium/companion-retrieve.png" data-alt="Silorium retrieval journey" data-caption="Retrieval recommends the lot to use and identifies its exact location."><img src="/silorium/companion-retrieve.png" alt="" aria-hidden="true" /><span>Retrieve</span></button>
  </div>
</div>

## An action-led experience

- Scan a barcode or search for a product without heavy prerequisite setup.
- Take a disposable expiry-date photo to assist entry, then remove the image.
- Recommend the lot to retrieve based on its date and show its location before confirmation.
- Track quantitative targets while exposing the inputs behind estimates.
- Surface urgent expiry, stock discrepancies, and operations that require a decision.

## Architecture for real conditions

Silorium uses two specialized modular monoliths, Central and Companion, connected through a versioned protocol. The shared deterministic domain stays isolated from UI, persistence, network, and external data connectors.

Inventory-determining movements form an immutable ledger. Read projections can be rebuilt, corrections preserve physical observations, and the central authority serializes canonical mutations. LAN REST synchronization is designed for retries, interruptions, and offline mobile operations without silent loss.

## Project status

Product framing, UX journeys, the visual system, functional model, and reference architecture are established. The mockups show the target currently under development and validate the core actions, offline states, and accessibility before full implementation.

[Follow development on GitLab](https://gitlab.com/devgiants/kotlin/silorium).

<script is:inline>
  document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
    const image = gallery.querySelector('[data-gallery-main-image]'); const caption = gallery.querySelector('[data-gallery-main-caption]'); const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    thumbs.forEach((button) => button.addEventListener('click', () => { thumbs.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button)); image.src = button.dataset.image; image.alt = button.dataset.alt || ''; caption.textContent = button.dataset.caption || ''; }));
  });
</script>
