# Hermes Agent

Hermes Agent runs an LLM of your choosing that can execute commands on your behalf. If you grant it server access (the _Login to StartOS_ action), it gains root-equivalent control of your StartOS server. Run it only on a machine you treat as disposable — one that holds no other services or keys you can't afford to lose.

## Documentation

- [Hermes Agent docs](https://hermes-agent.nousresearch.com/docs) — the upstream user guide.
- [Web dashboard](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard) — the control panel and in-browser chat this package exposes.
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) — providers, models, channels, and cron jobs.

## What you get on StartOS

- **The Hermes dashboard**, served over the **Web Dashboard** interface — in-browser chat (the full Hermes TUI) plus configuration, session/memory browsing, skill toggles, logs, token/cost analytics, and cron scheduling, all behind a password login that StartOS sets up for you.
- **A messaging gateway** for connecting Telegram, Discord, Signal, Slack, Matrix, and other platforms (configured in the dashboard).
- **Optional local inference** — choose Ollama, vLLM, or llama.cpp in the _Configure Provider_ action and the backend is added as a dependency and wired automatically, so no cloud API key is required.
- **StartOS-aware skills** — a `start-cli` skill for administering this server (after _Login to StartOS_) and a `startos-support` skill backed by the Start9 documentation knowledge bundle, refreshed in the background.

## Getting set up

1. Open Hermes' **Dashboard** tab. Two critical tasks are waiting.
2. Run **Set Dashboard Password** and save the password it returns. The username is `admin`. **This is the only time the password is shown** — it is never stored in plaintext. Hermes will not start until you do this: the dashboard holds your API keys and can run commands on your server, so it is never served without a login. Run the same action any time to rotate the password (stop Hermes first).
3. Run **Configure Provider**. Pick your LLM backend:
   - **Ollama**, **vLLM**, or **llama.cpp** for local inference on your server (added as a dependency). **Install and start the backend from the Marketplace first** — Configure Provider wires it over the internal network at apply time and errors if it isn't reachable yet. Then enter the model name your server serves.
   - **Google Gemini**, **xAI Grok**, **Anthropic Claude**, or an **OpenAI-Compatible** endpoint for a cloud provider — supply the API key and pick a **default model** from the dropdown (or type one into the Custom Model field).
   - **OpenAI Codex OAuth** for ChatGPT/Codex access — pick a default model; the action returns a browser URL and device code instead of asking for raw tokens.

   The model you pick here is the **default**. You can switch models anytime from within Hermes chat with the `/model` command.

4. If you chose **OpenAI Codex OAuth**, open the returned URL, enter the code, then run **Complete OpenAI Codex OAuth**.
5. Open the **Web Dashboard** interface. Confirm the chat loads and that you can send a prompt. The **LLM Provider** health check turns green once a provider resolves.
6. _(Optional)_ Run **Login to StartOS** to authenticate the bundled `start-cli` so the agent can administer this server. It asks for your StartOS master password, uses it for that login action, and stores an enrolled `start-cli` identity key on Hermes' data volume. **This grants the agent root-equivalent access — only do this on a machine you treat as expendable.**
7. Run **Revoke StartOS Access** if you later want to cut off that access without uninstalling the service. It un-enrolls Hermes' key from your server and deletes it, so there is no leftover session to clean up by hand.

## Using Hermes

### Web Dashboard

The dashboard is your main surface: chat with the agent, edit configuration, browse sessions and memory, toggle skills, view logs and cost analytics, and schedule recurring prompts (cron). Opening the interface takes you to a login page; sign in as `admin` with the password from **Set Dashboard Password**. Lost it? Stop Hermes and run that action again to set a new one.

### Messaging channels

Connect Telegram, Discord, Signal, Slack, Matrix, and others from the dashboard's configuration, following the upstream documentation. Once connected you can talk to the same agent from any of those platforms.

### Server administration & support

- After _Login to StartOS_, the agent can use `start-cli` to read service status, manage packages, send notifications, and more.
- _Revoke StartOS Access_ removes Hermes' stored `start-cli` authentication. Run _Login to StartOS_ again if you want to grant access back.
- Ask the agent about StartOS, StartTunnel, or installed packages and it will answer from the bundled Start9 documentation knowledge bundle.

## Limitations

- **Privacy.** With a cloud provider, every prompt and its context is sent to that provider. Treat anything you type as visible to them. Use Ollama, vLLM, or llama.cpp to keep inference on-device.
- **Destructive capability.** After _Login to StartOS_, the agent can run commands that uninstall services, change configuration, or render the server unusable. There is no built-in confirmation step; if you want that guardrail, don't run _Login to StartOS_. If you already granted access, run _Revoke StartOS Access_ to remove the stored `start-cli` authentication.
- **Support docs scope.** The bundled knowledge covers StartOS, StartTunnel, and packages — not the s9pk Packaging book or Bitcoin Guides.
- **MCP.** Live StartOS tools over the Model Context Protocol are planned for a future release; for now server administration is via the `start-cli` skill.
