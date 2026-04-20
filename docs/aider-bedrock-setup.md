# Aider Bedrock Setup

This project lives at:

```bash
/Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
```

Run `aider` from this repo, not from `/Users/jonathanlyn-shue/code-projects`, because the monorepo root is not the git-tracked project you want to edit.

## Current Bedrock Model Choice

As of the current local AWS account check in `us-east-1`:

- Preferred: `anthropic.claude-opus-4-7`
- Fallback: `anthropic.claude-opus-4-6-v1`

For `aider`, use the Bedrock model prefix:

- Preferred: `bedrock/anthropic.claude-opus-4-7`
- Fallback: `bedrock/anthropic.claude-opus-4-6-v1`

## Prerequisites

Make sure these work first:

```bash
command -v aider
command -v aws
aws sts get-caller-identity
aws bedrock list-foundation-models --region us-east-1 --by-provider anthropic --output text
```

## Exact Launch Commands

### Preferred model

```bash
cd /Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
AWS_REGION=us-east-1 aider --model bedrock/anthropic.claude-opus-4-7
```

### Fallback model

```bash
cd /Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
AWS_REGION=us-east-1 aider --model bedrock/anthropic.claude-opus-4-6-v1
```

## Keychain-Backed Launch Pattern

`aider` does not use a single Bedrock API token. It uses AWS credentials. If you want those credentials to come from macOS Keychain, load them into environment variables first and then start `aider`.

This repo already has a helper that matches the local Keychain workflow:

```bash
source /Users/jonathanlyn-shue/code-projects/scripts/mcp/keychain-helper.sh
```

### Preferred model with Keychain-backed AWS credentials

Replace the placeholder service names below with your actual Keychain item names.

```bash
cd /Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
source /Users/jonathanlyn-shue/code-projects/scripts/mcp/keychain-helper.sh
export AWS_ACCESS_KEY_ID="$(require_secret "<aws-access-key-id-service>" "AWS Access Key ID")"
export AWS_SECRET_ACCESS_KEY="$(require_secret "<aws-secret-access-key-service>" "AWS Secret Access Key")"
export AWS_SESSION_TOKEN="$(get_secret "<aws-session-token-service>")"
export AWS_REGION=us-east-1
aider --model bedrock/anthropic.claude-opus-4-7
```

### Fallback model with Keychain-backed AWS credentials

```bash
cd /Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
source /Users/jonathanlyn-shue/code-projects/scripts/mcp/keychain-helper.sh
export AWS_ACCESS_KEY_ID="$(require_secret "<aws-access-key-id-service>" "AWS Access Key ID")"
export AWS_SECRET_ACCESS_KEY="$(require_secret "<aws-secret-access-key-service>" "AWS Secret Access Key")"
export AWS_SESSION_TOKEN="$(get_secret "<aws-session-token-service>")"
export AWS_REGION=us-east-1
aider --model bedrock/anthropic.claude-opus-4-6-v1
```

If you do not use temporary AWS credentials, omit `AWS_SESSION_TOKEN`.

## Recommended Verification

After launch, confirm `aider` is using the Bedrock model you expect. If the preferred model fails because access is not enabled or the model is unavailable, rerun with the fallback command above.

## Notes

- This project is a git repo, so run `aider` here.
- The monorepo root is not the right place to launch `aider`.
- If you want to avoid retyping the Keychain export block, turn it into a local shell alias or wrapper script outside the repo root workflow files.
