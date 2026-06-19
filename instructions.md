# Hermes Agent

Hermes Agent runs an LLM of your choosing that can execute commands on your behalf. If you grant it server access (the *Login to StartOS* action), it gains root-equivalent control of your StartOS server. Run it only on a machine you treat as disposable — one that holds no other services or keys you can't afford to lose.

## Documentation

- [Hermes Agent docs](https://hermes-agent.nousresearch.com/docs) — the upstream user guide.
- [Web dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard) — the control panel and in-browser chat this package exposes.
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) — providers, models, channels, and cron jobs.

## What you get on StartOS

- **The Hermes dashboard**, served over the **Web Dashboard** interface — in-browser chat (the full Hermes TUI) plus configuration, session/memory browsing, skill toggles, logs, token/cost analytics, and cron scheduling, all behind StartOS authentication.
- **A messaging gateway** for connecting Telegram, Discord, Signal, Slack, Matrix, and other platforms (configured in the dashboard).
- **Optional local inference** — choose Ollama, vLLM, or llama.cpp in the *Configure Provider* action and the backend is added as a dependency and wired automatically, so no cloud API key is required.
- **StartOS-aware skills** — a `start-cli` skill for administering this server (after *Login to StartOS*) and a `startos-support` skill backed by the Start9 documentation knowledge bundle, refreshed in the background.

## Getting set up

1. Open Hermes' **Dashboard** tab. On a fresh install a critical task is waiting: **Configure Provider**. It's required before Hermes can run.
2. Run **Configure Provider**. Pick your LLM backend:
   - **Ollama**, **vLLM**, or **llama.cpp** for local inference on your server (added as a dependency — install it from the Marketplace if you haven't).
   - **OpenAI-Compatible**, **Google Gemini**, or **xAI Grok** for a cloud provider (supply the API key and model).
   - **OpenAI Codex OAuth** for ChatGPT/Codex access. The action returns a browser URL and device code instead of asking for raw tokens.
3. If you chose **OpenAI Codex OAuth**, open the returned URL, enter the code, then run **Complete OpenAI Codex OAuth**.
4. Open the **Web Dashboard** interface. Confirm the chat loads and that you can send a prompt. The **LLM Provider** health check turns green once a provider resolves.
5. *(Optional)* Run **Login to StartOS** to authenticate the bundled `start-cli` so the agent can administer this server. It asks for your StartOS master password. **This grants the agent root-equivalent access — only do this on a machine you treat as expendable.**

## Using Hermes

### Web Dashboard

The dashboard is your main surface: chat with the agent, edit configuration, browse sessions and memory, toggle skills, view logs and cost analytics, and schedule recurring prompts (cron). The interface is protected by StartOS authentication.

### Messaging channels

Connect Telegram, Discord, Signal, Slack, Matrix, and others from the dashboard's configuration, following the upstream documentation. Once connected you can talk to the same agent from any of those platforms.

### Server administration & support

- After *Login to StartOS*, the agent can use `start-cli` to read service status, manage packages, send notifications, and more.
- Ask the agent about StartOS, StartTunnel, or installed packages and it will answer from the bundled Start9 documentation knowledge bundle.

## Limitations

- **Privacy.** With a cloud provider, every prompt and its context is sent to that provider. Treat anything you type as visible to them. Use Ollama, vLLM, or llama.cpp to keep inference on-device.
- **Destructive capability.** After *Login to StartOS*, the agent can run commands that uninstall services, change configuration, or render the server unusable. There is no built-in confirmation step; if you want that guardrail, don't run *Login to StartOS*.
- **Support docs scope.** The bundled knowledge covers StartOS, StartTunnel, and packages — not the s9pk Packaging book or Bitcoin Guides.
- **MCP.** Live StartOS tools over the Model Context Protocol are planned for a future release; for now server administration is via the `start-cli` skill.
