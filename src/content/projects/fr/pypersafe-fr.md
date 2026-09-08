---
key: pypersafe
slug: pypersafe-fr
publicSlug: pypersafe
locale: fr
title: PyperSafe
summary: Un coffre documentaire personnel qui protège les archives numériques et permet de retrouver aussi leurs originaux papier.
url: https://gitlab.com/devgiants/python/pypersafe
date: 2026-06-04
status: Terminé
stack: [Python, Tkinter, SQLCipher, XChaCha20-Poly1305, Linux & Windows]
featured: true
---

## Le besoin

Factures, attestations et avis administratifs finissent souvent dispersés entre dossiers numériques et classeurs papier. PyperSafe leur donne un point d'entrée unique : une application de bureau locale qui importe les documents, protège leur contenu et leurs métadonnées, puis retrouve la bonne pièce par une recherche structurée.

**Le parcours tient en quatre gestes : importer, décrire, rechercher, récupérer.** Chaque document reçoit un identifiant stable. Des planches d'étiquettes relient cet identifiant à la pochette de l'original papier.

<div class="project-gallery my-8" data-project-gallery>
  <div class="project-gallery__stage"><figure class="project-gallery__slide is-active"><img src="/pypersafe/workspace.png" alt="Espace de travail PyperSafe avec recherche, liste, aperçu et métadonnées" data-gallery-main-image /><figcaption class="project-gallery__caption" data-gallery-main-caption>Recherche, sélection et aperçu dans un même espace de travail.</figcaption></figure></div>
  <div class="project-gallery__thumbs" role="tablist" aria-label="Galerie PyperSafe">
    <button class="project-gallery__thumb is-active" type="button" data-gallery-thumb data-image="/pypersafe/workspace.png" data-alt="Espace de travail PyperSafe" data-caption="Recherche, sélection et aperçu dans un même espace de travail."><img src="/pypersafe/workspace.png" alt="" aria-hidden="true" /><span>Vue d'ensemble</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/pypersafe/import.png" data-alt="Progression d'un import PyperSafe" data-caption="Un import par lot avec progression visible et traitement indépendant de chaque document."><img src="/pypersafe/import.png" alt="" aria-hidden="true" /><span>Import par lot</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/pypersafe/preview.png" data-alt="Visionneuse de document PyperSafe" data-caption="La visionneuse confirme la pièce et expose son UID pour retrouver l'original papier."><img src="/pypersafe/preview.png" alt="" aria-hidden="true" /><span>Aperçu et UID</span></button>
  </div>
</div>

## Ce que j'ai conçu et réalisé

- Un catalogue de métadonnées avec recherche par tags, date, lot d'import et sensibilité.
- Un stockage autonome dont l'emplacement est choisi par l'utilisateur et peut être déplacé.
- Le chiffrement de SQLite avec SQLCipher et celui des documents avec `XChaCha20-Poly1305`.
- Une clé de coffre dérivée de la phrase secrète avec `Argon2id`.
- L'import parallèle avec publication atomique par document et retour arrière si son inscription au catalogue échoue.
- La prévisualisation des images et PDF, l'export déchiffré et les étiquettes UID imprimables.
- Des versions Linux et Windows avec une documentation illustrée reproductible.

## Savoir-faire mis en œuvre

Le projet combine conception produit, modélisation métier, sécurité locale et interface desktop. Son architecture hexagonale sépare le domaine, les cas d'usage et les adaptateurs techniques. Le développement a été mené en TDD par tranches courtes, avec une attention particulière aux erreurs partielles, à l'intégrité du catalogue et aux opérations longues hors du thread graphique.

Le résultat est une application complète, installable et documentée, pensée autour d'un usage concret.

[Voir le code et la documentation sur GitLab](https://gitlab.com/devgiants/python/pypersafe).

<script is:inline>
  document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
    const image = gallery.querySelector('[data-gallery-main-image]'); const caption = gallery.querySelector('[data-gallery-main-caption]'); const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    thumbs.forEach((button) => button.addEventListener('click', () => { thumbs.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button)); image.src = button.dataset.image; image.alt = button.dataset.alt || ''; caption.textContent = button.dataset.caption || ''; }));
  });
</script>
