import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Metadata } from 'next';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Changelog | SoroWill',
  description: 'SoroWill protocol updates and release notes',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChangelogEntry {
  version: string;
  date: string;
  sections: { heading: string; items: string[] }[];
}

// ---------------------------------------------------------------------------
// CHANGELOG.md parser
// ---------------------------------------------------------------------------

/**
 * Parse CHANGELOG.md (Keep a Changelog format) into structured entries.
 *
 * Only released versions are returned — [Unreleased] is skipped.
 * Within each version block, ### sub-headings (Added, Fixed, …) are
 * preserved as section groups.  Plain bullet lines without a sub-heading
 * fall into an implicit "Changed" group.
 */
function parseChangelog(content: string): ChangelogEntry[] {
  const lines = content.split('\n');
  const entries: ChangelogEntry[] = [];

  let currentEntry: ChangelogEntry | null = null;
  let currentSection: { heading: string; items: string[] } | null = null;

  const flush = () => {
    if (currentSection && currentEntry) {
      if (currentSection.items.length > 0) {
        currentEntry.sections.push(currentSection);
      }
      currentSection = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Released version heading: ## [X.Y.Z] - YYYY-MM-DD
    const versionMatch = line.match(/^##\s+\[([^\]]+)\](?:\s+-\s+(.*))?/);
    if (versionMatch) {
      const tag = versionMatch[1];
      if (tag.toLowerCase() === 'unreleased') continue;

      // Save previous entry
      flush();
      if (currentEntry) entries.push(currentEntry);

      currentEntry = {
        version: tag,
        date: versionMatch[2]?.trim() ?? '',
        sections: [],
      };
      currentSection = null;
      continue;
    }

    if (!currentEntry) continue;

    // Sub-section heading: ### Added / Fixed / Changed …
    const subHeadingMatch = line.match(/^###\s+(.*)/);
    if (subHeadingMatch) {
      flush();
      currentSection = { heading: subHeadingMatch[1].trim(), items: [] };
      continue;
    }

    // Bullet item: - text  or  * text
    const bulletMatch = line.match(/^[*-]\s+(.*)/);
    if (bulletMatch) {
      if (!currentSection) {
        currentSection = { heading: 'Changes', items: [] };
      }
      currentSection.items.push(bulletMatch[1].trim());
    }
  }

  // Flush last section / entry
  flush();
  if (currentEntry) entries.push(currentEntry);

  return entries;
}

// ---------------------------------------------------------------------------
// Data — read at build time (server component)
// ---------------------------------------------------------------------------

function loadChangelogEntries(): ChangelogEntry[] {
  try {
    const changelogPath = resolve(process.cwd(), 'CHANGELOG.md');
    const content = readFileSync(changelogPath, 'utf-8');
    return parseChangelog(content);
  } catch {
    // In test environments CHANGELOG.md may not be present; return empty.
    return [];
  }
}

const CHANGELOG_ENTRIES = loadChangelogEntries();

// ---------------------------------------------------------------------------
// Roadmap items — kept static (not version-controlled in CHANGELOG)
// ---------------------------------------------------------------------------

const ROADMAP_ITEMS = [
  'Multi-asset support (beyond USDC)',
  'Guardian delegation and notification systems',
  'Advanced inheritance triggers and conditions',
  'Cross-chain interoperability',
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChangelogPage() {
  return (
    <div className="space-y-8 pb-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-will-light">Changelog</h1>
        <p className="text-will-light/60">
          Protocol updates, new features, and improvements to SoroWill.
        </p>
      </section>

      <section className="space-y-8">
        {CHANGELOG_ENTRIES.map((entry, index) => (
          <div
            key={entry.version}
            className={`rounded-lg border bg-white/5 p-6 ${index === 0 ? 'border-will-purple' : 'border-white/10'}`}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-will-light">v{entry.version}</h2>
                {entry.sections[0] && (
                  <p className="text-sm text-will-light/60">{entry.sections[0].heading}</p>
                )}
              </div>
              {entry.date && (
                <time className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-will-light/70">
                  {entry.date}
                </time>
              )}
            </div>

            {entry.sections.map((section) => (
              <div key={section.heading} className="mt-4">
                {entry.sections.length > 1 && (
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-will-light/50">
                    {section.heading}
                  </h3>
                )}
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-will-light/80">
                      <span className="shrink-0 text-will-purple">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {index === 0 && (
              <div className="mt-4 rounded-lg border border-will-purple/30 bg-will-purple/10 p-3">
                <p className="text-sm text-will-purple">🚀 Latest Release</p>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-will-light">Future Roadmap</h3>
        <ul className="mt-4 space-y-2 text-will-light/80">
          {ROADMAP_ITEMS.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="shrink-0 text-will-purple">◊</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
