import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate } from './validate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Copies the repository to a temp dir, applies `mutate`, and validates the copy.
function validateCopy(mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'orangescrum-mcp-'));
  try {
    cpSync(ROOT, dir, { recursive: true, filter: (src) => !/[\\/](\.git|node_modules)$/.test(src) });
    mutate(dir);
    return validate(dir).errors;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const editJson = (dir, file, fn) => {
  const path = join(dir, file);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  fn(data);
  writeFileSync(path, JSON.stringify(data, null, 2));
};

test('the repository passes validation', () => {
  assert.deepEqual(validate(ROOT).errors, []);
});

test('an endpoint that drifts from server.json is reported', () => {
  const errors = validateCopy((dir) => editJson(dir, '.mcp.json', (d) => {
    d.mcpServers.orangescrum.url = 'https://example.com/mcp';
  }));
  assert.ok(errors.some((e) => e.startsWith('.mcp.json') && e.includes('does not match')));
});

test('a registry description over 100 characters is reported', () => {
  const errors = validateCopy((dir) => editJson(dir, 'server.json', (d) => {
    d.description = 'x'.repeat(101);
  }));
  assert.ok(errors.some((e) => e.startsWith('server.json') && e.includes('description')));
});

test('a name outside the com.orangescrum namespace is reported', () => {
  const errors = validateCopy((dir) => editJson(dir, 'server.json', (d) => {
    d.name = 'io.github.someone/orangescrum';
  }));
  assert.ok(errors.some((e) => e.includes('com.orangescrum namespace')));
});

test('a skill that calls an unknown tool is reported', () => {
  const errors = validateCopy((dir) => {
    const file = join(dir, 'skills/triage-defect/SKILL.md');
    writeFileSync(file, `${readFileSync(file, 'utf8')}\nThen call \`create_bug_ticket\`.\n`);
  });
  assert.ok(errors.some((e) => e.includes('unknown tool "create_bug_ticket"')));
});

test('a skill whose name does not match its directory is reported', () => {
  const errors = validateCopy((dir) => {
    const file = join(dir, 'skills/sprint-dashboard/SKILL.md');
    writeFileSync(file, readFileSync(file, 'utf8').replace('name: sprint-dashboard', 'name: sprint-board'));
  });
  assert.ok(errors.some((e) => e.includes('must match its directory')));
});

test('a long dash in content is reported', () => {
  const errors = validateCopy((dir) => {
    const file = join(dir, 'README.md');
    writeFileSync(file, `${readFileSync(file, 'utf8')}\nOne more line \u2014 with a long dash.\n`);
  });
  assert.ok(errors.some((e) => e.startsWith('README.md:') && e.includes('long dash')));
});

test('a client guide with a stale MCP URL is reported', () => {
  const errors = validateCopy((dir) => {
    const file = join(dir, 'docs/clients/coding-agents.md');
    writeFileSync(file, `${readFileSync(file, 'utf8')}\nUse https://old.orangescrum.com/mcp/partner here.\n`);
  });
  assert.ok(errors.some((e) => e.startsWith('docs/clients/coding-agents.md:') && e.includes('old.orangescrum.com')));
});

test('a broken relative link is reported', () => {
  const errors = validateCopy((dir) => {
    const file = join(dir, 'README.md');
    writeFileSync(file, `${readFileSync(file, 'utf8')}\nSee [the guide](docs/missing.md).\n`);
  });
  assert.ok(errors.some((e) => e.includes('broken link to docs/missing.md')));
});

test('mismatched plugin versions are reported', () => {
  const errors = validateCopy((dir) => editJson(dir, '.cursor-plugin/plugin.json', (d) => {
    d.version = '9.9.9';
  }));
  assert.ok(errors.some((e) => e.startsWith('.cursor-plugin/plugin.json') && e.includes('differs')));
});
