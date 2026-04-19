---
date: 2026-04-19
agent: codex
category: execution-plan
tags: [hosting, analytics, firebase, cloud-run, posthog, hubspot]
---

# Hosting And Measurement Architecture

## Summary

`jonathanlynshue.com` now targets a split deployment:

- `Firebase Hosting` serves static assets from `dist/`
- `Cloud Run` handles same-domain HTML requests, tracked redirects, webhooks, and internal jobs
- `PostHog` receives server-side events
- `HubSpot` remains the CRM and revenue-stage system of record
- `Firestore` stores profiles, contacts, and event-delivery state
- `Cloud Tasks` handles async vendor delivery

This replaces GitHub Pages, GA4, Plausible, and frontend event tagging.

## Repo Surface

Core files:

- `server/src/app.ts`
- `server/src/repository.ts`
- `server/src/dispatcher.ts`
- `server/src/vendors.ts`
- `src/lib/tracking.ts`
- `.github/workflows/deploy.yml`
- `firebase.template.json`
- `scripts/render-firebase-config.mjs`
- `Dockerfile`
- `.env.example`

## Public Routes

Cloud Run owns these same-domain endpoints:

- `GET /healthz`
- `GET /r/discovery-call`
- `GET /r/lead-magnet`
- `POST /webhooks/calcom`
- `POST /webhooks/tally`
- `POST /internal/tasks/posthog-delivery`
- `POST /internal/tasks/hubspot-upsert`
- `POST /internal/sync/hubspot`

Firebase Hosting rewrites dynamic traffic to Cloud Run. Existing built files in `dist/` continue to serve directly from Hosting/CDN.

## Event Model

Implemented server-side events:

- `page_viewed`
- `cta_clicked`
- `calendar_redirected`
- `lead_magnet_redirected`
- `calendar_booked`
- `lead_captured`
- `contact_identified`
- `discovery_completed`
- `qualified_lead_marked`
- `diagnostic_sold`
- `sprint_sold`
- `retainer_started`

First-party cookies:

- `jls_aid` for the persistent anonymous profile
- `jls_sid` for the rolling session

Tracking tokens:

- Signed with `TRACKING_SECRET`
- Added to redirect destinations
- Parsed back out of `Cal.com` and `Tally` webhook payloads

## Vendor Contracts

`Cal.com`

- Discovery CTA redirects should land on `DISCOVERY_CALL_URL`
- The booking flow must preserve the signed tracking token returned on `/r/discovery-call`
- Webhook secret must match `CALCOM_WEBHOOK_SECRET`

`Tally`

- Lead magnet CTA redirects should land on `LEAD_MAGNET_URL`
- Include hidden fields for `jls_tracking` and optionally `asset` / `lead_asset`
- Webhook secret must match `TALLY_WEBHOOK_SECRET`

`HubSpot`

- Set custom contact properties for first touch, last touch, latest CTA, latest asset, and linked anonymous ID
- Configure `HUBSPOT_STAGE_EVENT_MAP_JSON` so deal stage changes emit the correct lifecycle events

## Required Secrets And Env Vars

Application/runtime:

- `BASE_URL`
- `COOKIE_DOMAIN`
- `DISCOVERY_CALL_URL`
- `LEAD_MAGNET_URL`
- `TRACKING_SECRET`
- `INTERNAL_API_TOKEN`
- `CALCOM_WEBHOOK_SECRET`
- `TALLY_WEBHOOK_SECRET`
- `POSTHOG_HOST`
- `POSTHOG_API_KEY`
- `HUBSPOT_TOKEN`
- `HUBSPOT_STAGE_EVENT_MAP_JSON`
- `FIRESTORE_PROJECT_ID`
- `CLOUD_TASKS_PROJECT`
- `CLOUD_TASKS_LOCATION`
- `CLOUD_TASKS_QUEUE`

GitHub Actions deployment:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`
- `GCP_PROJECT_ID`
- `GCP_REGION`
- `FIREBASE_PROJECT_ID`
- `PREVIEW_BASE_URL`

## Deployment Flow

Preview:

1. Push a branch and open a pull request.
2. GitHub Actions runs tests, typecheck, and `build:all`.
3. The workflow deploys a preview Cloud Run service.
4. `scripts/render-firebase-config.mjs` generates `firebase.generated.json`.
5. Firebase Hosting deploys a PR preview channel with rewrites to that preview Cloud Run service.

Production:

1. Merge to `main`.
2. GitHub Actions redeploys the production Cloud Run service.
3. Firebase Hosting deploys the static bundle and dynamic rewrites.
4. Traffic remains same-domain for assets, HTML, redirects, and webhooks.

## Manual Provisioning Checklist

These steps still must be done in Google Cloud and vendor dashboards:

1. Create the Firebase project and enable Hosting.
2. Create the Cloud Run service and allow unauthenticated invocations from Hosting rewrites.
3. Create the Firestore database.
4. Create the Cloud Tasks queue used by the app.
5. Create the Cloud Scheduler job that calls `/internal/sync/hubspot` with `Authorization: Bearer <INTERNAL_API_TOKEN>`.
6. Store all runtime secrets in GitHub Actions secrets and, if desired, Secret Manager.
7. Configure Workload Identity Federation for the GitHub Actions deploy workflow.
8. Point `jonathanlynshue.com` and `www.jonathanlynshue.com` at Firebase Hosting and complete SSL issuance.
9. Redirect `www` to the apex domain in Firebase/custom-domain settings.
10. Configure `Cal.com` and `Tally` webhooks to call the production `/webhooks/*` endpoints.

## Cutover Checklist

Before cutover:

- `npm test`
- `npm run typecheck`
- `npm run build:all`
- Preview channel loads the site correctly
- `/healthz` returns `ok`
- `/r/discovery-call` returns a `302` and sets `jls_aid` / `jls_sid`
- `Cal.com` webhook produces `calendar_booked`
- `Tally` webhook produces `lead_captured`

After cutover:

- Confirm page views appear in PostHog
- Confirm first-touch and last-touch properties land in HubSpot
- Confirm lifecycle events appear from the hourly HubSpot sync
- Remove any remaining GitHub Pages DNS or deployment settings

## Current Limitations

- Cloud resources are not provisioned from this repo; they still require one-time setup in Google Cloud.
- Website A/B testing is not yet implemented on the new stack.
- Session replay and heatmaps remain intentionally out of scope because they require frontend instrumentation.
