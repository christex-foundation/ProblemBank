// Server-side Airtable helper (no client-side secrets)
// Reads credentials from environment variables
// AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, optional AIRTABLE_VIEW_NAME
// Optional mapping envs: AIRTABLE_TITLE_FIELD, AIRTABLE_BLURB_FIELD, AIRTABLE_SORT_FIELD, AIRTABLE_SORT_DIRECTION, AIRTABLE_PAGE_SIZE

export type IdeaItem = {
  id: string;
  title: string;
  blurb?: string;
  route?: string;
  order?: number;
  category?: string;
  problem?: string;
  solution?: string;
  repo?: string;
};

export type TechStackItem = {
  id: string;
  name: string;
  category: string[];
  description: string;
  url: string;
};

// Airtable multiple-select value shape can be strings or objects with a name
type AirtableSelectOption = string | { name: string };

type AirtableListResponse = {
  records: Array<{
    id: string;
    fields: Record<string, unknown>;
  }>;
  offset?: string;
};

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

function getEnv(name: string, optional = false): string | undefined {
  const v = process.env[name];
  if (!v && !optional) {
    return undefined;
  }
  return v;
}

export async function fetchFeaturedIdeas(limit = 4): Promise<IdeaItem[]> {
  const token = getEnv('AIRTABLE_TOKEN');
  const baseId = getEnv('AIRTABLE_BASE_ID');
  const tableName = getEnv('AIRTABLE_TABLE_NAME');

  if (!token || !baseId || !tableName) {
    // Return empty to let the UI fall back to placeholders
    return [];
  }

  const view = getEnv('AIRTABLE_VIEW_NAME', true);
  const filterFormula = getEnv('AIRTABLE_FILTER_FORMULA', true);
  const pageSize = parseInt(getEnv('AIRTABLE_PAGE_SIZE', true) || '10', 10);
  const sortField = getEnv('AIRTABLE_SORT_FIELD', true); // optional, no default
  const sortDirection = (getEnv('AIRTABLE_SORT_DIRECTION', true) || 'asc') as 'asc' | 'desc';

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  if (view) url.searchParams.set('view', view);

  // Add Status='Published' filter
  const statusFilter = "{Status} = 'Published'";
  const combinedFilter = filterFormula ? `AND(${statusFilter}, ${filterFormula})` : statusFilter;
  url.searchParams.set('filterByFormula', combinedFilter);

  url.searchParams.set('pageSize', String(Math.max(limit, pageSize)));
  // Sorting (only if sortField specified)
  if (sortField) {
    url.searchParams.set('sort[0][field]', sortField);
    url.searchParams.set('sort[0][direction]', sortDirection);
  }

  let data: AirtableListResponse;
  
  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour with revalidation
      next: {
        revalidate: 3600, // 1 hour
        tags: ['featured-ideas']
      },
    });

    if (!res.ok) {
      console.warn(`Airtable API error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    data = (await res.json()) as AirtableListResponse;
  } catch (error) {
    console.warn('Failed to fetch featured ideas from Airtable:', error);
    return [];
  }

  const titleField = getEnv('AIRTABLE_TITLE_FIELD', true) || 'Title';
  const blurbField = getEnv('AIRTABLE_BLURB_FIELD', true) || 'Blurb';
  const categoryField = getEnv('AIRTABLE_CATEGORY_FIELD', true) || 'Category';
  const typeField = 'Type';
  const orderField = sortField || undefined;

  const items: IdeaItem[] = data.records.map((r) => {
    const f = r.fields || {};
    const title = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || 'Untitled Idea';
    const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';

    // Category can be a string or a multiple-select array. Use the first option when it's an array.
    const rawCategory = f[categoryField] as unknown;
    let category: string | undefined;
    if (Array.isArray(rawCategory)) {
      const arr = rawCategory as AirtableSelectOption[];
      const first = arr[0];
      if (typeof first === 'string') category = first;
      else if (first && typeof first === 'object' && 'name' in first) category = first.name;
    } else if (typeof rawCategory === 'string') {
      category = rawCategory as string;
    } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
      category = (rawCategory as { name: string }).name;
    }

    const route = (f[typeField] as string) || undefined;
    const order = orderField && typeof f[orderField] === 'number' ? (f[orderField] as number) : undefined;

    return { id: r.id, title, blurb, category, route, order };
  });

  // Sort client-side if a numeric sort field exists
  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return items.slice(0, limit);
}

export type IdeasPage = { items: IdeaItem[]; offset?: string };

// categories: optional list of category names to OR-match
// searchQuery: optional text search in title and blurb
export async function fetchIdeasPage(pageSize = 12, offset?: string, categories?: string[], searchQuery?: string): Promise<IdeasPage> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];

  if (!token || !baseId || !tableName) {
    return { items: [], offset: undefined };
  }

  // Intentionally fetch all ideas for the Ideas page (do not apply env view/filter here)
  const sortField = process.env['AIRTABLE_SORT_FIELD'];
  const sortDirection = (process.env['AIRTABLE_SORT_DIRECTION'] || 'asc') as 'asc' | 'desc';
  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  url.searchParams.set('pageSize', String(pageSize));
  if (offset) url.searchParams.set('offset', offset);
  if (sortField) {
    url.searchParams.set('sort[0][field]', sortField);
    url.searchParams.set('sort[0][direction]', sortDirection);
  }

  // Build filter formula combining categories, search, and status
  const filterParts: string[] = [];

  // Always filter by Status='Published'
  filterParts.push("{Status} = 'Published'");

  // Apply category filter if provided (multi-select OR logic)
  if (categories && categories.length > 0) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    // Test both single-select equality and multi-select inclusion via ARRAYJOIN; wrap with commas to avoid partial matches
    const joinedExpr = `"," & ARRAYJOIN({${categoryField}}, ",") & ","`;
    const perCat = categories.map((c) => `OR({${categoryField}} = '${esc(c)}', FIND("," & '${esc(c)}' & ",", ${joinedExpr}))`);
    filterParts.push(`OR(${perCat.join(',')})`);
  }

 // Apply search filter if provided (simplified to avoid formula errors)
if (searchQuery && searchQuery.trim()) {
  const esc = (s: string) => s.replace(/'/g, "\\'");
  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
  const query = esc(searchQuery.trim().toLowerCase());
  filterParts.push(`OR(FIND('${query}', LOWER({${titleField}})), FIND('${query}', LOWER({${blurbField}})))`);
}
  // Combine filters with AND logic
  const formula = filterParts.length === 1 ? filterParts[0] : `AND(${filterParts.join(',')})`;
  url.searchParams.set('filterByFormula', formula);

  let data: AirtableListResponse;
  
  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour with revalidation
      next: {
        revalidate: 3600, // 1 hour
        tags: ['ideas-page']
      },
    });
    
    if (!res.ok) {
      console.warn(`Airtable API error: ${res.status} ${res.statusText}`);
      return { items: [], offset: undefined };
    }
    
    data = (await res.json()) as AirtableListResponse;
  } catch (error) {
    console.warn('Failed to fetch from Airtable:', error);
    return { items: [], offset: undefined };
  }

  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
  const typeField = 'Type';
  const orderField = sortField || undefined;

  const items: IdeaItem[] = data.records.map((r) => {
    const f = r.fields || {};
    const title = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || 'Untitled Idea';
    const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';

    const rawCategory = f[categoryField] as unknown;
    let category: string | undefined;
    if (Array.isArray(rawCategory)) {
      const arr = rawCategory as AirtableSelectOption[];
      const first = arr[0];
      if (typeof first === 'string') category = first;
      else if (first && typeof first === 'object' && 'name' in first) category = (first as { name: string }).name;
    } else if (typeof rawCategory === 'string') {
      category = rawCategory as string;
    } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
      category = (rawCategory as { name: string }).name;
    }

    const route = (f[typeField] as string) || undefined;
    const order = orderField && typeof f[orderField] === 'number' ? (f[orderField] as number) : undefined;
    const repo = (f['Repo'] as string) || undefined;
    return { id: r.id, title, blurb, category, route, order, repo };
  });

  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { items, offset: data.offset };
}

// Fetch from a single base with given config
async function fetchIdeasFromBase(
  token: string,
  baseId: string,
  tableName: string,
  pageSize: number,
  categories?: string[],
  searchQuery?: string
): Promise<IdeaItem[]> {
  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  url.searchParams.set('pageSize', String(pageSize));

  const filterParts: string[] = [];
  filterParts.push("{Status} = 'Published'");

  if (categories && categories.length > 0) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    const joinedExpr = `"," & ARRAYJOIN({${categoryField}}, ",") & ","`;
    const perCat = categories.map((c) => `OR({${categoryField}} = '${esc(c)}', FIND("," & '${esc(c)}' & ",", ${joinedExpr}))`);
    filterParts.push(`OR(${perCat.join(',')})`);
  }

  if (searchQuery && searchQuery.trim()) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
    const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
    const query = esc(searchQuery.trim().toLowerCase());
    filterParts.push(`OR(FIND('${query}', LOWER({${titleField}})), FIND('${query}', LOWER({${blurbField}})))`);
  }

  const formula = filterParts.length === 1 ? filterParts[0] : `AND(${filterParts.join(',')})`;
  url.searchParams.set('filterByFormula', formula);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600,
        tags: ['ideas-page']
      },
    });

    if (!res.ok) {
      console.warn(`Airtable API error for ${baseId}: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = (await res.json()) as AirtableListResponse;
    const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
    const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';

    return data.records.map((r) => {
      const f = r.fields || {};
      const title = (f[titleField] as string) || (f['Name'] as string) || 'Untitled Idea';
      const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';

      const rawCategory = f[categoryField] as unknown;
      let category: string | undefined;
      if (Array.isArray(rawCategory)) {
        const arr = rawCategory as AirtableSelectOption[];
        const first = arr[0];
        if (typeof first === 'string') category = first;
        else if (first && typeof first === 'object' && 'name' in first) category = (first as { name: string }).name;
      } else if (typeof rawCategory === 'string') {
        category = rawCategory as string;
      }

      const repo = (f['Repo'] as string) || undefined;
      return { id: r.id, title, blurb, category, repo };
    });
  } catch (error) {
    console.warn(`Failed to fetch from base ${baseId}:`, error);
    return [];
  }
}

