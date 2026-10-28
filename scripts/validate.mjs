#!/usr/bin/env node
// Validates the repository's manifests, registry entry, and skills.
// Usage: node scripts/validate.mjs [repo-root]
// Exits 1 and prints every problem found; prints a summary and exits 0 otherwise.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SERVER_NAME = /^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/;
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Long dashes are not used anywhere in this repository's content.
const DASHES = /[\u2013\u2014]/;
// Tool names start with one of these verbs; anything else in backticks is
// treated as an ordinary identifier, not a tool reference.
const TOOL_VERBS = [
  'add', 'apply', 'approve', 'archive', 'assign', 'attach', 'cancel', 'cast', 'check', 'clock',
  'close', 'compare', 'complete', 'create', 'deactivate', 'delete', 'detach', 'export', 'generate',
  'get', 'launch', 'link', 'list', 'override', 'place', 'preview', 'recompute', 'record', 'reject',
  'remove', 'rename', 'reorder', 'rerun', 'restore', 'revoke', 'search', 'set', 'start',
  'transition', 'unassign', 'unlink', 'update',
];
const TOOL_REF = new RegExp(`\\b((?:${TOOL_VERBS.join('|')})_[a-z0-9_]+)\\b`, 'g');
// Every Orangescrum MCP URL in the docs must be the registry endpoint, except
// the older hostname, which stays documented while existing clients move.
const MCP_URL = /https:\/\/[a-z0-9.-]*orangescrum\.com\/mcp\/[a-z-]+/g;
const LEGACY_ENDPOINTS = new Set(['https://v4-api.orangescrum.com/mcp/partner']);
const TEXT_EXT = /\.(md|json|ya?ml|mjs|js|svg|txt)$|^(CODEOWNERS|LICENSE|\.gitignore)$/;

