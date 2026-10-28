# Chat apps and AI assistants

How to add the Orangescrum MCP Server to AI chat apps as a custom connector. Every entry uses the same server:

* **Name:** `Orangescrum`
* **URL:** `https://mcp.orangescrum.com/mcp/partner`
* **Transport:** Streamable HTTP
* **Sign-in:** OAuth 2.1 with PKCE and dynamic client registration. Choose **OAuth** wherever an app asks for the authentication type. You never need a client ID, client secret, or API key.

Menu names change often, and many apps limit custom connectors to paid plans or let only an administrator add them. If a step below does not match what you see, search the app's help for "custom connector" or "MCP".

After connecting, check it works by asking: *"Use Orangescrum to show who I am signed in as."*

## Contents

* [Claude (Claude.ai, Desktop, and Cowork)](#claude-claudeai-desktop-and-cowork)
* [ChatGPT](#chatgpt)
* [Gemini app](#gemini-app)
* [Grok](#grok)
* [Perplexity](#perplexity)
* [Mistral Le Chat](#mistral-le-chat)
* [Microsoft Copilot Studio](#microsoft-copilot-studio)
* [Muse](#muse)
* [Raycast AI](#raycast-ai)
* [Notion AI](#notion-ai)
* [Slack (Slackbot)](#slack-slackbot)
* [LibreChat](#librechat)
* [Open WebUI](#open-webui)
* [Jan](#jan)
* [LM Studio](#lm-studio)
* [Cherry Studio](#cherry-studio)
* [Msty Studio](#msty-studio)
* [Not supported yet](#not-supported-yet)

---

## Claude (Claude.ai, Desktop, and Cowork)

**Individual plans (Free, Pro, Max):**

1. Open **Customize → Connectors → + Add → Add custom connector**.
2. Name it `Orangescrum`, paste the URL, and select **Continue**.
3. If asked which OAuth client to use, choose **Register automatically**.
4. Select **Add**, then **Connect**, and sign in.

**Team and Enterprise:** an owner adds it under **Organization settings → Connectors → Add → Custom → Web** with the same details. Members then select **Connect** under **Customize → Connectors**.

Claude Desktop uses the same connectors as your Claude.ai account. The Free plan allows one custom connector.

## ChatGPT

On the web (custom servers cannot be added from the mobile apps):

1. If your workspace requires it, turn on **Developer mode** under **Settings → Security and login**.
2. Go to **chatgpt.com/plugins**, select **+ → Add custom MCP server**.
3. Name it `Orangescrum`, paste the URL under **Connection**, and set **Authentication** to **OAuth**.
4. Accept the warning, select **Create**, install it from your plugins, and sign in.
5. Use it in a chat by typing `@Orangescrum`.

Availability depends on your plan and your workspace's policies. On Business, Enterprise, and Edu plans, an admin may need to enable developer mode first.

## Gemini app

On gemini.google.com (web only for setup; it then also works in the mobile app):

1. Open **Settings → Connected Apps**.
2. Under **Custom apps**, add an app and paste the URL, then select **Next**.
3. Follow the sign-in prompts.
4. Use it in a chat by typing `@Orangescrum`.

Currently limited by Google to personal Google Accounts (not work or school accounts), users aged 18 or over, and the US, in English.

**Gemini Enterprise** (Google Cloud) is not supported yet: it requires a pre-registered OAuth client ID and secret, which this server does not issue. See [Not supported yet](#not-supported-yet).

## Grok

On grok.com:

1. Go to **grok.com/connectors → New Connector → Custom**.
2. Name it `Orangescrum`, paste the URL, and complete the sign-in.

On Grok Business and Enterprise, an administrator must provision the connector first. To call Orangescrum from the **xAI API**, see [Orchestration tools and SDKs](orchestration.md#xai-api).

## Perplexity

On perplexity.ai:

1. Open **Plugins** in the sidebar (older layout: **Customize → Connectors**), then **Add custom → Add MCP connector → Remote**.
2. Name it `Orangescrum`, paste the URL, set **Authentication** to **OAuth 2.0** and **Transport** to **Streamable HTTP**.
3. Leave **Client ID** and **Client Secret** empty, accept the acknowledgement, and select **Add**.
4. Select the connector card to sign in.

Custom connectors need a paid plan. On **Enterprise**, an admin must turn on **Allow members to add custom connectors**, or add the connector for everyone under **Enterprise settings → Permissions → Connectors permissions → + Custom connector**.

> [!NOTE]
> Some Perplexity users report the error *"Dynamic client registration did not return a client_secret"* with servers that register public clients, as this one does. If you see it, contact [support@orangescrum.com](mailto:support@orangescrum.com).

## Mistral Le Chat

1. Open **Intelligence → Connectors → + Add Connector → Custom MCP Connector**.
2. Name it `Orangescrum` (no spaces), paste the URL, and select **Connect**.
3. Complete the sign-in.

Only an administrator can add connectors. On Free, Pro, and Student plans, the account owner is the administrator.

## Microsoft Copilot Studio

1. Open your agent, then **Tools → Add a tool → New tool → Model Context Protocol**.
2. Enter the server name `Orangescrum`, a description, and the URL.
3. Set **Authentication** to **OAuth 2.0** and **Type** to **Dynamic discovery**, then select **Create**.
4. Select **Next → Create a new connection**, sign in, then **Add to agent**.

Your environment's data loss prevention (DLP) policies apply.

**Microsoft 365 Copilot** declarative agents are not supported yet. See [Not supported yet](#not-supported-yet).

## Muse

Muse has no form for adding an MCP server. Ask it in a chat:

```
Create a custom connector for Orangescrum using the MCP server
https://mcp.orangescrum.com/mcp/partner. It uses OAuth 2.1 sign-in, so
open the sign-in page for me to complete.
```

Muse's custom connectors are designed mainly around API keys, so the OAuth sign-in may need a few attempts. Available in the US only.

## Raycast AI

1. Run the **Install MCP Server** command.
2. Name it `Orangescrum`, set **Transport** to **HTTP**, paste the URL, and set **OAuth Type** to **Dynamic**.
3. Press **⌘ Enter**, then **Sign In**.
4. Use it in AI Chat or Quick AI by typing `@Orangescrum`.

Requires Raycast Pro.

## Notion AI

1. Open **Settings → Connections → Discover → Add Custom MCP**.
2. Enter `Orangescrum` and the URL, then sign in.

Connections are per user, and each Custom Agent connects separately in its own settings. Requires a Business or Enterprise plan, with custom MCP servers allowed by an admin.

## Slack (Slackbot)

Slack users cannot paste a URL. A workspace admin or developer wraps the server in a Slack app:

1. At api.slack.com/apps, create an app and open **Features → MCP Servers**.
2. Add `orangescrum` with the URL and **Dynamic Client Registration** as the auth type. As a manifest:

   ```json
   {
     "oauth_config": { "scopes": { "bot": ["mcp:connect"] } },
     "mcp_servers": {
       "orangescrum": {
         "url": "https://mcp.orangescrum.com/mcp/partner",
         "auth_provider_key": "mcp_dcr_orangescrum",
         "auth_type": "dynamic_client_registration"
       }
     }
   }
   ```

3. Install the app to the workspace. Each user then adds it from **Apps** in a Slackbot direct message and signs in.

## LibreChat

In the right sidebar, open **MCP Settings → +**, enter `Orangescrum`, the URL, transport **Streamable HTTP**, and authentication **OAuth**, then **Create**. Or in `librechat.yaml`, then restart:

```yaml
mcpServers:
  Orangescrum:
    type: streamable-http
    url: https://mcp.orangescrum.com/mcp/partner
```

**Sign in:** in the message box, open **+** and choose **Continue with OAuth**.

## Open WebUI

Version 0.6.31 or later. An administrator opens **Settings → Admin → Integrations → External Tool Servers → + Add Connection**:

1. Set **Type** to **MCP (Streamable HTTP)** and paste the URL.
2. Set **Auth** to **OAuth 2.1**, select **Register Client**, then **Save**.

Each user then turns the tool on in a chat under **+ → Integrations → Tools** and signs in. `WEBUI_SECRET_KEY` must be set on the server.

## Jan

In the Jan Agent console, type `/mcp`, press `a`, and enter the name `orangescrum`, transport **http**, and the URL. Activate it, then choose **Authenticate**. The setting is shared with Jan Desktop.

## LM Studio

Version 0.3.17 or later. Open the **Program** tab, then **Install → Edit mcp.json**:

```json
{
  "mcpServers": {
    "orangescrum": {
      "url": "https://mcp.orangescrum.com/mcp/partner"
    }
  }
}
```

**Sign in:** your browser opens when the server first connects. If it does not, use the [mcp-remote bridge](coding-agents.md#any-other-client-the-mcp-remote-bridge) entry instead.

## Cherry Studio

Open **Settings → MCP → Add → Manual creation**, set **Type** to **Streamable HTTP**, paste the URL, and save. Sign in when your browser opens.

## Msty Studio

Msty does not document OAuth sign-in for remote servers, so add the [mcp-remote bridge](coding-agents.md#any-other-client-the-mcp-remote-bridge) as a local tool: **Toolbox → Add New Tool**, with the command:

```bash
npx -y mcp-remote https://mcp.orangescrum.com/mcp/partner
```

Msty Studio Web needs a connected Desktop or Sidecar to run it.

## Not supported yet

| App | Why |
| --- | --- |
| Microsoft 365 Copilot (declarative agents) | Requires dynamic client registration to issue a client secret. This server registers public clients without one. |
| Gemini Enterprise | Requires a pre-registered OAuth client ID and secret. |
| Meta AI app | Has no custom connector feature. Use [Muse](#muse) instead. |
| Poe | Has no custom MCP server feature. |

To ask for one of these, open an [enhancement request](https://github.com/Orangescrum/orangescrum-mcp-server/issues/new?template=enhancement.yml).
