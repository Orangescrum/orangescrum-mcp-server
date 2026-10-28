# Security policy

Thanks for helping keep the Orangescrum MCP Server and the people who use it safe.

## Reporting a vulnerability

**Please don't open a public GitHub issue for a security problem.** Public issues are visible to everyone and can put users at risk before a fix is ready.

Report it privately instead, by either:

- Using GitHub's **Report a vulnerability** button on the [Security tab](https://github.com/Orangescrum/orangescrum-mcp-server/security) of this repository, or
- Emailing [support@orangescrum.com](mailto:support@orangescrum.com) with "Security" in the subject line.

That gets it to the people who can triage and fix it.

A good report usually includes:

- What you found, and why you think it's a security issue
- Steps to reproduce, or a proof of concept
- The affected component (a file in this repo, a client manifest, or the hosted endpoint)
- The impact you think it could have

## What this repository covers

This repo holds the public pieces of the Orangescrum MCP Server: the documentation, the client manifests (`.mcp.json` and the Claude, Cursor, and Gemini plugin manifests), the MCP registry entry (`server.json`), and the [skills](skills/).

The server itself is a hosted service at `mcp.orangescrum.com`. Issues in the hosted service, in authentication, or in Orangescrum itself go through the same private reporting process above. Orangescrum maintains and updates the hosted server, so there's nothing for you to patch on your end. Just connect to the current endpoint documented in the [README](README.md).

## Using the MCP server safely

MCP lets an AI agent act in Orangescrum with your permissions. That's useful, and it carries real risk. Language models can be tricked by [prompt injection](https://owasp.org/www-community/attacks/PromptInjection) and [tool poisoning](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks), where hidden instructions push an agent to leak data or make changes you never asked for.

A few habits that lower the risk:

- Connect only to MCP clients and servers you trust.
- Use least privilege: approve read-only scopes first, and only the modules you need.
- Ask for human confirmation before any high-impact or destructive action, such as a `delete_*` tool.
- Watch the audit trail for anything that looks off.

## Coordinated disclosure

Please give us a fair chance to investigate and ship a fix before you share details publicly. We're grateful to the researchers who report responsibly and work with us on timing.