export function validate(root) {
  const errors = [];
  const fail = (file, msg) => errors.push(`${file}: ${msg}`);

  const readJson = (file) => {
    const path = join(root, file);
    if (!existsSync(path)) {
      fail(file, 'missing');
      return null;
    }
    try {
      return JSON.parse(readFileSync(path, 'utf8'));
    } catch (e) {
      fail(file, `invalid JSON (${e.message})`);
      return null;
    }
  };

  const server = readJson('server.json');
  const dotMcp = readJson('.mcp.json');
  const mcp = readJson('mcp.json');
  const plugin = readJson('plugin.json');
  const gemini = readJson('gemini-extension.json');
  const claudePlugin = readJson('.claude-plugin/plugin.json');
  const marketplace = readJson('.claude-plugin/marketplace.json');
  const cursorPlugin = readJson('.cursor-plugin/plugin.json');
  const toolList = readJson('scripts/tools.json');

  // server.json: the rules the MCP Registry enforces on publish.
  let endpoint = null;
  if (server) {
    if (!SERVER_NAME.test(server.name ?? '')) fail('server.json', 'name must look like com.example/server-name');
    if (!server.name?.startsWith('com.orangescrum/')) fail('server.json', 'name must use the com.orangescrum namespace');
    if (!server.description || server.description.length > 100) fail('server.json', 'description is required and at most 100 characters');
    if (server.title && server.title.length > 100) fail('server.json', 'title is at most 100 characters');
    if (!SEMVER.test(server.version ?? '')) fail('server.json', 'version must be semantic, e.g. 1.0.0');
    const remotes = server.remotes ?? [];
    if (remotes.length === 0) fail('server.json', 'at least one remote is required');
    for (const r of remotes) {
      if (!['streamable-http', 'sse'].includes(r.type)) fail('server.json', `unknown remote type "${r.type}"`);
      if (!/^https:\/\//.test(r.url ?? '')) fail('server.json', `remote url must be https: ${r.url}`);
    }
    endpoint = remotes.find((r) => r.type === 'streamable-http')?.url ?? null;
    if (!endpoint) fail('server.json', 'a streamable-http remote is required');
  }

  // Every client manifest must point at the registry endpoint.
  const sameEndpoint = (file, url) => {
    if (endpoint && url !== endpoint) fail(file, `endpoint ${url} does not match server.json ${endpoint}`);
  };
  if (dotMcp) {
    const s = dotMcp.mcpServers?.orangescrum;
    if (!s) fail('.mcp.json', 'mcpServers.orangescrum is missing');
    else {
      if (s.type !== 'http') fail('.mcp.json', 'type must be "http" (client vocabulary)');
      sameEndpoint('.mcp.json', s.url);
    }
  }
  if (mcp) {
    const s = mcp.mcpServers?.orangescrum;
    if (!s) fail('mcp.json', 'mcpServers.orangescrum is missing');
    else {
      if (s.type !== 'streamable-http') fail('mcp.json', 'type must be "streamable-http" (Agent Plugins vocabulary)');
      sameEndpoint('mcp.json', s.url);
    }
  }
  if (gemini) {
    const servers = Object.values(gemini.mcpServers ?? {});
    if (servers.length !== 1) fail('gemini-extension.json', 'exactly one MCP server is expected');
    for (const s of servers) sameEndpoint('gemini-extension.json', s.httpUrl);
  }

  // Plugin names and versions stay aligned across formats.
  const named = [
    ['plugin.json', plugin?.name],
    ['.claude-plugin/plugin.json', claudePlugin?.name],
    ['.cursor-plugin/plugin.json', cursorPlugin?.name],
    ['.claude-plugin/marketplace.json', marketplace?.plugins?.[0]?.name],
  ];
  for (const [file, name] of named) {
    if (name !== undefined && name !== 'orangescrum') fail(file, `plugin name must be "orangescrum", got "${name}"`);
  }
  const versioned = [
    ['plugin.json', plugin?.version],
    ['.cursor-plugin/plugin.json', cursorPlugin?.version],
    ['.claude-plugin/marketplace.json', marketplace?.plugins?.[0]?.version],
    ['gemini-extension.json', gemini?.version],
  ];
  const baseVersion = plugin?.version;
  for (const [file, version] of versioned) {
    if (version !== undefined && !SEMVER.test(version)) fail(file, `version "${version}" is not semantic`);
    if (version !== undefined && baseVersion && version !== baseVersion) fail(file, `version ${version} differs from plugin.json ${baseVersion}`);
  }
  for (const [file, manifest] of [['.claude-plugin/plugin.json', claudePlugin], ['.cursor-plugin/plugin.json', cursorPlugin]]) {
    if (!manifest) continue;
    if (manifest.mcpServers !== './.mcp.json') fail(file, 'mcpServers must be "./.mcp.json"');
    if (manifest.skills !== './skills/') fail(file, 'skills must be "./skills/"');
  }
  if (cursorPlugin?.logo && !existsSync(join(root, cursorPlugin.logo))) fail('.cursor-plugin/plugin.json', `logo ${cursorPlugin.logo} not found`);

  // Skills: frontmatter, and only tools the server really exposes.
  const knownTools = new Set(toolList?.tools ?? []);
  if (toolList && toolList.count !== knownTools.size) fail('scripts/tools.json', `count ${toolList.count} does not match ${knownTools.size} listed tools`);
  const skillsDir = join(root, 'skills');
  const skillDirs = existsSync(skillsDir)
    ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory())
    : [];
  if (skillDirs.length === 0) fail('skills/', 'no skills found');
  for (const dir of skillDirs) {
    const file = `skills/${dir}/SKILL.md`;
    const path = join(root, file);
    if (!existsSync(path)) {
      fail(file, 'missing');
      continue;
    }
    const text = readFileSync(path, 'utf8');
    const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) {
      fail(file, 'frontmatter is missing');
      continue;
    }
    const name = fm[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = fm[1].match(/^description:\s*"?(.+?)"?$/m)?.[1]?.trim();
    if (name !== dir) fail(file, `name "${name}" must match its directory "${dir}"`);
    if (!SKILL_NAME.test(name ?? '')) fail(file, 'name must be lowercase words joined by hyphens');
    if (!description) fail(file, 'description is required');
    else if (description.length > 1024) fail(file, 'description is at most 1024 characters');
  }
  for (const file of walk(skillsDir).map((p) => relative(root, p)).filter((p) => p.endsWith('.md'))) {
    const text = readFileSync(join(root, file), 'utf8');
    for (const [, tool] of text.matchAll(TOOL_REF)) {
      if (!knownTools.has(tool)) fail(file, `references unknown tool "${tool}"`);
    }
  }

  // Content rules and relative links across every text file.
  for (const path of walk(root)) {
    const file = relative(root, path);
    const base = file.split('/').pop();
    if (!TEXT_EXT.test(base)) continue;
    const text = readFileSync(path, 'utf8');
    text.split('\n').forEach((line, i) => {
      if (DASHES.test(line)) fail(`${file}:${i + 1}`, 'contains a long dash; use a comma, colon, or parentheses');
      for (const [url] of line.matchAll(MCP_URL)) {
        if (endpoint && !file.startsWith('scripts/') && url !== endpoint && !LEGACY_ENDPOINTS.has(url)) {
          fail(`${file}:${i + 1}`, `MCP URL ${url} does not match server.json ${endpoint}`);
        }
      }
    });
    if (file.endsWith('.md')) {
      for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^(https?:|mailto:|#)/.test(target)) continue;
        const local = target.split('#')[0];
        if (local && !existsSync(resolve(dirname(path), local))) fail(file, `broken link to ${target}`);
      }
    }
  }

  return { errors, skills: skillDirs.length, tools: knownTools.size, endpoint };
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    if (entry === '.git' || entry === 'node_modules') return [];
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
  const { errors, skills, tools, endpoint } = validate(root);
  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} problem(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`OK: ${skills} skills, ${tools} known tools, endpoint ${endpoint}`);
}
