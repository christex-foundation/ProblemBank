import { revalidateTag } from 'next/cache';

/**
 * Cache invalidation utilities for Airtable data
 */

export const CACHE_TAGS = {
  FEATURED_IDEAS: 'featured-ideas',
  IDEAS_PAGE: 'ideas-page',
  IDEA_BY_TITLE: 'idea-by-title',
  CATEGORIES: 'categories',
  TECH_STACKS: 'tech-stacks',
  TECH_CATEGORIES: 'tech-categories',
} as const;

/**
 * Invalidate all Airtable-related caches
 */
export async function invalidateAllAirtableCache() {
  try {
    revalidateTag(CACHE_TAGS.FEATURED_IDEAS, '/');
    revalidateTag(CACHE_TAGS.IDEAS_PAGE, '/');
    revalidateTag(CACHE_TAGS.IDEA_BY_TITLE, '/');
    revalidateTag(CACHE_TAGS.CATEGORIES, '/');
    revalidateTag(CACHE_TAGS.TECH_STACKS, '/');
    revalidateTag(CACHE_TAGS.TECH_CATEGORIES, '/');
    console.log('All Airtable caches invalidated successfully');
  } catch (error) {
    console.error('Failed to invalidate Airtable caches:', error);
  }
}

/**
 * Invalidate specific cache tags
 */
export async function invalidateCacheTags(tags: string[]) {
  try {
    for (const tag of tags) {
      revalidateTag(tag, '/');
    }
    console.log(`Cache tags invalidated: ${tags.join(', ')}`);
  } catch (error) {
    console.error('Failed to invalidate cache tags:', error);
  }
}

/**
 * Invalidate ideas-related caches
 */
export async function invalidateIdeasCache() {
  await invalidateCacheTags([
    CACHE_TAGS.FEATURED_IDEAS,
    CACHE_TAGS.IDEAS_PAGE,
    CACHE_TAGS.IDEA_BY_TITLE,
    CACHE_TAGS.CATEGORIES,
  ]);
}

/**
 * Invalidate tech stack-related caches
 */
export async function invalidateTechStackCache() {
  await invalidateCacheTags([
    CACHE_TAGS.TECH_STACKS,
    CACHE_TAGS.TECH_CATEGORIES,
  ]);
}

/**
 * Cache monitoring utilities
 */
export function getCacheInfo() {
  return {
    tags: Object.values(CACHE_TAGS),
    revalidationTimes: {
      featuredIdeas: '5 minutes',
      ideasPage: '5 minutes',
      ideaByTitle: '10 minutes',
      categories: '15 minutes',
      techStacks: '5 minutes',
      techCategories: '15 minutes',
    },
    browserCache: {
      ideas: '5 minutes',
      techStacks: '5 minutes',
      categories: '15 minutes',
    }
  };
}








