import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = process.cwd();
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const changelog = readFileSync(resolve(root, 'CHANGELOG.md'), 'utf8');
const version = `v${pkg.version}`;
if (!new RegExp(`^##\\s+${version.replaceAll('.', '\\.')}(?:\\s|$)`, 'm').test(changelog)) {
  console.error(`CHANGELOG.md must contain an entry for ${version}`);
  process.exit(1);
}
console.log(`Changelog contains ${version}`);
