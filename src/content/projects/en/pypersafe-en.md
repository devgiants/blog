---
key: pypersafe
slug: pypersafe-en
publicSlug: pypersafe
locale: en
title: PyperSafe
summary: A personal document safe to import, encrypt, index, and retrieve administrative papers.
url: https://gitlab.com/devgiants/python/pypersafe
date: 2026-06-04
status: Completed
stack:
  - Python
  - Tkinter
  - Encryption
  - Desktop
featured: true
---

PyperSafe is a personal document safe focused on local import, at-rest encryption, indexing, and search.

The core of the app is a small SQLite database encrypted with SQLCipher. It stores document metadata, import batches, and tags, and acts as the search and sorting index.

The documents themselves are encrypted with `XChaCha20-Poly1305`. The safe key is derived from a passphrase with `Argon2id`, then used to unlock the application.

The project targets Linux and Windows, with binaries built for both platforms.

Development was done in full TDD, in small slices, with a strong focus on robustness, tests, and business behavior.

The project is complete and the repository is available on [GitLab](https://gitlab.com/devgiants/python/pypersafe).
