# Updating the upstream version

This package runs the **official upstream `nousresearch/hermes-agent` image** — it does not fork or rebuild Hermes. "Upstream" means that published image. The package also bakes in a `start-cli` binary, which tracks a separate StartOS release (see the bottom of this page).

## Determining the upstream version

- **Hermes** ([`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent)) — latest release tag:

  ```bash
  gh release view -R NousResearch/hermes-agent --json tagName -q .tagName
  ```

  Cross-check it has been published to Docker Hub:

  ```bash
  curl -fsSL "https://hub.docker.com/v2/repositories/nousresearch/hermes-agent/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  Then resolve the **multi-arch manifest-list digest** for the tag (this is what the `Dockerfile`'s `FROM` pins, not a per-arch digest):

  ```bash
  docker buildx imagetools inspect nousresearch/hermes-agent:<tag>
  ```

  The current pin lives in `Dockerfile` (`FROM nousresearch/hermes-agent:v<version>@sha256:<digest>`) and is mirrored as `HERMES_VERSION` in `startos/utils.ts`.

## Applying the bump

- **`Dockerfile`** — set `FROM nousresearch/hermes-agent:v<new version>@sha256:<new list digest>` and update the `# To bump:` comment to the new tag. Confirm the new image still satisfies the hardcoded assumptions in the rest of the `Dockerfile` (`/opt/hermes/.venv` on PATH, `HERMES_HOME=/opt/data`, root user, `/opt/hermes` workdir).
- **`startos/utils.ts`** — set `HERMES_VERSION` to `<new version>` (without the leading `v`).
- **`startos/versions/current.ts`** — edit in place: set `version` to `'<new version>:0'` (the `:N` revision resets to `0` on a new upstream version) and update `releaseNotes` (all locales). Leave `index.ts` and the `current` export untouched. Only spin off a historical version file when the bump carries an `up`/`down` migration.

## The baked `start-cli` (`STARTOS_VERSION`)

Separate from the Hermes image, the `Dockerfile` downloads a `start-cli` binary for the **Login to StartOS** skill, pinned by `STARTOS_VERSION` in `startos/utils.ts`. It tracks a [`Start9Labs/start-os`](https://github.com/Start9Labs/start-os) release — now the `start-technologies` monorepo, which the old URL redirects to — not Hermes.

> [!WARNING]
> **Do not use a bare `gh release view` on that repo.** It is a monorepo publishing releases for *several* products under per-product tag prefixes (`start-cli/`, `start-sdk/`, `start-wrt/`, …), so "Latest" is whichever product shipped most recently. Today `gh release view -R Start9Labs/start-os --json tagName -q .tagName` returns **`start-wrt/v1.0.0`** — a StartWRT router-OS release that has nothing to do with `start-cli`. Pinning it would be meaningless.

The `start-cli` release line specifically:

```bash
gh release list -R Start9Labs/start-os -L 60 --json tagName \
  -q '[.[] | select(.tagName | startswith("start-cli/"))][0].tagName'
```

> [!IMPORTANT]
> **The newest `start-cli` is not currently pinnable without a `Dockerfile` change.** That command returns `start-cli/v1.0.2`, but the `Dockerfile` builds its download URL as:
>
> ```
> https://github.com/Start9Labs/start-os/releases/download/v${STARTOS_VERSION}/start-cli_$(uname -m)-linux
> ```
>
> The tag path segment is hardcoded as `v` + `STARTOS_VERSION`, which **cannot express** a slash-prefixed tag like `start-cli/v1.0.2` — no value of `STARTOS_VERSION` produces it. So the newest usable value is the newest release still on the **legacy un-prefixed tag scheme**:
>
> ```bash
> gh release list -R Start9Labs/start-os -L 60 --json tagName \
>   -q '[.[] | select(.tagName | test("^v[0-9]"))][0].tagName'
> ```
>
> which is **`v0.4.0-beta.9`** — the value `STARTOS_VERSION` currently holds (`0.4.0-beta.9`). **Moving to the 1.0.x line requires reworking that URL** to carry the `start-cli/` prefix (the 1.0.x releases do still publish the same `start-cli_x86_64-linux` / `start-cli_aarch64-linux` assets, so only the tag shape is in the way). Don't just bump the variable — it will 404 at image build.

Set `STARTOS_VERSION` to the tag without the leading `v` (the `Dockerfile` prepends it). The release must publish `start-cli_x86_64-linux` and `start-cli_aarch64-linux` assets, which the `$(uname -m)` download depends on — verify before pinning:

```bash
gh release view <tag> -R Start9Labs/start-os --json assets -q '.assets[].name' | grep start-cli_
```
