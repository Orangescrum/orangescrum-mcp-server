# Publishing to the MCP Registry

This runbook is for maintainers. It covers the one-time namespace setup and every later release of `server.json` to the official [MCP Registry](https://registry.modelcontextprotocol.io).

The registry stores metadata only. It never hosts or proxies the server; clients read `server.json` from the registry and connect straight to `https://mcp.orangescrum.com/mcp/partner`.

## How the namespace is proven

The server is named `com.orangescrum/orangescrum-mcp-server`. A `com.orangescrum/*` name is granted to whoever proves control of the `orangescrum.com` domain, through either:

| Method | Proof | Notes |
| --- | --- | --- |
| **DNS** (recommended) | A TXT record on the `orangescrum.com` apex | Works from CI; no web server change |
| HTTP | A file at `https://orangescrum.com/.well-known/mcp-registry-auth` | Needs a deploy on the main website |

The TXT record must sit on the apex (`orangescrum.com`), not on a subdomain such as `_mcp.orangescrum.com`. It can live alongside the existing SPF record; a domain can have several TXT records.

## One-time setup

1. **Generate a key pair** (OpenSSL 3 or later):

   ```bash
   openssl genpkey -algorithm Ed25519 -out key.pem
   PUBLIC_KEY="$(openssl pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"
   echo "orangescrum.com. IN TXT \"v=MCPv1; k=ed25519; p=${PUBLIC_KEY}\""
   ```

2. **Add the TXT record** printed above to the `orangescrum.com` apex in DNS. Check it with:

   ```bash
   dig +short TXT orangescrum.com
   ```

3. **Store the private key** in the team password manager, in hex form (the form `mcp-publisher login` takes):

   ```bash
   openssl pkey -in key.pem -noout -text | grep -A3 "priv:" | tail -n +2 | tr -d ' :\n'
   ```

   Then delete `key.pem` from your machine. `.gitignore` blocks it from being committed.

## Before every release

1. The endpoint in `server.json` must be **publicly reachable**. Without a token it should answer `401` with a `WWW-Authenticate: Bearer` header:

   ```bash
   curl -i -X POST https://mcp.orangescrum.com/mcp/partner \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","method":"ping","id":1}'
   ```

2. Bump `version` in `server.json`. The registry rejects a version it has already seen. Keep the plugin manifests' versions aligned if the plugin content changed too.
3. If the server added, renamed, or removed tools, update `scripts/tools.json` and the counts in the README module table.
4. Run `npm run validate` and `npm test`, then `mcp-publisher validate server.json` for the registry's own checks.

## Publish

Publish from a workstation:

```bash
# Install the publisher (macOS/Linux)
brew install mcp-publisher   # or download from github.com/modelcontextprotocol/registry/releases

mcp-publisher login dns --domain orangescrum.com --private-key "<hex private key>"
mcp-publisher publish
```

## Verify

```bash
curl -s "https://registry.modelcontextprotocol.io/v0.1/servers?search=com.orangescrum/orangescrum-mcp-server" | jq
```

The new version should appear with `"isLatest": true`.

## After the first publish

Downstream catalogs read the registry on their own schedule and decide independently whether to list a server.

* **GitHub MCP Registry** (`github.com/mcp`): email partnerships@github.com asking for `com.orangescrum/orangescrum-mcp-server` to be included. Its listing page renders this repository's README, so the repository must be **public** by then.
* **VS Code** and other clients that browse the registry pick the entry up automatically.

## Changing the endpoint later

Each remote URL can belong to only one server name, and old versions stay in the registry. To move to a new URL, publish a new version whose `remotes` lists the new URL (and the old one too, while it still works), then update `.mcp.json`, `mcp.json`, and `gemini-extension.json` in the same pull request. `npm run validate` fails if they disagree.
