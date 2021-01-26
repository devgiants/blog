---
layout: post
title:  "Symfony version manager"
date:   2021-01-25 09:40:00 +0100
tags:
- symfony
- version

excerpt: "For quite a long time now I wondered how could I gracefully handle version management & display inside Symfony application. Do you now Shivas Versioning Bundle?"

---
## Version display. What for ?
From a long-term usage point of view, display application version is critical for __marking__ purposes.
Your users can refer to this number when contacting support, and you can also use this number to quickly ensure
propoer deploy happened (among other tools provided by your CI/CD stack of course).

## How to handle it ?
Despite having the point in mind for a long, I never gave a go to a simple search around this topic.
Doing so I found [Shivas versionning bundle](https://github.com/shivas/versioning-bundle). It just does __everything__ I wanted :
- Twig extension for version number management.
- Several versions providers (from `VERSION` file to Git tag handling) tailored for common uses.
- [SemVer](https://semver.org/) based.
- Default formatters to let you go out-of-the-box

As for all well-developed bundles, you can register your own providers & formatters as services.

Cheers to its author for this work to the community.


