#!/usr/bin/env node
/**
 * Portable wrapper for ripgrep (rg).
 * Resolves the platform-specific binary from @vscode/ripgrep
 * so agents and scripts can run `node tools/rg.mjs <args>`.
 */
import { rgPath } from '@vscode/ripgrep';
import { execFileSync } from 'node:child_process';

try {
  execFileSync(rgPath, process.argv.slice(2), { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status ?? 1);
}
