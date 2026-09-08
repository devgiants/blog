---
key: pypersafe
slug: pypersafe-en
publicSlug: pypersafe
locale: en
title: PyperSafe
summary: A personal document safe that protects digital archives and helps retrieve their paper originals.
url: https://gitlab.com/devgiants/python/pypersafe
date: 2026-06-04
status: Completed
stack: [Python, Tkinter, SQLCipher, XChaCha20-Poly1305, Linux & Windows]
featured: true
---

## The need

Bills, certificates, and administrative records tend to become scattered across digital folders and paper binders. PyperSafe gives them one entry point: a local desktop application that imports documents, protects their content and metadata, then retrieves the right item through structured search.

**The journey has four steps: import, describe, search, retrieve.** Each document receives a stable identifier. Printable labels connect that identifier to the sleeve holding the paper original.

<div class="project-gallery my-8" data-project-gallery>
  <div class="project-gallery__stage"><figure class="project-gallery__slide is-active"><img src="/pypersafe/workspace.png" alt="PyperSafe workspace with search, document list, preview, and metadata" data-gallery-main-image /><figcaption class="project-gallery__caption" data-gallery-main-caption>Search, selection, and preview in one workspace.</figcaption></figure></div>
  <div class="project-gallery__thumbs" role="tablist" aria-label="PyperSafe gallery">
    <button class="project-gallery__thumb is-active" type="button" data-gallery-thumb data-image="/pypersafe/workspace.png" data-alt="PyperSafe workspace" data-caption="Search, selection, and preview in one workspace."><img src="/pypersafe/workspace.png" alt="" aria-hidden="true" /><span>Overview</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/pypersafe/import.png" data-alt="PyperSafe import progress" data-caption="Batch progress remains visible while each document is handled independently."><img src="/pypersafe/import.png" alt="" aria-hidden="true" /><span>Batch import</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/pypersafe/preview.png" data-alt="PyperSafe document viewer" data-caption="The viewer confirms the document and exposes its UID for paper retrieval."><img src="/pypersafe/preview.png" alt="" aria-hidden="true" /><span>Preview and UID</span></button>
  </div>
</div>

## What I designed and delivered

- A metadata catalog with search by tags, date, import batch, and sensitivity.
- A self-contained store whose location is selected by the user and can be moved.
- SQLite encryption with SQLCipher and document encryption with `XChaCha20-Poly1305`.
- Safe-key derivation from the passphrase using `Argon2id`.
- Parallel batch import with atomic publication per document and rollback when catalog registration fails.
- Image and PDF previews, decrypted export, and printable UID label sheets.
- Linux and Windows releases with reproducible illustrated documentation.

## Skills demonstrated

The project combines product design, domain modelling, local security, and desktop UI work. Its hexagonal architecture separates domain concepts, use cases, and technical adapters. Development followed short TDD slices, with close attention to partial failures, catalog integrity, and long-running work outside the GUI thread.

The result is a complete, installable, documented application built around a practical workflow.

[Browse the code and documentation on GitLab](https://gitlab.com/devgiants/python/pypersafe).

<script is:inline>
  document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
    const image = gallery.querySelector('[data-gallery-main-image]'); const caption = gallery.querySelector('[data-gallery-main-caption]'); const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    thumbs.forEach((button) => button.addEventListener('click', () => { thumbs.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button)); image.src = button.dataset.image; image.alt = button.dataset.alt || ''; caption.textContent = button.dataset.caption || ''; }));
  });
</script>
