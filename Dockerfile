# Hermes Agent on StartOS
# Layers the StartOS root CA, start-cli, and managed skills/knowledge on top of
# the official upstream image. We do NOT fork Hermes — the dashboard and gateway
# are the upstream binaries; StartOS provides auth, config forms, and lifecycle.
#
# To bump: docker buildx imagetools inspect nousresearch/hermes-agent:v2026.6.19
FROM nousresearch/hermes-agent:v2026.6.19@sha256:9f367c7756ef087661a361536a89f438d57a122b958dc23d82d456b1433e6e9e

ARG STARTOS_VERSION

USER root

# Tooling: ca-certificates for the StartOS root CA (installed at runtime via the
# Login action / oneshot), git+jq+ripgrep for the support docs-search skill.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    jq \
    ripgrep \
    && rm -rf /var/lib/apt/lists/*

# start-cli — the StartOS server-administration CLI the agent drives (see
# skills/start-cli). Authenticated at runtime by the "Login to StartOS" action.
RUN curl -fsSL "https://github.com/Start9Labs/start-os/releases/download/v${STARTOS_VERSION}/start-cli_$(uname -m)-linux" -o /usr/local/bin/start-cli \
    && chmod +x /usr/local/bin/start-cli

# Keep the upstream shim, venv, and user-local bin on PATH for shells the agent
# spawns. v2026.6.19 uses /opt/hermes/bin/hermes as the docker-exec shim and
# keeps mutable user installs under /opt/data.
ENV PATH="/opt/hermes/bin:/opt/hermes/.venv/bin:/opt/data/.local/bin:${PATH}"
RUN echo 'export PATH="/opt/hermes/bin:/opt/hermes/.venv/bin:/opt/data/.local/bin:$PATH"' > /etc/profile.d/hermes-venv.sh && \
    ln -sf /opt/hermes/.venv/bin/hermes /usr/local/bin/hermes

# Managed context — image-owned so it updates with normal package upgrades and
# the agent cannot edit it. Skills are wired into config.yaml via skills.external_dirs
# at init; the support bundle is the baseline that the background refresh replaces.
COPY skills /opt/startos/skills
COPY knowledge/bundle.json /opt/startos/knowledge/bundle.json

# Match StartOS's app UID/GID (1000) using the base image's hermes user, same as
# the upstream gateway entrypoint expects when it drops privileges.
RUN groupmod -o -g 1000 hermes 2>/dev/null || true && \
    usermod -u 1000 -g 1000 -d /opt/data -s /bin/bash hermes 2>/dev/null || true

# Own the Hermes home scaffolding (hooks/, cron/, sessions/, …) as uid 1000.
# ensure_hermes_home() runs on every `import hermes_cli` — including StartOS's
# root-run health probes (the provider/gateway liveness checks) — and creates
# those subdirs owned by the running uid (root, for the probes) unless these are
# set, in which case it chowns each created dir to them (upstream #34107). Without
# this the hermes-user gateway gets EACCES on $HOME/hooks on the FIRST boot and
# crash-loops until a later boot's chown -R repairs it. Image-wide (not on the
# StartOS daemon env) so the root probes inherit it too.
ENV HERMES_UID=1000 \
    HERMES_GID=1000

# Dashboard (web UI / chat) and gateway API. StartOS binds the dashboard as the
# `ui` interface; the gateway API stays internal.
EXPOSE 9119
EXPOSE 8642
