#!/usr/bin/env node
/**
 * scripts/validate-changelog.mjs
 *
 * Validates that CHANGELOG.md is in sync with package.json:
 *   1. CHANGELOG.md must exist.
 *   2. The first released version heading (## [X.Y.Z]) must match
 *      the `version` field in package.json exactly.
 *   3. The matching version must have at least one bullet-point entry
 *      (non-blank content between its heading and the next heading).
 *
 * Exit codes:
 *   0 — validation passed
 *   1 — validation failed (reason printed to stderr)
 *
 * The pure-logic helpers (parseChangelogTopVersion, validateChangelog) are
 * exported for use in unit tests without any filesystem side-effects.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// ---------------------------------------------------------------------------
// Pure helpers (exported for unit tests)
// ---------------------------------------------------------------------------

/**
 * Parse the first released version tag from CHANGELOG content.
 *
 * Skips the [Unreleased] section if present, and returns the first
 * `## [X.Y.Z]` heading version string, or null if none is found.
 *
 * @param {string} changelogContent - Raw text of CHANGELOG.md
 * @returns {string | null}
 */
export function parseChangelogTopVersion(changelogContent) {
  // Match lines like:  ## [1.2.3] - 2026-01-15
  // Capture just the version number, skip [Unreleased].
  const versionHeadingRe = /^##\s+\[([^\]]+)\]/gm;

  let match;
  while ((match = versionHeadingRe.exec(changelogContent)) !== null) {
    const tag = match[1];
    if (tag.toLowerCase() !== 'unreleased') {
      return tag;
    }
  }
  return null;
}

/**
 * Check that the version section contains at least one non-blank line
 * of content (i.e. it isn't an empty stub).
 *
 * @param {string} changelogContent - Raw text of CHANGELOG.md
 * @param {string} version - Version string to look for (without brackets)
 * @returns {boolean}
 */
export function versionHasEntries(changelogContent, version) {
  // Find the heading for this version and capture everything until the
  // next ## heading (or end of file).
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Split the document on ## headings, find the block for this version.
  // Using split avoids end-of-string anchor issues across JS engines.
  const blocks = changelogContent.split(/^(?=##\s)/m);
  const target = blocks.find((block) =>
    new RegExp(`^##\\s+\\[${escapedVersion}\\]`, 'i').test(block),
  );
  if (!target) return false;

  // Strip the heading line itself, then check remaining lines.
  const bodyLines = target.split('\n').slice(1);
  return bodyLines.some((line) => line.trim().length > 0);
}

/**
 * Core validation logic.  Returns { ok: true } on success or
 * { ok: false, error: string } on failure.  No filesystem access.
 *
 * @param {string} changelogContent - Raw text of CHANGELOG.md
 * @param {string} packageVersion   - `version` field from package.json
 * @returns {{ ok: true } | { ok: false; error: string }}
 */
export function validateChangelog(changelogContent, packageVersion) {
  const topVersion = parseChangelogTopVersion(changelogContent);

  if (topVersion === null) {
    return {
      ok: false,
      error:
        'CHANGELOG.md has no released version entries. ' +
        'Add a "## [X.Y.Z] - YYYY-MM-DD" heading for the current release.',
    };
  }

  if (topVersion !== packageVersion) {
    return {
      ok: false,
      error:
        `CHANGELOG.md top version [${topVersion}] does not match ` +
        `package.json version "${packageVersion}". ` +
        `Update CHANGELOG.md (or run \`node scripts/bump-version.mjs\`) ` +
        `before merging.`,
    };
  }

  if (!versionHasEntries(changelogContent, packageVersion)) {
    return {
      ok: false,
      error:
        `CHANGELOG.md has an entry for [${packageVersion}] but it contains ` +
        `no content. Add at least one bullet describing what changed.`,
    };
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// CLI runner — only executes when the file is run directly
// ---------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const root = resolve(__dirname, '..');

  // Read CHANGELOG.md
  let changelogContent;
  try {
    changelogContent = readFileSync(resolve(root, 'CHANGELOG.md'), 'utf-8');
  } catch {
    process.stderr.write(
      'ERROR: CHANGELOG.md not found. Create it before running this check.\n',
    );
    process.exit(1);
  }

  // Read package.json version
  let packageVersion;
  try {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
    packageVersion = pkg.version;
    if (!packageVersion) throw new Error('version field missing');
  } catch {
    process.stderr.write('ERROR: Could not read version from package.json.\n');
    process.exit(1);
  }

  const result = validateChangelog(changelogContent, packageVersion);

  if (!result.ok) {
    process.stderr.write(`\nChangelog validation FAILED:\n  ${result.error}\n\n`);
    process.exit(1);
  }

  process.stdout.write(
    `Changelog OK — CHANGELOG.md top version matches package.json (${packageVersion})\n`,
  );
  process.exit(0);
}
