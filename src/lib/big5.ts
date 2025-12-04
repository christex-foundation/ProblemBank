// Big5 Hackathon Submission Airtable helpers
// Reads credentials from environment variables
// AIRTABLE_BIG5_TOKEN, AIRTABLE_BIG5_BASE_ID, AIRTABLE_BIG5_TABLE_ID
// Falls back to base AIRTABLE_* if BIG5_* not set

export type Big5Submission = {
  id: string;
  teamName: string;
  teamLeadName: string;
  email: string;
  phone: string;
  track: 'AI Pulse' | 'DeepStack';
  focusArea: string;
  ideaTitle: string;
  ideaSummary: string;
  teamMembers?: string;
  githubRepo?: string;
  createdAt?: string;
  clientIp?: string;
};

type AirtableListResponse = {
  records: Array<{
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string;
  }>;
  offset?: string;
};

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

function getEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] || fallback;
}

export async function createBig5Submission(input: {
  teamName?: string;
  teamLeadName: string;
  email: string;
  phone: string;
  track: 'AI Pulse' | 'DeepStack';
  focusArea?: string;
  ideaTitle: string;
  ideaSummary?: string;
  teamMembers?: string;
  githubRepo: string;
  presentationVideo: string;
  technicalVideo: string;
  productLogo: string;
  location: string;
  productDescription: string;
  clientIp?: string;
}): Promise<{ id: string }> {
  const token = getEnv('AIRTABLE_BIG5_TOKEN', process.env['AIRTABLE_TOKEN']);
  const baseId = getEnv('AIRTABLE_BIG5_BASE_ID', process.env['AIRTABLE_BASE_ID']);
  const tableId = getEnv('AIRTABLE_BIG5_TABLE_ID');

  console.log('Big5 Airtable credentials check:', {
    hasToken: !!token,
    hasBaseId: !!baseId,
    hasTableId: !!tableId,
    tokenLength: token?.length || 0,
    baseIdValue: baseId,
    tableIdValue: tableId
  });

  if (!token || !baseId || !tableId) {
    throw new Error(`Missing Airtable credentials for Big5. Token: ${!!token}, BaseId: ${!!baseId}, TableId: ${!!tableId}`);
  }

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${tableId}`);

  const fields: Record<string, string> = {
    'Name': input.teamLeadName,
    'Email': input.email,
    'Phone': input.phone,
    'Track': input.track,
    'Idea Title': input.ideaTitle,
    'Link to submission (GitHub Repo, v0 etc...)': input.githubRepo,
    'Presentation Video': input.presentationVideo,
    'Technical Video': input.technicalVideo,
    'Product Logo': input.productLogo,
    'Location': input.location,
    'Product Description': input.productDescription,
  };

  // Add optional fields only if they have values
  if (input.teamName && input.teamName.trim()) {
    fields['Team Name'] = input.teamName.trim();
  }
  if (input.teamMembers && input.teamMembers.trim()) {
    fields['Team Members'] = input.teamMembers.trim();
  }

  const record = { fields };

  console.log('Sending Big5 submission to Airtable:', JSON.stringify(record, null, 2));

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return { id: data.id };
}

export async function listBig5Submissions(limit = 50): Promise<Big5Submission[]> {
  const token = getEnv('AIRTABLE_BIG5_TOKEN', process.env['AIRTABLE_TOKEN']);
  const baseId = getEnv('AIRTABLE_BIG5_BASE_ID', process.env['AIRTABLE_BASE_ID']);
  const tableId = getEnv('AIRTABLE_BIG5_TABLE_ID');

  if (!token || !baseId || !tableId) {
    console.warn('Missing Airtable credentials for Big5');
    return [];
  }

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${tableId}`);
  url.searchParams.set('pageSize', String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Airtable API error:', res.status, res.statusText, errorText);
    return [];
  }

  const data = (await res.json()) as AirtableListResponse;

  const submissions: Big5Submission[] = data.records.map((r) => {
    const f = r.fields || {};

    return {
      id: r.id,
      teamName: (f['Team Name'] as string) || '',
      teamLeadName: (f['Name'] as string) || '',
      email: (f['Email'] as string) || '',
      phone: (f['Phone'] as string) || '',
      track: (f['Track'] as 'AI Pulse' | 'DeepStack') || 'AI Pulse',
      focusArea: '', // Not stored in your Airtable
      ideaTitle: (f['Idea Title'] as string) || '',
      ideaSummary: '', // Not stored in your Airtable
      teamMembers: (f['Team Members'] as string) || undefined,
      githubRepo: (f['Link to submission (GitHub Repo, v0 etc...)'] as string) || undefined,
      createdAt: r.createdTime || new Date().toISOString(),
      clientIp: undefined, // Not stored in your Airtable
    };
  });

  return submissions;
}
