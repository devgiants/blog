---
key: pypersafe
slug: pypersafe-fr
publicSlug: pypersafe
locale: fr
title: PyperSafe
summary: Coffre documentaire personnel pour importer, chiffrer, indexer et retrouver des documents administratifs.
url: https://gitlab.com/devgiants/python/pypersafe
date: 2026-06-04
status: Terminé
stack:
  - Python
  - Tkinter
  - Chiffrement
  - Bureau
featured: true
---

PyperSafe est un coffre documentaire personnel orienté import local, chiffrement au stockage, indexation et recherche.

Le cœur métier repose sur une petite base SQLite chiffrée avec SQLCipher. Elle stocke les métadonnées des documents, les lots d'import et les tags, et sert d'index pour la recherche et le tri.

Les documents eux-mêmes sont chiffrés avec `XChaCha20-Poly1305`. La clé du coffre est dérivée d'une passphrase avec `Argon2id`, puis utilisée pour déverrouiller l'ensemble de l'application.

Le projet cible Linux et Windows, avec des binaires construits pour les deux plateformes.

Le développement a été mené en full TDD, par petites tranches, avec un accent fort sur la robustesse, les tests et les comportements métier.

Le projet est terminé et le dépôt est disponible sur [GitLab](https://gitlab.com/devgiants/python/pypersafe).
