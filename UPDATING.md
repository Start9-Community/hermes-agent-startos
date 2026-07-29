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

## The baked `start-cli` (`START_CLI_VERSION`)

Separate from the Hermes image, the `Dockerfile` downloads a `start-cli` binary for the **Login to StartOS** skill, pinned by `START_CLI_VERSION` in `startos/utils.ts`. It tracks the `start-cli` release line in the [`Start9Labs/start-technologies`](https://github.com/Start9Labs/start-technologies) monorepo, not Hermes or StartOS itself.

> [!WARNING]
> **Do not use a bare `gh release view` on that repo.** The monorepo publishes releases for several products under per-product tag prefixes (`start-cli/`, `start-sdk/`, `start-wrt/`, …), so "Latest" may refer to a different product.

Find the latest `start-cli` tag specifically:

```bash
gh release list -R Start9Labs/start-technologies -L 60 --json tagName \
  -q '[.[] | select(.tagName | startswith("start-cli/"))][0].tagName'
```

Set `START_CLI_VERSION` to the version without the `start-cli/v` prefix. The `Dockerfile` constructs the product-scoped tag as `start-cli%2Fv${START_CLI_VERSION}`.

The release must publish both Linux architectures used by this package. Verify the assets before pinning:

```bash
gh release view "start-cli/v<version>" -R Start9Labs/start-technologies \
  --json assets -q '.assets[].name' \
  | grep -E '^start-cli_(x86_64|aarch64)-linux$'
```

Finally, check whether the new CLI needs a newer StartOS than the package itself does — **the two floors are independent.** `start-cli` 1.1.0 replaced cookie auth with per-device signing keys, so its `auth login` only works against a StartOS that speaks signature auth, which first shipped in `start-os/v0.4.0`. The package's own floor is the manifest `osVersion`, which start-sdk 2.0 sets to `0.4.0-beta.10` — a version that was never released, since the beta line ends at `beta.9`. So every host that can install this package already clears the CLI's floor, but that is a coincidence of the two numbers, not a rule. Re-derive the relationship on the next CLI bump rather than assuming the SDK's floor covers it; a new server-side requirement is called out in the `start-cli/v*` release notes.