// Fetch ideas from BOTH bases and combine them
export async function fetchCombinedIdeasPage(pageSize = 12, offset?: string, categories?: string[], searchQuery?: string): Promise<IdeasPage> {
  // Fetch from main Civic base
  const civicToken = process.env['AIRTABLE_TOKEN'];
  const civicBaseId = process.env['AIRTABLE_BASE_ID'];
  const civicTableName = process.env['AIRTABLE_TABLE_NAME'];

  // Fetch from Big5 base
  const big5Token = process.env['AIRTABLE_BIG5_IDEAS_TOKEN'];
  const big5BaseId = process.env['AIRTABLE_BIG5_IDEAS_BASE_ID'];
  const big5TableName = process.env['AIRTABLE_BIG5_IDEAS_TABLE_NAME'];

  // Fetch more items from each base to ensure we get enough after deduplication
  // We'll request 2x pageSize from each to have a good pool to combine
  const fetchSize = pageSize * 2;

  const [civicItems, big5Items] = await Promise.all([
    civicToken && civicBaseId && civicTableName
      ? fetchIdeasFromBase(civicToken, civicBaseId, civicTableName, fetchSize, categories, searchQuery)
      : Promise.resolve([]),
    big5Token && big5BaseId && big5TableName
      ? fetchIdeasFromBase(big5Token, big5BaseId, big5TableName, fetchSize, categories, searchQuery)
      : Promise.resolve([]),
  ]);

  // Interleave items from both bases to ensure mix in results
  const interleaved: IdeaItem[] = [];
  const maxLength = Math.max(civicItems.length, big5Items.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < civicItems.length) interleaved.push(civicItems[i]);
    if (i < big5Items.length) interleaved.push(big5Items[i]);
  }

  // Deduplicate by title
  const seen = new Set<string>();
  const items = interleaved.filter(item => {
    if (seen.has(item.title.toLowerCase())) return false;
    seen.add(item.title.toLowerCase());
    return true;
  });

  // Return the requested page size
  return { items: items.slice(0, pageSize), offset: undefined };
}

