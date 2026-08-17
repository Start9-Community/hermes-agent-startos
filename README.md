<p align="center">
  <img src="icon.png" alt="Hermes Agent Logo" width="21%">
</p>

# Hermes Agent on StartOS

> Everything not listed in this document should behave the same as upstream
> Hermes Agent. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Hermes Agent](https://github.com/NousResearch/hermes-agent) is a self-hosted AI agent with a web dashboard, a messaging gateway, and a skill system. This package lets it run against a local LLM on the same server or a cloud provider, gives it a curated knowledge bundle about StartOS, and can optionally grant it authority to administer the server it runs on.

- **Upstream repo:** <https://github.com/NousResearch/hermes-agent>
- **Wrapper repo:** <https://github.com/Start9-Community/hermes-agent-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here — upstream's application plus a `start-cli` binary, which is what makes server administration possible at all.

| Property      | Value                               |
| ------------- | ----------------------------------- |
| Image         | Built from this repo's `Dockerfile` |
| Architectures | x86_64, aarch64                     |

| Subcontainer | Purpose                                                      |
| ------------ | ------------------------------------------------------------ |
| `hermes-sub` | Every oneshot and all three daemons — the one to `attach` to |

Three daemons run: the **dashboard**, the **messaging gateway**, and a **bundle refresher**. Two oneshots run first — one installing the server's root certificate into the container's trust store, the other fixing ownership on the data directory.

**The root-CA install is what lets the agent talk to the server it runs on.** `start-cli` reaches StartOS over HTTPS with the device's own certificate, which nothing in the image would otherwise trust.

## Volume and Data Layout

One volume, holding everything the agent accumulates.

| Volume | Mount Point | Purpose                                                             |
| ------ | ----------- | ------------------------------------------------------------------- |
| `main` | `/opt/data` | Configuration, credentials, sessions, and the live knowledge bundle |

| Path                             | Written by    | Holds                                               |
| -------------------------------- | ------------- | --------------------------------------------------- |
| `config.yaml`                    | Both          | Hermes' own configuration                           |
| `.env`                           | Both          | Provider credentials                                |
| `auth.json`                      | Both          | OAuth provider state                                |
| `.startos/config.yaml`           | The package   | `start-cli`'s host, plus its identity key beside it |
| `.startos/store.json`            | The package   | Package state                                       |
| `.startos/knowledge/bundle.json` | The refresher | The live knowledge bundle                           |

**The skills and the baseline knowledge bundle live in the image, not on the volume**, deliberately: outside the data directory the agent cannot edit them, and they update with the package rather than persisting stale across an upgrade.

## File Models

Five models, and the notable thing is how little of the application's own configuration the package claims.

| File                   | Format | Modelled                | Written by             |
| ---------------------- | ------ | ----------------------- | ---------------------- |
| `config.yaml`          | YAML   | Yes                     | The package and Hermes |
| `.env`                 | env    | Yes — a flat string map | The package and Hermes |
| `auth.json`            | JSON   | Yes                     | The package and Hermes |
| `.startos/config.yaml` | YAML   | Yes                     | The package            |
| `.startos/store.json`  | JSON   | Yes                     | The package            |

**Hermes is the source of truth for its own configuration, and the models are written to keep it that way.** Every modelled object is _loose_, so keys the package does not name survive a write instead of being stripped — which is what preserves two-way binding with the dashboard. The package touches only a few keys: the skills wiring, provider routing, and the dashboard password hash.

That has a consequence worth stating plainly: **a setting changed in the dashboard is not overwritten by the package**, and a setting changed by an action shows up in the dashboard. They are the same file.

**The dashboard password is stored only as a hash**, computed to the exact framing the application expects — the format was read from its source and round-tripped against its own verifier in both directions, because upstream exposes no command to set a password and writing the hash is the only path.

**The store deliberately does not track the active backend.** The dependency is derived reactively from the application's own configuration instead, so it follows the live selection whether it was made by the action or by editing the dashboard.

## Dependencies

Three are declared optional, and **at most one is required** — derived from whichever local runtime the configuration names.

| Provider selected | Dependency  | Health check |
| ----------------- | ----------- | ------------ |
| Ollama            | `ollama`    | `primary`    |
| vLLM              | `vllm`      | `primary`    |
| llama.cpp         | `llama-cpp` | `primary`    |
| A cloud provider  | None        | —            |

Choose a cloud or custom provider and this package depends on nothing.

**The dependency follows the configuration, not the action.** It is read reactively from Hermes' own config, so switching backends inside the dashboard changes the declared dependency without touching StartOS — no re-run of the action needed.

Note the id mismatch on one of them: the provider is named one thing in the configuration and the StartOS package another, and the package maps between them.

## Network Access and Interfaces

One interface.

| Interface     | Id   | Type | Port | Path     | Description                                                 |
| ------------- | ---- | ---- | ---- | -------- | ----------------------------------------------------------- |
| Web Dashboard | `ui` | ui   | 9119 | `/login` | Chat, configuration, sessions, skills, logs, and scheduling |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

**The interface deliberately lands on the login page rather than the root**, and that is a workaround rather than a preference. The application's auth gate skips its login interstitial when exactly one provider is registered and redirects into the OAuth initiation route — which, with a password-only provider, raises an error and serves a 500 that only clears on reload. The login path is in upstream's public allowlist and renders the form directly. It reverts to the root once upstream stops auto-redirecting password-only providers.

The messaging gateway is not exported — it reaches out rather than being reached.

## Installation and First-Run Flow

Install raises three tasks, and only one of them is optional.

1. **Set a dashboard password** — `critical`, and genuinely blocking. The application's auth gate **fails closed on a non-loopback bind with no auth provider registered**, so without a password the dashboard cannot serve at all. This also covers upgrading from a release that served it unauthenticated.
2. **Configure a provider** — `critical`. Hermes is not usable without an LLM backend, and there is no default.
3. **Log in to StartOS** — `optional`. This is the one that grants the agent authority over the server; see [Actions](#actions).

Once running, the bundle refresher fetches the current knowledge bundle in the background, falling back to the baseline shipped in the image.

## Actions

Five actions, one of them hidden.

### Set Dashboard Password

Generates a dashboard password and writes its hash into the configuration.

- **When to run it:** **only while stopped** — the configuration is read at start.
- **What it changes:** the password hash in `config.yaml`. The plaintext is returned once and stored nowhere.
- **Repeat safety:** each run replaces the password.
- **Outputs:** the username and the new password.

### Configure Provider

Chooses and configures the LLM backend — a local runtime on this server, or a cloud provider.

- **What it changes:** the provider routing in `config.yaml`, credentials in `.env`, and the selection in the store for form pre-fill.
- **Cost:** applies on restart; the declared dependency changes with it.
- **Repeat safety:** idempotent.
- **Choosing a cloud provider sends your conversations to it.** A local runtime keeps them on the box, at the cost of running the model yourself.
- **One provider uses a device-code login**, which cannot complete in a single action — see below.

### Complete OpenAI Codex OAuth — hidden

**Not user-facing in the Actions list.** It is reachable only through the task raised when a device-code login is started, so a user is never told to go and find it.

- **What it changes:** writes the obtained token into the application's OAuth state.
- **When it appears:** only while a login is genuinely pending and unexpired.

### Login to StartOS

Authenticates `start-cli` inside the container with the server's master password, so the agent can administer the server.

- **What it changes:** stores an identity key beside `start-cli`'s configuration on the volume.
- **This is the most consequential action in the package.** It grants an AI agent the ability to operate your server through `start-cli`. It is `optional` rather than `critical` precisely because it is a choice, not a requirement.
- **The master password is used to obtain the key**, not stored.
- **Repeat safety:** re-runnable.

### Revoke StartOS Access

Removes that authority.

- **What it changes:** drops the stored identity, so `start-cli` in the container is no longer authenticated.
- **Repeat safety:** idempotent; safe to run whether or not access was granted.
- **Run this first** if you are unsure what the agent has been doing.

## Tasks

Four, and one of them is reconciled on every init rather than merely raised.

| Task                        | Severity   | Raised when                            | Cleared when            |
| --------------------------- | ---------- | -------------------------------------- | ----------------------- |
| Set Dashboard Password      | `critical` | The configuration has no password hash | The action runs         |
| Configure Provider          | `critical` | At install                             | The action runs         |
| Login to StartOS            | `optional` | At install                             | The action runs         |
| Complete OpenAI Codex OAuth | `critical` | A device-code login is started         | It completes or expires |

**The password task is reactive**, keyed on the configuration rather than on install, so it also appears for an install upgrading from an unauthenticated release.

**The Codex task is reconciled, not just cleared on success**, and the reason is that it is `critical` — a stale one would hold the service stopped indefinitely. Every init checks whether a login is genuinely pending and unexpired, and removes the task otherwise: after completion, after switching providers, or when an unfinished flow times out.

`optional` is prominent but non-blocking, which is right for granting server access — a Hermes that never gets it is perfectly functional as a chat agent.

## Health Checks

Four checks, all displayed.

| Check                 | Displayed as        | Method                                 | Grace |
| --------------------- | ------------------- | -------------------------------------- | ----- |
| `dashboard`           | "Web Dashboard"     | The dashboard port is serving          | 60s   |
| `gateway`             | "Messaging Gateway" | The gateway process is up              | 60s   |
| `provider-configured` | "LLM Provider"      | A provider is configured and reachable | 30s   |
| `bundle-refresh`      | "Knowledge Bundle"  | The bundle is present                  | 30s   |

**"LLM Provider" is the one that distinguishes "running" from "working".** The dashboard can serve perfectly while the agent cannot answer anything, because its backend is missing, misconfigured, or — for a local runtime — not running.

**"Knowledge Bundle" reports the StartOS-specific knowledge**, refreshed in the background from a published source with the image's baseline as a fallback. A failure there degrades the agent's StartOS answers; it does not stop it working.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`.

**This backup contains credentials of two kinds**, and both matter: the provider credentials in `.env` and `auth.json` — cloud API keys and OAuth tokens — and, if server access was granted, **the `start-cli` identity that can administer this server**. Treat it accordingly, and consider revoking server access before taking a backup you intend to move off the box.

It also contains every session and conversation the agent has held.

A restored instance comes back configured, still authenticated to its provider, and still holding whatever server access it had. The skills and the baseline bundle come from the image rather than the backup, so they are whatever the restored version ships.

## Limitations and Differences

1. **The dashboard cannot serve without a password.** The auth gate fails closed on a non-loopback bind, so this is enforced rather than advised.
2. **The interface lands on `/login`** to work around an upstream redirect that 500s with a password-only provider.
3. **Granting server access gives an AI agent operational control of the server**, and the credential for it is in the backup.
4. **Skills and the baseline knowledge bundle are image-owned**, so the agent cannot edit them and they reset on upgrade.
5. **Hermes owns its own configuration.** The package writes a few keys and preserves the rest, so dashboard edits and action edits share one file.
6. **Cloud providers send conversations off the box.** Local runtimes require the corresponding package.
7. **The password can only be changed while stopped.**

---

## Quick Reference for AI Consumers

```yaml
package_id: hermes-agent
image: built from ./Dockerfile # upstream app plus a pinned start-cli binary
architectures:
  - x86_64
  - aarch64
subcontainers:
  - hermes-sub # two oneshots and three daemons
volumes:
  main: /opt/data
file_models:
  - config.yaml # Hermes' own; loose, two-way bound with the dashboard
  - .env # provider credentials
  - auth.json # OAuth state
  - .startos/config.yaml # start-cli host
  - .startos/store.json # package state
startos_managed_env_vars:
  - HOME
  - NODE_EXTRA_CA_CERTS
dependencies: # at most one, derived from config.yaml's model.provider
  - ollama
  - vllm
  - llama-cpp # provider id in config is `llamacpp`
interfaces:
  ui: { type: ui, port: 9119, path: /login }
actions:
  - set-dashboard-password # only-stopped
  - configure-provider
  - complete-codex-oauth # hidden; raised by task only
  - login-to-os
  - revoke-startos-access
tasks:
  - { action: set-dashboard-password, severity: critical } # reactive
  - { action: configure-provider, severity: critical } # install only
  - { action: login-to-os, severity: optional } # install only
  - { action: complete-codex-oauth, severity: critical } # reconciled every init
health_checks:
  - dashboard # displayed "Web Dashboard"
  - gateway # displayed "Messaging Gateway"
  - provider-configured # displayed "LLM Provider"
  - bundle-refresh # displayed "Knowledge Bundle"
```
