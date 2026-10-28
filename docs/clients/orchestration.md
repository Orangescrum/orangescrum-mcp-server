# Orchestration tools, workflow platforms, and agent SDKs

How to connect the Orangescrum MCP Server from automation platforms, model APIs, and agent frameworks. Every entry uses the same server:

* **URL:** `https://mcp.orangescrum.com/mcp/partner`
* **Transport:** Streamable HTTP
* **Sign-in:** OAuth 2.1 authorization code with PKCE and dynamic client registration. There is no API key.

## Contents

* [How sign-in works without a person at the keyboard](#how-sign-in-works-without-a-person-at-the-keyboard)
* Workflow platforms: [n8n](#n8n), [Zapier](#zapier), [Make](#make), [Dify](#dify), [Flowise](#flowise), [Langflow](#langflow), [Microsoft Copilot Studio](chat-apps.md#microsoft-copilot-studio)
* Model APIs: [OpenAI Responses API](#openai-responses-api), [Anthropic Messages API](#anthropic-messages-api), [xAI API](#xai-api), [Gemini API](#gemini-api)
* Official SDKs: [MCP Python SDK](#mcp-python-sdk), [MCP TypeScript SDK](#mcp-typescript-sdk)
* Agent frameworks: [OpenAI Agents SDK](#openai-agents-sdk), [Claude Agent SDK](#claude-agent-sdk), [Vercel AI SDK](#vercel-ai-sdk), [LangChain and LangGraph](#langchain-and-langgraph), [Pydantic AI](#pydantic-ai), [LlamaIndex](#llamaindex), [Mastra](#mastra), [CrewAI](#crewai), [Google ADK](#google-adk), [Microsoft Agent Framework](#microsoft-agent-framework), [Semantic Kernel and AutoGen](#semantic-kernel-and-autogen), [Agno](#agno), [Strands Agents](#strands-agents), [Cloudflare Agents](#cloudflare-agents), [Hugging Face smolagents](#hugging-face-smolagents), [Haystack](#haystack)
* Gateways: [AWS Bedrock AgentCore Gateway](#aws-bedrock-agentcore-gateway)

---

## How sign-in works without a person at the keyboard

Every call runs as a real Orangescrum user, so someone must sign in at least once. Tools fall into two groups:

**1. The tool runs the sign-in itself.** It discovers the server's OAuth settings, registers itself, sends you to a browser once, and then refreshes the token on its own. n8n, Zapier, Make, Dify, Copilot Studio, Cloudflare Agents, the official MCP SDKs, and frameworks built on them work this way. Prefer these.

**2. The tool only accepts a token.** You pass `Authorization: Bearer <access token>`, and your code keeps the token fresh. Access tokens last **1 hour**; refresh tokens last **30 days** and rotate on each use.

To get a token for testing:

```bash
npx @modelcontextprotocol/inspector
```

Connect it to the URL above with **Streamable HTTP**, complete the sign-in, and copy the access token from the authentication panel. For production, run the sign-in in your own code with the [MCP Python SDK](#mcp-python-sdk) or [MCP TypeScript SDK](#mcp-typescript-sdk), store the refresh token securely, and hand the current access token to the framework.

**Scopes.** Clients that read the server's metadata request the right scopes on their own. If you run the sign-in yourself, request `mcp:use` plus the read or write scope of each module the workflow uses, for example `mcp:projects.read mcp:tasks.read mcp:tasks.write` (see [Supported modules and tools](../../README.md#supported-modules-and-tools)). A tool outside the granted scopes answers `permission_denied`.

**Registering a client ahead of time.** A few tools (Mastra, AWS AgentCore) need a client ID before they start. Register one with the server's registration endpoint and keep the returned `client_id`:

```bash
curl -X POST https://mcp.orangescrum.com/oauth/register \
  -H 'Content-Type: application/json' \
  -d '{"client_name": "My Orangescrum automation", "redirect_uris": ["https://example.com/oauth/callback"]}'
```

Clients are public: there is no client secret, so the tool must use PKCE.

> [!IMPORTANT]
> A token carries the signing-in user's permissions in one workspace. Use a dedicated Orangescrum user for automations, request only the scopes the workflow needs, and keep tokens in your platform's secret store, never in prompts or source code. Revoke a token by disconnecting the client (see [Admin notes](../../README.md#admin-notes-managing-access)).

---

## n8n

1. Add an **MCP Client Tool** to an **AI Agent** node and set the endpoint to the URL.
2. Set **Authentication** to **MCP OAuth2**, keep **Use Dynamic Client Registration** on, and leave **Resource URL** empty.
3. Select **Connect** and sign in.
4. Under **Tools to Include**, choose **Selected** and pick only what the workflow needs.

## Zapier

Use **MCP Client by Zapier** (beta): **Apps → Add connection → MCP Client**. Set **Server URL** to the URL, **Transport** to **Streamable HTTP**, and **OAuth** to **Yes**, then sign in. Use the **Run Tool** or **Run Read-Only Tool** actions.

## Make

Add the **MCP Client** module (open beta), then **Create a connection → MCP Server → + New MCP Server**. Paste the URL, save, and sign in. Use **Call a tool** or **Execute an action with AI**.

## Dify

Open **Tools → MCP → Add MCP Server (HTTP)**. Enter the URL, the name `Orangescrum`, and a server ID such as `orangescrum`. Keep dynamic client registration on, then sign in.

## Flowise

Token only. In an **Agent** node, add a **Custom MCP** tool with:

```json
{
  "url": "https://mcp.orangescrum.com/mcp/partner",
  "headers": { "Authorization": "Bearer {{$vars.orangescrumToken}}" }
}
```

Keep `orangescrumToken` in Flowise variables and refresh it hourly.

## Langflow

Token only. Open **Settings → MCP Servers → HTTP/SSE**, enter `orangescrum` and the URL, and add the header `Authorization` with a global variable holding `Bearer <token>`. Then add an **MCP Tools** component in tool mode and connect it to your agent's **Tools** input.

---

## OpenAI Responses API

Token only. OpenAI does not store it, so send it with every request.

```json
{
  "tools": [{
    "type": "mcp",
    "server_label": "orangescrum",
    "server_url": "https://mcp.orangescrum.com/mcp/partner",
    "authorization": "<access token>",
    "require_approval": "always",
    "allowed_tools": ["list_projects", "list_tasks_v2", "get_task"]
  }]
}
```

## Anthropic Messages API

Token only. Use the MCP connector with the `anthropic-beta: mcp-client-2025-11-20` header:

```json
{
  "mcp_servers": [{
    "type": "url",
    "url": "https://mcp.orangescrum.com/mcp/partner",
    "name": "orangescrum",
    "authorization_token": "<access token>"
  }],
  "tools": [{ "type": "mcp_toolset", "mcp_server_name": "orangescrum" }]
}
```

## xAI API

Token only. Through the Responses API at `https://api.x.ai/v1`:

```json
{
  "tools": [{
    "type": "mcp",
    "server_label": "orangescrum",
    "server_url": "https://mcp.orangescrum.com/mcp/partner",
    "authorization": "<access token>"
  }]
}
```

## Gemini API

The Gemini SDKs take an MCP client session as a tool, so connect with the [MCP Python SDK](#mcp-python-sdk) or [MCP TypeScript SDK](#mcp-typescript-sdk) (which handle the sign-in) and pass the session to Gemini.

---

## MCP Python SDK

Runs discovery, registration, PKCE, and refresh. Shown for SDK 1.x; see the [official OAuth example](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/snippets/clients/oauth_client.py) for 2.x.

```python
from mcp import ClientSession
from mcp.client.auth import OAuthClientProvider
from mcp.client.streamable_http import streamablehttp_client
from mcp.shared.auth import OAuthClientMetadata

URL = "https://mcp.orangescrum.com/mcp/partner"

auth = OAuthClientProvider(
    server_url=URL,
    client_metadata=OAuthClientMetadata(
        client_name="My Orangescrum automation",
        redirect_uris=["http://localhost:3000/callback"],
        grant_types=["authorization_code", "refresh_token"],
        response_types=["code"],
    ),
    storage=my_token_storage,        # persist tokens so the browser step happens once
    redirect_handler=open_browser,   # open the sign-in URL
    callback_handler=wait_for_code,  # return the code and state from the callback
)

async with streamablehttp_client(URL, auth=auth) as (read, write, _):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()
```

## MCP TypeScript SDK

Pass an `OAuthClientProvider` as `authProvider`. The first `connect` throws `UnauthorizedError` and calls your `redirectToAuthorization`; after the callback, call `finishAuth` and connect again.

```ts
const url = new URL("https://mcp.orangescrum.com/mcp/partner");
const transport = new StreamableHTTPClientTransport(url, { authProvider: provider });
try {
  await client.connect(transport);
} catch (e) {
  if (!(e instanceof UnauthorizedError)) throw e;
}
// After the browser redirects back with ?code=...
await transport.finishAuth(code);
await client.connect(new StreamableHTTPClientTransport(url, { authProvider: provider }));
```

See the SDK's [OAuth client guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/clients/oauth.md) for a full `provider`.

---

## OpenAI Agents SDK

**Python** (token):

```python
from agents import Agent
from agents.mcp import MCPServerStreamableHttp

async with MCPServerStreamableHttp(
    name="orangescrum",
    params={
        "url": "https://mcp.orangescrum.com/mcp/partner",
        "headers": {"Authorization": f"Bearer {token}"},
    },
    cache_tools_list=True,
) as orangescrum:
    agent = Agent(name="PM assistant", mcp_servers=[orangescrum])
```

**JavaScript** (sign-in through the MCP SDK's `OAuthClientProvider`, or a token):

```ts
const orangescrum = new MCPServerStreamableHttp({
  name: "orangescrum",
  url: "https://mcp.orangescrum.com/mcp/partner",
  authProvider, // or: requestInit: { headers: { Authorization: `Bearer ${token}` } }
});
```

## Claude Agent SDK

Token only. Or sign in once with Claude Code on the same machine (`claude mcp login orangescrum`).

```python
options = ClaudeAgentOptions(
    mcp_servers={
        "orangescrum": {
            "type": "http",
            "url": "https://mcp.orangescrum.com/mcp/partner",
            "headers": {"Authorization": f"Bearer {token}"},
        }
    },
    allowed_tools=["mcp__orangescrum__*"],
)
```

## Vercel AI SDK

Signs in through `authProvider`, or takes a token.

```ts
import { createMCPClient } from "@ai-sdk/mcp";

const orangescrum = await createMCPClient({
  transport: {
    type: "http",
    url: "https://mcp.orangescrum.com/mcp/partner",
    authProvider, // or: headers: { Authorization: `Bearer ${token}` }
  },
});
const tools = await orangescrum.tools();
```

## LangChain and LangGraph

`langchain[mcp]` 1.4 or later signs in with `auth="oauth"`, or takes a token:

```python
from fastmcp import Client
from langchain.agents import create_agent
from langchain.mcp import MCPAdapter

async with MCPAdapter(Client("https://mcp.orangescrum.com/mcp/partner", auth="oauth")) as adapter:
    tools = await adapter.list_tools()
agent = create_agent(model, tools)
```

With the older `langchain-mcp-adapters` package, pass a token:

```python
MultiServerMCPClient({
    "orangescrum": {
        "transport": "http",
        "url": "https://mcp.orangescrum.com/mcp/partner",
        "headers": {"Authorization": f"Bearer {token}"},
    }
})
```

## Pydantic AI

Signs in with `auth="oauth"`, or takes a token:

```python
from pydantic_ai.mcp import MCPToolset

orangescrum = MCPToolset("https://mcp.orangescrum.com/mcp/partner", auth="oauth")
```

## LlamaIndex

Signs in through `BasicMCPClient.with_oauth`, or takes a token:

```python
from llama_index.tools.mcp import BasicMCPClient, aget_tools_from_mcp_url

URL = "https://mcp.orangescrum.com/mcp/partner"
client = BasicMCPClient(URL, headers={"Authorization": f"Bearer {token}"})
tools = await aget_tools_from_mcp_url(URL, client=client)
```

## Mastra

Token, or `authProvider` with client details registered ahead of time (Mastra's own provider does not register clients at runtime):

```ts
const mcp = new MCPClient({
  id: "orangescrum",
  servers: {
    orangescrum: {
      url: new URL("https://mcp.orangescrum.com/mcp/partner"),
      requestInit: { headers: { Authorization: `Bearer ${token}` } },
    },
  },
});
```

## CrewAI

Token only.

```python
from crewai import Agent
from crewai.mcp import MCPServerHTTP

agent = Agent(
    role="Delivery lead",
    goal="Keep the sprint on track",
    backstory="Works from Orangescrum data.",
    mcps=[MCPServerHTTP(
        url="https://mcp.orangescrum.com/mcp/partner",
        headers={"Authorization": f"Bearer {token}"},
        streamable=True,
    )],
)
```

## Google ADK

Token only. Use `header_provider` for a per-user token.

```python
from google.adk.tools.mcp_tool import McpToolset, StreamableHTTPConnectionParams

orangescrum = McpToolset(connection_params=StreamableHTTPConnectionParams(
    url="https://mcp.orangescrum.com/mcp/partner",
    headers={"Authorization": f"Bearer {token}"},
))
```

## Microsoft Agent Framework

Token only (Python shown):

```python
from agent_framework import MCPStreamableHTTPTool

orangescrum = MCPStreamableHTTPTool(
    name="orangescrum",
    url="https://mcp.orangescrum.com/mcp/partner",
    header_provider=lambda _: {"Authorization": f"Bearer {token}"},
)
```

## Semantic Kernel and AutoGen

Token only. Microsoft Agent Framework (above) is their successor.

```python
URL = "https://mcp.orangescrum.com/mcp/partner"

# Semantic Kernel
from semantic_kernel.connectors.mcp import MCPStreamableHttpPlugin
plugin = MCPStreamableHttpPlugin(name="orangescrum", url=URL, headers={"Authorization": f"Bearer {token}"})

# AutoGen
from autogen_ext.tools.mcp import StreamableHttpServerParams, mcp_server_tools
tools = await mcp_server_tools(StreamableHttpServerParams(url=URL, headers={"Authorization": f"Bearer {token}"}))
```

## Agno

Token only.

```python
from agno.tools.mcp import MCPTools, StreamableHTTPClientParams

orangescrum = MCPTools(
    transport="streamable-http",
    server_params=StreamableHTTPClientParams(
        url="https://mcp.orangescrum.com/mcp/partner",
        headers={"Authorization": f"Bearer {token}"},
    ),
)
```

## Strands Agents

Signs in through the MCP SDK's `OAuthClientProvider` passed as `auth_provider`, or takes a token. Its built-in `auth` option uses client credentials, which this server does not support.

```python
from strands.tools.mcp import MCPClient

orangescrum = MCPClient(
    url="https://mcp.orangescrum.com/mcp/partner",
    auth_provider=oauth_provider,  # or: headers={"Authorization": f"Bearer {token}"}
)
```

## Cloudflare Agents

Signs in and stores tokens for you:

```ts
const result = await this.addMcpServer("orangescrum", "https://mcp.orangescrum.com/mcp/partner", {
  transport: { type: "streamable-http" },
});
if (result.state === "authenticating") return Response.redirect(result.authUrl);
```

## Hugging Face smolagents

Token only.

```python
from smolagents import MCPClient

with MCPClient({
    "url": "https://mcp.orangescrum.com/mcp/partner",
    "transport": "streamable-http",
    "headers": {"Authorization": f"Bearer {token}"},
}) as tools:
    ...
```

## Haystack

Token only.

```python
from haystack.utils import Secret
from haystack_integrations.tools.mcp import MCPToolset, StreamableHttpServerInfo

orangescrum = MCPToolset(server_info=StreamableHttpServerInfo(
    url="https://mcp.orangescrum.com/mcp/partner",
    token=Secret.from_env_var("ORANGESCRUM_TOKEN"),
))
```

---

## AWS Bedrock AgentCore Gateway

Create a gateway target of type MCP server with the URL. For outbound auth, create an OAuth credential provider in AgentCore Identity with the **authorization code** grant, using a [client registered ahead of time](#how-sign-in-works-without-a-person-at-the-keyboard). Complete the consent from the returned authorization URL. This mode does not work with dynamic tool listing.