export async function fetchIdeaByTitle(title: string): Promise<IdeaItem | null> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];

  if (!token || !baseId || !tableName) {
    return null;
  }

  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const lowerTitle = title.toLowerCase();
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  // Filter by formula: LOWER({Title}) = 'lowercase title' AND Status='Published'
  const titleFilter = `LOWER({${titleField}}) = '${lowerTitle.replace(/'/g, "\\'")}'`;
  const statusFilter = "{Status} = 'Published'";
  url.searchParams.set('filterByFormula', `AND(${titleFilter}, ${statusFilter})`);
  url.searchParams.set('pageSize', '1');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Cache for 1 hour with revalidation
    next: {
      revalidate: 3600, // 1 hour
      tags: ['idea-by-title']
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as AirtableListResponse;
  if (!data.records?.length) return null;

  const record = data.records[0];

  const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
  const sortField = process.env['AIRTABLE_SORT_FIELD'];
  const typeField = 'Type';

  const f = record.fields || {};
  const mappedTitle = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || title;
  const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';
  
  // Map Problem and Proposed Solution fields with safe coercion to strings
  const problemField = 'The Problem';
  const solutionField = 'Proposed Solution';
  const asText = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) {
      return (v as unknown[])
        .map((x) => (typeof x === 'string' ? x : x && typeof x === 'object' && 'name' in (x as Record<string, unknown>) ? (x as { name?: string }).name ?? '' : ''))
        .filter(Boolean)
        .join(', ');
    }
    return '';
  };
  const problem = asText(f[problemField]);
  const solution = asText(f[solutionField]);

  const rawCategory = f[categoryField] as unknown;
  let category: string | undefined;
  if (Array.isArray(rawCategory)) {
    const arr = rawCategory as AirtableSelectOption[];
    const first = arr[0];
    if (typeof first === 'string') category = first;
    else if (first && typeof first === 'object' && 'name' in first) category = (first as { name: string }).name;
  } else if (typeof rawCategory === 'string') {
    category = rawCategory as string;
  } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
    category = (rawCategory as { name: string }).name;
  }

  const route = (f[typeField] as string) || undefined;
  const order = sortField && typeof f[sortField] === 'number' ? (f[sortField] as number) : undefined;
  const repo = (f['Repo'] as string) || undefined;

  return { id: record.id, title: mappedTitle, blurb, category, route, order, problem, solution, repo };
}

