# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `hermes-agent`.** The single exported interface is the `ui` "Web Dashboard" (host id `ui-multi`, interface id `ui` — both exported from `startos/interfaces.ts`); nothing is exported for dependents.
- **Local-inference backends (Ollama, vLLM, llama.cpp) are optional runtime dependencies selected in the *Configure Provider* action**, not npm `-startos` packages. `setupDependencies` (`startos/dependencies.ts`) flips the chosen one to a `running` dep reactively off Hermes' own `config.yaml`. Their OpenAI-compatible `api` endpoints (all on host id `api-multi`, interface id `api`) are resolved over the LXC bridge at apply time via `sdk.host.get(effects, { hostId, packageId }, …)` — string-literal ids, since there's no sibling source to import from. The dependency must be installed and running before Configure Provider can wire it.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach hermes-agent -n hermes-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `hermes-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
