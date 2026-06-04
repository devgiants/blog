import { defineCollection, z } from 'astro:content';

const optionalStringArray = z
  .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim().length > 0) return [value];
    return [];
  });

export const collections = {
  posts: defineCollection({
    type: 'content',
    schema: z
      .object({
        layout: z.string().optional(),
        slug: z.string().optional(),
        publicSlug: z.string().optional(),
        locale: z.enum(['fr', 'en']),
        title: z.string(),
        date: z.coerce.date(),
        tags: optionalStringArray,
        excerpt: z.string().optional().default(''),
      })
      .passthrough(),
  }),
  pages: defineCollection({
    type: 'content',
    schema: z
      .object({
        key: z.enum(['bio']),
        locale: z.enum(['fr', 'en']),
        title: z.string(),
      })
      .passthrough(),
  }),
  projects: defineCollection({
    type: 'content',
    schema: z
      .object({
        key: z.string(),
        slug: z.string().optional(),
        publicSlug: z.string().optional(),
        locale: z.enum(['fr', 'en']),
        title: z.string(),
        summary: z.string(),
        url: z.string().url(),
        date: z.coerce.date(),
        status: z.string().optional(),
        stack: optionalStringArray,
        featured: z.boolean().optional().default(false),
      })
      .passthrough(),
  }),
};