// Fetch distinct category values from the table (dynamic chips)
export async function fetchAllCategories(maxPages = 10): Promise<string[]> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];
  if (!token || !baseId || !tableName) return [];

  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
  const seen = new Set<string>();
  let offset: string | undefined = undefined;
  let pages = 0;

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    // Request only the category field to minimize payload
    url.searchParams.append('fields[]', categoryField);
    // Only fetch categories from published ideas
    url.searchParams.set('filterByFormula', "{Status} = 'Published'");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 2 hours with revalidation
      next: {
        revalidate: 7200, // 2 hours
        tags: ['categories']
      },
    });
    if (!res.ok) break;
    const data = (await res.json()) as AirtableListResponse;

    for (const r of data.records) {
      const f = r.fields || {};
      const raw = f[categoryField] as unknown;
      if (!raw) continue;
      if (Array.isArray(raw)) {
        for (const v of raw as AirtableSelectOption[]) {
          if (typeof v === 'string') seen.add(v);
          else if (v && typeof v === 'object' && 'name' in v) seen.add((v as { name: string }).name);
        }
      } else if (typeof raw === 'string') {
        seen.add(raw);
      } else if (raw && typeof raw === 'object' && 'name' in (raw as Record<string, unknown>)) {
        seen.add((raw as { name: string }).name);
      }
    }

    offset = data.offset;
    pages += 1;
    if (!offset) break;
  }

  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

// Fetch categories from a single base
async function fetchCategoriesFromBase(
  token: string,
  baseId: string,
  tableName: string,
  maxPages = 10
): Promise<string[]> {
  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
  const seen = new Set<string>();
  let offset: string | undefined = undefined;
  let pages = 0;

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    url.searchParams.append('fields[]', categoryField);
    url.searchParams.set('filterByFormula', "{Status} = 'Published'");

    try {
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 7200,
          tags: ['categories']
        },
      });

      if (!res.ok) break;
      const data = (await res.json()) as AirtableListResponse;

      for (const r of data.records) {
        const f = r.fields || {};
        const raw = f[categoryField] as unknown;
        if (!raw) continue;
        if (Array.isArray(raw)) {
          for (const v of raw as AirtableSelectOption[]) {
            if (typeof v === 'string') seen.add(v);
            else if (v && typeof v === 'object' && 'name' in v) seen.add((v as { name: string }).name);
          }
        } else if (typeof raw === 'string') {
          seen.add(raw);
        }
      }

      offset = data.offset;
      pages += 1;
      if (!offset) break;
    } catch (error) {
      console.warn(`Failed to fetch categories from ${baseId}:`, error);
      break;
    }
  }

  return Array.from(seen);
}

