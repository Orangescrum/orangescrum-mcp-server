# Contributing to the Orangescrum MCP Server

Thanks for your interest in contributing. Pull requests, issues, and comments are all welcome.

It helps to know what lives in this repo: the documentation, the portable Agent Plugins package (`plugin.json`, `mcp.json`, and `skills/`), the client-specific manifests (`.mcp.json` and the Claude, Cursor, and Gemini plugin manifests), and the MCP registry entry (`server.json`). The server itself runs as a hosted service at `mcp.orangescrum.com` and isn't part of this repo, so changes here are about those public-facing pieces.

## Opening an issue

Use one of the [issue forms](https://github.com/Orangescrum/orangescrum-mcp-server/issues/new/choose). If your report is really about the hosted server, sign-in, or your workspace rather than this repo, the forms will point you to faster support channels.

## Sending a pull request

A few things that make review easier:

- Keep each pull request focused on one change. Split unrelated work into separate PRs.
- Match the existing style and structure of the file you're editing.
- If you touch a manifest (`plugin.json`, `mcp.json`, `.mcp.json`, `server.json`, or a client-specific plugin file), keep equivalent names, endpoints, and shared component paths aligned.
- After changing a manifest or skill, run `npm run validate` and `npm test` (Node.js 18 or later, no install step needed). These check that every manifest parses and points at the same endpoint, that `server.json` meets the registry's rules, that each skill has valid frontmatter, and that only tools the server really exposes are referenced.
- Skills must call tools by their exact `snake_case` names. Check the [tool reference](https://helpdesk.orangescrum.com/guide/mcp/tools) before adding one.
- For a larger change, open an issue first so we can talk it through before you put in the work.

## Releasing

Changes to `server.json` reach the MCP Registry only when a maintainer publishes them. See [docs/publishing.md](docs/publishing.md).
