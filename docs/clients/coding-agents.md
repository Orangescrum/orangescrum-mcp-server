# Coding agents and IDEs

How to add the Orangescrum MCP Server to AI coding agents, terminal agents, and IDEs. Every entry uses the same server:

* **Name:** `orangescrum`
* **URL:** `https://mcp.orangescrum.com/mcp/partner`
* **Transport:** Streamable HTTP
* **Sign-in:** OAuth 2.1 with PKCE. The client registers itself and opens your browser. There is no API key.

After adding the server, confirm it works by asking your agent: *"Use Orangescrum to show who I am signed in as."* It should call `get_current_user`.

AI agents: follow the section for the client you are running in, run the commands yourself where you can, and stop at the sign-in step for the user to finish in the browser. See [INSTALL.md](../../INSTALL.md).

## Contents

* [Claude Code](#claude-code)
* [OpenAI Codex CLI](#openai-codex-cli)
* [OpenCode](#opencode)
* [Cursor (IDE and CLI)](#cursor-ide-and-cli)
* [VS Code with GitHub Copilot](#vs-code-with-github-copilot)
* [GitHub Copilot CLI](#github-copilot-cli)
* [Visual Studio](#visual-studio)
* [Google Antigravity (IDE and CLI)](#google-antigravity-ide-and-cli)
* [Gemini CLI](#gemini-cli)
* [Devin Desktop (formerly Windsurf)](#devin-desktop-formerly-windsurf)
* [Zed](#zed)
* [Cline](#cline)
* [Kilo Code](#kilo-code)
* [Roo Code](#roo-code)
* [Continue](#continue)
* [Goose](#goose)
* [Amp](#amp)
* [Kiro](#kiro)
* [Warp](#warp)
* [JetBrains Junie](#jetbrains-junie)
* [JetBrains AI Assistant](#jetbrains-ai-assistant)
* [Factory Droid](#factory-droid)
* [Augment Code](#augment-code)
* [Crush](#crush)
* [Qwen Code](#qwen-code)
* [Trae](#trae)
* [Hermes Agent](#hermes-agent)
* [OpenClaw](#openclaw)
* [Agent orchestrators: Orca, T3 Code, and similar](#agent-orchestrators-orca-t3-code-and-similar)
* [Any other client: the mcp-remote bridge](#any-other-client-the-mcp-remote-bridge)

---

## Claude Code

```bash
claude mcp add --transport http orangescrum https://mcp.orangescrum.com/mcp/partner
```

Add `--scope user` to use it in every project, or `--scope project` to write it to the project's `.mcp.json`.

**Sign in:** run `/mcp` in a session and pick `orangescrum`, or run `claude mcp login orangescrum` from the shell. Sign in before running `claude -p` or the Agent SDK, which cannot open a browser.

**Plugin with skills:** `/plugin marketplace add Orangescrum/orangescrum-mcp-server`, then `/plugin install orangescrum@orangescrum`.

## OpenAI Codex CLI

```bash
codex mcp add orangescrum --url https://mcp.orangescrum.com/mcp/partner
codex mcp login orangescrum
```

Or in `~/.codex/config.toml`:

```toml
[mcp_servers.orangescrum]
url = "https://mcp.orangescrum.com/mcp/partner"
```

**Sign in:** `codex mcp login orangescrum` opens your browser.

## OpenCode

In `opencode.json` (project) or `~/.config/opencode/opencode.json` (global):

```json
{
  "mcp": {
    "orangescrum": {
      "type": "remote",
      "url": "https://mcp.orangescrum.com/mcp/partner",
      "enabled": true
    }
  }
}
```

**Sign in:** `opencode mcp auth orangescrum`. Check with `opencode mcp list`; sign out with `opencode mcp logout orangescrum`.

## Cursor (IDE and CLI)

In `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project). The CLI shares the editor's config.

```json
{
  "mcpServers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** in the IDE, open **Settings → MCP** and connect `orangescrum` when prompted. In the CLI, run `agent mcp login orangescrum`.

**One click:** use the **Add to Cursor** button in the [README](../../README.md#one-click-setup).

## VS Code with GitHub Copilot

In `.vscode/mcp.json` (workspace), or run **MCP: Add Server → HTTP** from the Command Palette:

```json
{
  "servers": {
    "orangescrum": {
      "type": "http",
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** start the server from the `mcp.json` CodeLens or the MCP view; your browser opens on first connection. Use Copilot Chat in **Agent** mode. In an organization, the **MCP servers in Copilot** policy must be on.

**One click:** use the **Add to VS Code** button in the [README](../../README.md#one-click-setup).

## GitHub Copilot CLI

```bash
copilot mcp add --transport http orangescrum https://mcp.orangescrum.com/mcp/partner
```

Or add it inside a session with `/mcp add`. The config lives in `~/.copilot/mcp-config.json`:

```json
{
  "mcpServers": {
    "orangescrum": {
      "type": "http",
      "url": "https://mcp.orangescrum.com/mcp/partner",
      "tools": ["*"]
    }
  }
}
```

**Sign in:** run `/mcp auth` in a session. On a machine with no browser, it falls back to a device code.

## Visual Studio

Visual Studio 2022 (17.14 or later) and 2026. In `%USERPROFILE%\.mcp.json` (global) or `<solution folder>\.mcp.json`:

```json
{
  "servers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

Or in Copilot Chat: **Agent mode → Tools → + → Add custom MCP server**.

**Sign in:** select the **Authentication Required** CodeLens above the server in `.mcp.json`, then sign in in the browser window.

## Google Antigravity (IDE and CLI)

In `~/.gemini/config/mcp_config.json` (global) or `<workspace>/.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "orangescrum": {
      "serverUrl": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** in the IDE, open **Agent settings → Customizations** and select **Authenticate** next to `orangescrum`, finish in the browser, and paste the code back if asked. In the CLI, run `/mcp`, pick the server, and choose **Authenticate**. The IDE and CLI each sign in separately.

## Gemini CLI

Gemini CLI is being replaced by the Antigravity CLI (see above), but still works.

```bash
gemini mcp add --transport http orangescrum https://mcp.orangescrum.com/mcp/partner
```

Or install this repository as an extension, which also adds the server: `gemini extensions install https://github.com/Orangescrum/orangescrum-mcp-server`.

**Sign in:** `/mcp auth orangescrum` in a session.

## Devin Desktop (formerly Windsurf)

In `~/.config/devin/mcp_config.json` (Windows: `%APPDATA%\devin\mcp_config.json`). Installs from before the rename use `~/.codeium/windsurf/mcp_config.json`.

```json
{
  "mcpServers": {
    "orangescrum": {
      "serverUrl": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** refresh the server in the Cascade MCP panel; your browser opens to sign in.

## Zed

In Zed's `settings.json`:

```json
{
  "context_servers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** Zed prompts for sign-in when the server first connects.

## Cline

In the Cline panel: **MCP Servers → Remote Servers**, enter the name `orangescrum`, the URL, and the **Streamable HTTP** transport, then **Add Server**. Or edit `cline_mcp_settings.json` (Cline CLI: `~/.cline/data/settings/cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "orangescrum": {
      "type": "streamableHttp",
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

Keep `type`: without it, Cline assumes the older SSE transport.

**Sign in:** authenticate from the server's entry in the panel, or choose **Authorize OAuth** in the CLI's MCP wizard.

## Kilo Code

In `~/.config/kilo/kilo.jsonc` (global) or `kilo.jsonc` in the project:

```json
{
  "mcp": {
    "orangescrum": {
      "type": "remote",
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** Kilo Code starts the sign-in automatically when it connects.

## Roo Code

Roo Code does not sign in to remote servers itself, so use the [mcp-remote bridge](#any-other-client-the-mcp-remote-bridge). In `.roo/mcp.json` (project) or the global `mcp_settings.json`:

```json
{
  "mcpServers": {
    "orangescrum": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.orangescrum.com/mcp/partner"]
    }
  }
}
```

**Sign in:** your browser opens the first time the bridge starts.

## Continue

Continue does not sign in to remote servers itself, so use the [mcp-remote bridge](#any-other-client-the-mcp-remote-bridge). Create `.continue/mcpServers/orangescrum.yaml`:

```yaml
name: Orangescrum
version: 1.0.0
schema: v1
mcpServers:
  - name: orangescrum
    command: npx
    args: ["-y", "mcp-remote", "https://mcp.orangescrum.com/mcp/partner"]
```

**Sign in:** your browser opens the first time the bridge starts. Use the tools in **Agent** mode.

## Goose

Run `goose configure`, choose **Add Extension → Remote Extension (Streamable HTTP)**, name it `orangescrum`, and enter the URL. Or in `~/.config/goose/config.yaml`:

```yaml
extensions:
  orangescrum:
    name: orangescrum
    type: streamable_http
    uri: https://mcp.orangescrum.com/mcp/partner
    enabled: true
    timeout: 300
```

**Sign in:** your browser opens when the extension first connects. If you need a fixed callback port, set `GOOSE_OAUTH_CALLBACK_PORT`.

## Amp

```bash
amp mcp add orangescrum https://mcp.orangescrum.com/mcp/partner
```

Or in Amp's `settings.json`:

```json
{
  "amp.mcpServers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** your browser opens when you next start Amp.

## Kiro

In `.kiro/settings/mcp.json` (workspace) or `~/.kiro/settings/mcp.json` (global):

```json
{
  "mcpServers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** Kiro opens your browser when the server first connects.

## Warp

Open **Settings → Agents → MCP servers → + Add** and paste:

```json
{
  "orangescrum": {
    "url": "https://mcp.orangescrum.com/mcp/partner"
  }
}
```

The file form is `~/.warp/.mcp.json`, or `.warp/.mcp.json` in a repository.

**Sign in:** your browser opens when the server starts. Revoke access from the MCP pane.

## JetBrains Junie

Junie plugin and Junie CLI. In `~/.junie/mcp/mcp.json` (global) or `.junie/mcp/mcp.json` (project):

```json
{
  "mcpServers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** when the server shows **Authorization required**, open its menu in the MCP Installation Assistant, choose **Authorize**, and sign in in the browser.

## JetBrains AI Assistant

Open **Settings → Tools → AI Assistant → Model Context Protocol (MCP) → Add**, then **OK** and **Apply**. Remote sign-in is not documented for AI Assistant, so use the [mcp-remote bridge](#any-other-client-the-mcp-remote-bridge):

```json
{
  "mcpServers": {
    "orangescrum": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.orangescrum.com/mcp/partner"]
    }
  }
}
```

**Sign in:** your browser opens the first time the bridge starts.

## Factory Droid

```bash
droid mcp add orangescrum https://mcp.orangescrum.com/mcp/partner --type http
```

Or in `~/.factory/mcp.json` (global) or `.factory/mcp.json` (project):

```json
{
  "mcpServers": {
    "orangescrum": {
      "type": "http",
      "url": "https://mcp.orangescrum.com/mcp/partner",
      "disabled": false
    }
  }
}
```

**Sign in:** run `/mcp` in a session; the server shows **needs authentication** until you sign in in the browser.

## Augment Code

Augment does not reliably sign in to remote servers itself, so use the [mcp-remote bridge](#any-other-client-the-mcp-remote-bridge). In the IDE, open the MCP settings and **Import from JSON**:

```json
{
  "mcpServers": {
    "orangescrum": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.orangescrum.com/mcp/partner"]
    }
  }
}
```

For the Auggie CLI, add the same `command` and `args` entry to `~/.augment/settings.json`.

**Sign in:** your browser opens the first time the bridge starts.

## Crush

In `crush.json` (project) or `~/.config/crush/crush.json` (global):

```json
{
  "mcp": {
    "orangescrum": {
      "type": "http",
      "url": "https://mcp.orangescrum.com/mcp/partner",
      "oauth": true
    }
  }
}
```

**Sign in:** with `"oauth": true`, Crush registers itself and opens your browser.

## Qwen Code

```bash
qwen mcp add --transport http orangescrum https://mcp.orangescrum.com/mcp/partner
```

Or in Qwen Code's `settings.json`. Use `httpUrl`, because `url` means the older SSE transport:

```json
{
  "mcpServers": {
    "orangescrum": {
      "httpUrl": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** open `/mcp` in a session and authenticate `orangescrum`.

## Trae

Remote sign-in is not confirmed for Trae, so use the [mcp-remote bridge](#any-other-client-the-mcp-remote-bridge). Open **AI Management (gear) → MCP → Add → Configure Manually** and paste:

```json
{
  "mcpServers": {
    "orangescrum": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.orangescrum.com/mcp/partner"]
    }
  }
}
```

## Hermes Agent

In `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  orangescrum:
    url: "https://mcp.orangescrum.com/mcp/partner"
    auth: oauth
```

Then run `/reload-mcp` in a running session, or start Hermes again.

**Sign in:** from a separate terminal, run `hermes mcp login orangescrum` and complete the sign-in in your browser. On a machine without a browser, use `hermes mcp login orangescrum --flow device`, or forward the sign-in callback port over SSH. Tokens are stored in `~/.hermes/mcp-tokens/`, not in the config file.

## OpenClaw

```bash
openclaw mcp add orangescrum --url https://mcp.orangescrum.com/mcp/partner --transport streamable-http
```

Then set `auth` to `"oauth"` on the new entry in your OpenClaw config:

```json5
{
  mcp: {
    servers: {
      orangescrum: {
        url: "https://mcp.orangescrum.com/mcp/partner",
        transport: "streamable-http",
        auth: "oauth",
        enabled: true,
      },
    },
  },
}
```

**Sign in:** open **Settings → MCP** and sign in to `orangescrum`. From the terminal instead, stop the Gateway first, because the login command runs offline:

```bash
openclaw gateway stop
openclaw mcp login orangescrum
```

Follow the printed link, then start the Gateway again. Check the connection with `openclaw mcp doctor orangescrum --probe`.

## Agent orchestrators: Orca, T3 Code, and similar

Orchestrators such as **Orca** and **T3 Code** run other coding agents (Claude Code, Codex, OpenCode, Cursor, Copilot, Antigravity, and others) side by side. They have no MCP settings of their own: each agent they launch reads its own MCP config.

1. Add Orangescrum to every agent you run through the orchestrator, using that agent's section above. Prefer the global (user) scope, because orchestrators often run each agent in its own git worktree, where a project-level file may be missing.
2. Sign in once per agent, in a normal terminal, before launching it from the orchestrator. Agents started in the background cannot open a browser.
3. Check each agent with *"Use Orangescrum to show who I am signed in as."*

Each agent gets its own sign-in and its own token, so you can revoke them one at a time.

## Any other client: the mcp-remote bridge

For a client that only supports local (STDIO) MCP servers, or cannot sign in to remote ones, run the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge. It runs on your machine, completes the sign-in in your browser, and forwards requests to the hosted server. It needs Node.js 18 or later.

```json
{
  "mcpServers": {
    "orangescrum": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.orangescrum.com/mcp/partner"]
    }
  }
}
```

If the sign-in gets stuck, delete the bridge's saved state in `~/.mcp-auth` and start again.