// Fetch combined categories from BOTH bases
export async function fetchCombinedCategories(maxPages = 10): Promise<string[]> {
  const civicToken = process.env['AIRTABLE_TOKEN'];
  const civicBaseId = process.env['AIRTABLE_BASE_ID'];
  const civicTableName = process.env['AIRTABLE_TABLE_NAME'];

  const big5Token = process.env['AIRTABLE_BIG5_IDEAS_TOKEN'];
  const big5BaseId = process.env['AIRTABLE_BIG5_IDEAS_BASE_ID'];
  const big5TableName = process.env['AIRTABLE_BIG5_IDEAS_TABLE_NAME'];

  const [civicCategories, big5Categories] = await Promise.all([
    civicToken && civicBaseId && civicTableName
      ? fetchCategoriesFromBase(civicToken, civicBaseId, civicTableName, maxPages)
      : Promise.resolve([]),
    big5Token && big5BaseId && big5TableName
      ? fetchCategoriesFromBase(big5Token, big5BaseId, big5TableName, maxPages)
      : Promise.resolve([]),
  ]);

  const combined = new Set([...civicCategories, ...big5Categories]);
  return Array.from(combined).sort((a, b) => a.localeCompare(b));
}

// Helper to generate slugs consistently with ideas/page.tsx
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Helper function to fetch idea by title from a specific base
async function fetchIdeaByTitleFromBase(
  title: string,
  token: string,
  baseId: string,
  tableName: string
): Promise<IdeaItem | null> {
  if (!token || !baseId || !tableName) {
    return null;
  }

  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const lowerTitle = title.toLowerCase();
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  // Filter by formula: LOWER({Title}) = 'lowercase title' AND Status='Published'
  const titleFilter = `LOWER({${titleField}}) = '${lowerTitle.replace(/'/g, "\\'")}'`;
  const statusFilter = "{Status} = 'Published'";
  url.searchParams.set('filterByFormula', `AND(${titleFilter}, ${statusFilter})`);
  url.searchParams.set('pageSize', '1');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour with revalidation
      next: {
        revalidate: 3600, // 1 hour
        tags: ['idea-by-title']
      },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as AirtableListResponse;
    if (!data.records?.length) return null;

    const record = data.records[0];

    const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
    const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
    const sortField = process.env['AIRTABLE_SORT_FIELD'];
    const typeField = 'Type';

    const f = record.fields || {};
    const mappedTitle = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || title;
    const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';

    // Map Problem and Proposed Solution fields with safe coercion to strings
    const problemField = 'The Problem';
    const solutionField = 'Proposed Solution';
    const asText = (v: unknown): string => {
      if (typeof v === 'string') return v;
      if (Array.isArray(v)) {
        return (v as unknown[])
          .map((x) => (typeof x === 'string' ? x : x && typeof x === 'object' && 'name' in (x as Record<string, unknown>) ? (x as { name?: string }).name ?? '' : ''))
          .filter(Boolean)
          .join(', ');
      }
      return '';
    };
    const problem = asText(f[problemField]);
    const solution = asText(f[solutionField]);

    const rawCategory = f[categoryField] as unknown;
    let category: string | undefined;
    if (Array.isArray(rawCategory)) {
      const arr = rawCategory as AirtableSelectOption[];
      const first = arr[0];
      if (typeof first === 'string') category = first;
      else if (first && typeof first === 'object' && 'name' in first) category = (first as { name: string }).name;
    } else if (typeof rawCategory === 'string') {
      category = rawCategory as string;
    } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
      category = (rawCategory as { name: string }).name;
    }

    const route = (f[typeField] as string) || undefined;
    const order = sortField && typeof f[sortField] === 'number' ? (f[sortField] as number) : undefined;
    const repo = (f['Repo'] as string) || undefined;

    return { id: record.id, title: mappedTitle, blurb, category, route, order, problem, solution, repo };
  } catch (error) {
    console.warn(`Failed to fetch idea by title from base ${baseId}:`, error);
    return null;
  }
}

