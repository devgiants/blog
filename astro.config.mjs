import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://devgiants.fr',
  trailingSlash: 'always',
  outDir: './docs',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
