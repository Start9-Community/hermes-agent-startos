# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Don't track the active backend in `store.json`.** `dependencies.ts` derives it reactively from `config.yaml`'s `model.provider`, so it follows a dashboard edit as well as the action. The store's `provider` field is for form pre-fill only.
- **The local-inference dependency ids are string literals on purpose** — there is no sibling `-startos` package to import them from. Note the mismatch: the provider id is `llamacpp`, the package id is `llama-cpp`.
- **The `ui` interface's `path: '/login'` is a workaround, not a preference.** Hermes' auth gate skips its login interstitial when exactly one provider is registered and redirects into `/auth/login?provider=…`; with `basic_auth` as the only provider that route raises `NotImplementedError` and `/` serves a 500, recovering only on reload. `/login` is in upstream's public-path allowlist. Revert to `''` once upstream excludes password-only providers from auto-SSO — `TODO.md` tracks it.
- **The root-CA oneshot is what lets `start-cli` reach StartOS**, which speaks HTTPS with the device's own certificate. Dropping it breaks server administration with a TLS error rather than an auth one.
- **Skills and the baseline knowledge bundle live in the image, outside the data volume**, so the agent cannot edit them and they update with the package. Don't move them onto the volume.
