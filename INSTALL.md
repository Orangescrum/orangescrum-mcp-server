# Install the Orangescrum MCP Server

**This file is written for AI agents.** If a user asked you to set up Orangescrum, follow the steps below in order. People can follow it too.

## Server facts

| Setting | Value |
| --- | --- |
| Server name | `orangescrum` (use `Orangescrum` where the client shows a display name) |
| URL | `https://mcp.orangescrum.com/mcp/partner` |
| Transport | Streamable HTTP (called `http`, `streamable-http`, `streamableHttp`, or `remote` depending on the client) |
| Authentication | OAuth 2.1 with PKCE and dynamic client registration |
| Credentials to configure | **None.** No API key, client ID, client secret, or token goes in any config file. |
| Registry name | `com.orangescrum/orangescrum-mcp-server` |

## Steps

### 1. Identify the client you are running in

Use what you know about yourself first (your product name and how you were started). If that is not enough, look for the client's config files in the project or home directory, for example `.mcp.json`, `.cursor/`, `.vscode/mcp.json`, `opencode.json`, `~/.codex/config.toml`, or `.kiro/`. If you still cannot tell, ask the user which app they are using.

If you were launched by an orchestrator that runs several agents (for example Orca or T3 Code), configure the agent you are, not the orchestrator. See [Agent orchestrators](docs/clients/coding-agents.md#agent-orchestrators-orca-t3-code-and-similar).

### 2. Open your client's instructions

| Kind of client | Guide |
| --- | --- |
| Coding agents, terminal agents, and IDEs (Claude Code, Codex, OpenCode, Cursor, VS Code, Copilot CLI, Antigravity, Gemini CLI, Devin Desktop, Zed, Cline, Kilo Code, Roo Code, Continue, Goose, Amp, Kiro, Warp, JetBrains, Factory Droid, Augment, Crush, Qwen Code, Trae, Visual Studio, Hermes Agent, OpenClaw) | [docs/clients/coding-agents.md](docs/clients/coding-agents.md) |
| Chat apps and assistants (Claude, ChatGPT, Gemini, Grok, Perplexity, Le Chat, Copilot Studio, Muse, Raycast, Notion, Slack, LibreChat, Open WebUI, Jan, LM Studio, Cherry Studio, Msty) | [docs/clients/chat-apps.md](docs/clients/chat-apps.md) |
| Workflow platforms, model APIs, and agent SDKs (n8n, Zapier, Make, Dify, Flowise, Langflow, OpenAI, Anthropic, xAI and Gemini APIs, LangChain, CrewAI, ADK, and more) | [docs/clients/orchestration.md](docs/clients/orchestration.md) |
| Anything not listed | Use the URL above with your client's remote MCP setting. If it supports only local (STDIO) servers or cannot sign in, use the [mcp-remote bridge](docs/clients/coding-agents.md#any-other-client-the-mcp-remote-bridge). |

### 3. Add the server

* **Prefer the client's own command** (for example `claude mcp add`, `codex mcp add`, `copilot mcp add`) over editing files.
* **When you edit a config file, merge.** Add the `orangescrum` entry next to any existing servers. Never remove or rewrite other entries. If the file does not exist, create it with only this entry.
* **Use the user (global) scope** unless the user asks for one project only.
* **Match the client's field names exactly** (`url`, `serverUrl`, `httpUrl`, or `uri`). A wrong field name usually makes the client fall back to an older transport and fail.
* **If an `orangescrum` entry already exists,** check that its URL is the one above. The older URL `https://v4-api.orangescrum.com/mcp/partner` still works; update it only if the user agrees.

### 4. Hand the sign-in to the user

Sign-in happens in the user's browser. You cannot and must not do it for them.

1. Start the sign-in with the client's command or tell the user which button to select (each guide says which).
2. Tell the user what to expect: an Orangescrum sign-in page (email and password, or Google), then a consent screen where they **pick one workspace** and approve the requested access.
3. Wait for the user to confirm they finished. Never ask the user to paste a password, code, or token into the chat.

Some clients only load new servers after a restart or reload. If the Orangescrum tools do not appear, tell the user to restart the client, then continue.

### 5. Verify

Call the `get_current_user` tool and report the user's name and workspace back to the user. If that works, setup is complete. Suggest a first prompt, such as *"List my open tasks in Orangescrum."*

## If something fails

| Symptom | Cause and fix |
| --- | --- |
| `401` or "needs authentication" | Not signed in yet, or the token expired and could not refresh. Run the client's sign-in step again. |
| Sign-in page says MCP is not enabled | A workspace administrator must enable MCP for the workspace. |
| `permission_denied` on some tools | That module's scope was not approved, or the workspace administrator does not allow it. Reconnect and approve the scope, or ask the administrator. |
| Tools from the wrong workspace | Each connection uses the one workspace chosen at sign-in. Disconnect and sign in again to choose another. |
| `429 Too Many Requests` | Rate limit reached (120 requests per minute and 5,000 per day). Wait and retry. |
| Client says transport not supported, or falls back to SSE | Wrong `type` or URL field for that client. Check its guide, or use the mcp-remote bridge. |
| Sign-in loops or the browser never opens | Clear the client's saved MCP sign-in (each guide names the logout command), then try again. For the bridge, delete `~/.mcp-auth`. |

More help: [Troubleshooting](https://helpdesk.orangescrum.com/guide/mcp/troubleshooting) or [support@orangescrum.com](mailto:support@orangescrum.com).
