---
name: startos-support
description: Answer StartOS and StartTunnel support questions using the bundled Start9 documentation and known-issues knowledge bundle.
user-invocable: false
---

# startos-support — Start9 documentation & support

Use this skill to answer questions about **StartOS**, **StartTunnel**, and **StartOS service packages** (installation, configuration, usage, troubleshooting). The answers come from a local, pre-indexed knowledge bundle published by Start9's support-server — full documentation page text plus known issues and registry package info. It is refreshed in the background; you never need to crawl the web for these answers.

## Tool

Run the bundled search script (Python, no network):

```bash
# List available documentation indexes (page titles + summaries) and packages
python3 /opt/startos/skills/startos-support/docs-search.py index

# Fetch the full text of a documentation page or a package overview
python3 /opt/startos/skills/startos-support/docs-search.py page "Initial Setup"
python3 /opt/startos/skills/startos-support/docs-search.py page "bitcoind"

# Full-text search across pages, package descriptions, and known issues
python3 /opt/startos/skills/startos-support/docs-search.py search "port forwarding"

# List active known issues (optionally filtered by package id)
python3 /opt/startos/skills/startos-support/docs-search.py issues
python3 /opt/startos/skills/startos-support/docs-search.py issues bitcoind
```

## How to use it

1. Run `index` first to see what documentation pages and packages exist.
2. Identify the relevant page title or package id, then `page` to pull the full content.
3. Check `issues` for known problems before giving troubleshooting advice.
4. Answer from the retrieved content. **Do not invent** page titles or facts not present in the bundle.

> Scope note: the bundle covers StartOS, StartTunnel, and packages/upstream docs. It does **not** include the Packaging/SDK book or Bitcoin Guides — don't answer those from this bundle.
>
> - **s9pk packaging / SDK questions:** point the user to the packaging guide at <https://docs.start9.com/packaging>. The modern flow is workspace-first: `start-cli s9pk init-workspace` scaffolds an AI-ready workspace (guide + `@start9labs/start-sdk` 2.0 + a build-key), then `start-cli s9pk init-package "<Name>"` scaffolds a package with a `TODO.md` checklist to work top to bottom. Use the **start-cli** skill for the packaging CLI commands (`s9pk`, `registry`).
> - **Bitcoin setup questions:** point to the Bitcoin Guides on the Start9 docs site.
