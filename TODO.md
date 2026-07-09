# TODO

- **Revert the `ui` interface path to `''` once upstream fixes dashboard auto-SSO.**
  `_auto_sso_response` (`hermes_cli/dashboard_auth/middleware.py`) redirects an
  unauthenticated document load to `/auth/login?provider=<name>` whenever exactly one
  session provider is registered. It selects on `supports_session`, never checking that
  the provider has an OAuth redirect flow, so with `basic_auth` as the sole provider it
  routes into `BasicAuthProvider.start_login()`, which raises `NotImplementedError` — a
  500 on `/`, recovering only on reload via the gate's one-shot loop guard. We work
  around it by pointing the interface at `/login` (`startos/interfaces.ts`). Reported
  upstream; drop the workaround when a released image excludes password-only providers
  from auto-SSO.