// Robust fetch by slug: search in BOTH bases and match by slugified title
export async function fetchIdeaBySlug(slug: string): Promise<IdeaItem | null> {
  // Fetch from both bases
  const civicToken = process.env['AIRTABLE_TOKEN'];
  const civicBaseId = process.env['AIRTABLE_BASE_ID'];
  const civicTableName = process.env['AIRTABLE_TABLE_NAME'];

  const big5Token = process.env['AIRTABLE_BIG5_IDEAS_TOKEN'];
  const big5BaseId = process.env['AIRTABLE_BIG5_IDEAS_BASE_ID'];
  const big5TableName = process.env['AIRTABLE_BIG5_IDEAS_TABLE_NAME'];

  // Search in both bases in parallel
  const [civicItems, big5Items] = await Promise.all([
    civicToken && civicBaseId && civicTableName
      ? fetchIdeasFromBase(civicToken, civicBaseId, civicTableName, 100)
      : Promise.resolve([]),
    big5Token && big5BaseId && big5TableName
      ? fetchIdeasFromBase(big5Token, big5BaseId, big5TableName, 100)
      : Promise.resolve([]),
  ]);

  // Combine all items
  const allItems = [...civicItems, ...big5Items];

  // Find matching item by slug
  for (const item of allItems) {
    if (slugifyTitle(item.title) === slug) {
      // Enrich with problem/solution via exact title fetch from the appropriate base
      // Try Civic base first, then Big5 base
      let enriched = await fetchIdeaByTitleFromBase(
        item.title,
        civicToken!,
        civicBaseId!,
        civicTableName!
      );

      if (!enriched && big5Token && big5BaseId && big5TableName) {
        enriched = await fetchIdeaByTitleFromBase(
          item.title,
          big5Token,
          big5BaseId,
          big5TableName
        );
      }

      return enriched ?? { ...item };
    }
  }

  return null;
}

