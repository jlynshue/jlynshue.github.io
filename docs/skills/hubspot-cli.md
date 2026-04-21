# Skill: HubSpot CLI (`hs`)

> **Purpose:** Guide AI agents through HubSpot CLI operations for account management, authentication, and API access.
> **When to use:** Any time HubSpot CRM configuration, property management, or API token generation is needed.

---

## Overview

The HubSpot CLI (`hs` or `@hubspot/cli`) is a command-line tool for managing HubSpot accounts, apps, and development projects. For agent workflows, its primary value is **authentication and token management** — generating Personal Access Keys (PAKs) that power both direct API calls and the server-side HubSpot integration.

---

## Installation

```bash
npm install -g @hubspot/cli

# Verify
hs --version
```

---

## Authentication

### Personal Access Key (PAK) — Recommended for API Access

```bash
# Interactive auth (opens browser for OAuth consent)
hs auth --auth-type personalaccesskey

# Non-interactive (if you already have the key)
hs auth --auth-type personalaccesskey --personal-access-key "pat-na2-xxxxx" --account "245967806"
```

**What happens:**
1. Opens browser → HubSpot OAuth consent screen
2. You select scopes (permissions)
3. CLI saves config to `~/.hubspot/hubspot.config.yml` or `~/.hscli/config.yml`

### Config File Location

The CLI stores credentials in one of:
```
~/.hscli/config.yml          (newer versions)
~/.hubspot/hubspot.config.yml (older versions)
./hubspot.config.yml          (project-local)
```

### Config File Structure

```yaml
defaultAccount: 245967806
accounts:
  - name: goose-infra-PAT
    accountId: 245967806
    env: prod
    authType: personalaccesskey
    accountType: STANDARD
    personalAccessKey: >-
      CiRuYTItN2I2NC1iODk5...
    auth:
      tokenInfo:
        accessToken: >-
          CLCoieraMxIgQlNQ...
        expiresAt: '2026-04-20T23:38:18.577Z'
```

### Extracting the Token

```bash
# Extract PAK from config (for use as HUBSPOT_TOKEN)
python3 -c "
import yaml
with open('$HOME/.hscli/config.yml') as f:
    config = yaml.safe_load(f)
for acct in config.get('accounts', []):
    if acct.get('accountId') == 245967806:
        print(acct.get('personalAccessKey', '').strip())
"
```

**⚠️ Important:** The `personalAccessKey` from `hs auth` is a **short-lived OAuth token**, not a permanent API key. For production use, create a proper **Private App** token or use `hs accounts auth` with the PAK auth type that generates a long-lived key.

### Better Option: Service Key from HubSpot Settings

For production server-side integrations, use a service key created in the HubSpot UI:
1. HubSpot → Settings → Account & Billing → Integrations → Private Apps
2. Create app → select scopes → generate token
3. Token format: `pat-na2-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (44 chars)
4. This is permanent until revoked.

---

## Required Scopes for jonathanlynshue-site

### Core (server sync job uses these)
```
crm.objects.contacts.read
crm.objects.contacts.write
crm.objects.deals.read
crm.objects.deals.write
crm.schemas.contacts.read
crm.schemas.contacts.write
crm.schemas.deals.read
crm.schemas.deals.write
```

### Recommended Additional
```
crm.objects.companies.read
crm.objects.companies.write
crm.objects.owners.read
crm.lists.read
crm.lists.write
crm.export
sales-email-read
```

---

## Common Commands

### Account Info
```bash
hs account info
# Shows: portal ID, name, account type, auth status
```

### List Accounts
```bash
hs account list
```

### Use Specific Account
```bash
hs account use 245967806
```

### Sandbox (for testing)
```bash
hs sandbox create --name "dev-test"
hs sandbox list
hs sandbox delete --name "dev-test"
```

---

## Using the PAK with HubSpot REST API

Once you have the token, use it as a Bearer token in API calls:

```bash
HUBSPOT_TOKEN="pat-na2-xxxxx"

# List pipelines
curl -s "https://api.hubapi.com/crm/v3/pipelines/deals" \
  -H "Authorization: Bearer ${HUBSPOT_TOKEN}"

# Create a deal
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/deals" \
  -H "Authorization: Bearer ${HUBSPOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"properties": {"dealname": "Test Deal", "pipeline": "default", "dealstage": "3536007900"}}'

# Create custom property
curl -s -X POST "https://api.hubapi.com/crm/v3/properties/deals" \
  -H "Authorization: Bearer ${HUBSPOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"my_prop","label":"My Property","type":"string","fieldType":"text","groupName":"dealinformation"}'

# Upsert contact
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts" \
  -H "Authorization: Bearer ${HUBSPOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"properties": {"email": "test@example.com", "firstname": "Test", "lastname": "User"}}'
```

---

## Agent Workflow: Setup from Scratch

```bash
# 1. Install CLI
npm install -g @hubspot/cli

# 2. Authenticate (opens browser)
hs auth --auth-type personalaccesskey

# 3. Verify
hs account info

# 4. Extract token for server use
TOKEN=$(python3 -c "import yaml; c=yaml.safe_load(open('$HOME/.hscli/config.yml')); print([a['personalAccessKey'] for a in c['accounts'] if a['accountId']==245967806][0].strip())")

# 5. Store in Keychain
security add-generic-password -a "jonathanlynshue-site" -s "HUBSPOT_TOKEN" -w "$TOKEN" -U

# 6. Set in GitHub secrets
gh secret set HUBSPOT_TOKEN --body "$TOKEN" --repo jlynshue/jlynshue.github.io

# 7. Test API access
curl -s "https://api.hubapi.com/crm/v3/pipelines/deals" -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `The OAuth token expired` | PAK from `hs auth` is short-lived | Create a proper service key in HubSpot UI |
| `User level OAuth token is not allowed` | Using the `accessToken` instead of `personalAccessKey` | Use the `personalAccessKey` field, not `auth.tokenInfo.accessToken` |
| `Transport closed` (MCP) | HubSpot MCP extension disconnected | Restart Goose or the extension; fallback to REST API |
| `You have reached your limit of 1 deal pipelines` | Free tier restriction | Repurpose the existing `default` pipeline instead of creating new |
| `PERMISSION_DENIED` on property creation | Missing `crm.schemas.*.write` scope | Regenerate token with correct scopes |

---

## Key Facts for This Project

| Item | Value |
|------|-------|
| Portal ID | `245967806` |
| Region | `na2` |
| Pipeline ID | `default` (renamed to "Executive Workflow Sprint") |
| Token format | `pat-na2-*` (44 chars) |
| Keychain entry | `HUBSPOT_TOKEN` (account: `jonathanlynshue-site`) |
| GitHub secret | `HUBSPOT_TOKEN` in `jlynshue/jlynshue.github.io` |
| GCP secret | `HUBSPOT_STAGE_EVENT_MAP_JSON` in `jonathanlynshue-site` project |
| Config path | `~/.hscli/config.yml` |
| API base URL | `https://api.hubapi.com` |
