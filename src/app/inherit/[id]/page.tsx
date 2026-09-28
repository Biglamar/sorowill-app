import type { Metadata } from 'next';

import { getCachedWill, buildWillMetadataDescription } from '@/lib/willMetadata';
import InheritPageClient from './InheritPageClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  let title = 'Inheritance';
  let description = 'Claim your inheritance from a SoroWill.';
  const { id } = await params;

  try {
    const will = await getCachedWill(id);
    title = `Inheritance — Will #${will.id}`;
    description = `Claim your inheritance from Will #${will.id}. ${buildWillMetadataDescription(will)}`;
  } catch {
    // Graceful fallback — if the will fetch fails, keep generic metadata.
  }

  return { title, description };
}

export default async function InheritPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InheritPageClient id={id} />;
}