// Tech Stack functions
export async function fetchTechStacks(pageSize = 12, offset?: string, categories?: string[], searchQuery?: string): Promise<{ items: TechStackItem[]; offset?: string }> {
  const token = process.env['AIRTABLE_TECH_TOKEN'] || process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_TECH_BASE_ID'] || process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TECH_TABLE_NAME'] || 'Tech Stack';
  const tableId = process.env['AIRTABLE_TECH_TABLE_ID'];

  if (!token || !baseId || (!tableName && !tableId)) {
    return { items: [], offset: undefined };
  }

  const nameField = process.env['AIRTABLE_TECH_NAME_FIELD'] || 'Name';
  const categoryField = process.env['AIRTABLE_TECH_CATEGORY_FIELD'] || 'Category';
  const descField = process.env['AIRTABLE_TECH_DESC_FIELD'] || 'Tech Description';
  const urlField = process.env['AIRTABLE_TECH_URL_FIELD'] || 'Website/Docs URL';

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId || tableName)}`);
  url.searchParams.set('pageSize', String(pageSize));
  if (offset) url.searchParams.set('offset', offset);

  // Build filter formula combining categories and search
  const filterParts: string[] = [];
  
  // Apply category filter if provided (multi-select OR logic)
  if (categories && categories.length > 0) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    const perCat = categories.map((c) => 
      `OR({${categoryField}} = '${esc(c)}', FIND('${esc(c)}', ARRAYJOIN({${categoryField}})))`
    );
    filterParts.push(`OR(${perCat.join(',')})`);
  }
  
  // Apply search filter if provided
  if (searchQuery && searchQuery.trim()) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    const query = esc(searchQuery.trim().toLowerCase());
    filterParts.push(`OR(FIND('${query}', LOWER({${nameField}})), FIND('${query}', LOWER({${descField}})))`);
  }
  
  // Combine filters with AND logic
  if (filterParts.length > 0) {
    const formula = filterParts.length === 1 ? filterParts[0] : `AND(${filterParts.join(',')})`;
    url.searchParams.set('filterByFormula', formula);
    console.log('Tech Stack Filter Formula:', formula);
  }
  
  console.log('Tech Stack API URL:', url.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Cache for 1 hour with revalidation
    next: {
      revalidate: 3600, // 1 hour
      tags: ['tech-stacks']
    },
  });
  
  if (!res.ok) {
    console.error('Airtable API error:', res.status, res.statusText);
    try {
      const errorBody = await res.text();
      console.error('Airtable API error body:', errorBody);
    } catch (e) {
      console.error('Could not read error response body:', e);
    }
    return { items: [], offset: undefined };
  }

  const data = (await res.json()) as AirtableListResponse;
  console.log('Fetched tech stacks:', data.records.length, 'records');

  const items: TechStackItem[] = data.records.map((r) => {
    const f = r.fields || {};
    const name = (f[nameField] as string) || 'Untitled';
    const description = (f[descField] as string) || '';
    const url = (f[urlField] as string) || '';

    // Handle multi-select categories
    const rawCategory = f[categoryField] as unknown;
    let category: string[] = [];
    if (Array.isArray(rawCategory)) {
      category = (rawCategory as AirtableSelectOption[]).map(c => 
        typeof c === 'string' ? c : (c && typeof c === 'object' && 'name' in c ? (c as { name: string }).name : '')
      ).filter(Boolean);
    } else if (typeof rawCategory === 'string') {
      category = [rawCategory];
    }

    const item = { id: r.id, name, category, description, url };
    console.log('Tech stack item:', item.name, 'categories:', item.category);
    return item;
  });

  console.log('Total items returned:', items.length);
  return { items, offset: data.offset };
}

export async function fetchAllTechCategories(maxPages = 10): Promise<string[]> {
  const token = process.env['AIRTABLE_TECH_TOKEN'] || process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_TECH_BASE_ID'] || process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TECH_TABLE_NAME'] || 'Tech Stack';
  const tableId = process.env['AIRTABLE_TECH_TABLE_ID'];
  
  if (!token || !baseId || (!tableName && !tableId)) return [];

  const categoryField = process.env['AIRTABLE_TECH_CATEGORY_FIELD'] || 'Category';
  const seen = new Set<string>();
  let offset: string | undefined = undefined;
  let pages = 0;

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId || tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    url.searchParams.append('fields[]', categoryField);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 2 hours with revalidation
      next: {
        revalidate: 7200, // 2 hours
        tags: ['tech-categories']
      },
    });
    if (!res.ok) {
      console.error('Airtable categories API error:', res.status, res.statusText);
      try {
        const errorBody = await res.text();
        console.error('Airtable categories error body:', errorBody);
      } catch (e) {
        console.error('Could not read categories error response body:', e);
      }
      break;
    }
    const data = (await res.json()) as AirtableListResponse;

    for (const r of data.records) {
      const f = r.fields || {};
      const raw = f[categoryField] as unknown;
      if (!raw) continue;
      if (Array.isArray(raw)) {
        for (const v of raw as AirtableSelectOption[]) {
          if (typeof v === 'string' && v.trim()) seen.add(v.trim());
          else if (v && typeof v === 'object' && 'name' in v && (v as { name: string }).name?.trim()) {
            seen.add((v as { name: string }).name.trim());
          }
        }
      } else if (typeof raw === 'string' && raw.trim()) {
        seen.add(raw.trim());
      }
    }

    offset = data.offset;
    pages += 1;
    if (!offset) break;
  }

  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

// Fetch all ideas with minimal data for navigation purposes
export async function fetchAllIdeasMinimal(): Promise<Array<{ id: string; title: string; slug: string }>> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];

  if (!token || !baseId || !tableName) {
    return [];
  }

  const sortField = process.env['AIRTABLE_SORT_FIELD'];
  const sortDirection = (process.env['AIRTABLE_SORT_DIRECTION'] || 'asc') as 'asc' | 'desc';
  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const orderField = sortField || undefined;

  const allIdeas: Array<{ id: string; title: string; slug: string }> = [];
  let offset: string | undefined = undefined;
  let pages = 0;
  const maxPages = 20; // Reasonable limit to prevent infinite loops

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    // Add Status='Published' filter
    url.searchParams.set('filterByFormula', "{Status} = 'Published'");
    if (sortField) {
      url.searchParams.set('sort[0][field]', sortField);
      url.searchParams.set('sort[0][direction]', sortDirection);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour with revalidation
      next: {
        revalidate: 3600, // 1 hour
        tags: ['all-ideas-minimal']
      },
    });

    if (!res.ok) {
      console.warn(`Airtable API error: ${res.status} ${res.statusText}`);
      break;
    }

    const data = (await res.json()) as AirtableListResponse;

    for (const r of data.records) {
      const f = r.fields || {};
      const title = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || 'Untitled Idea';
      const slug = slugifyTitle(title);
      
      allIdeas.push({
        id: r.id,
        title,
        slug
      });
    }

    offset = data.offset;
    pages += 1;
    if (!offset) break;
  }

  // Sort client-side if a numeric sort field exists
  if (orderField) {
    allIdeas.sort((a, b) => {
      // This is a simplified sort - in practice, we'd need to fetch the order field
      // For now, we'll rely on the server-side sort from Airtable
      return 0;
    });
  }

  return allIdeas;
}