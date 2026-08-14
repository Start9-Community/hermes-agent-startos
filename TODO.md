# TODO

- **Remove the daemon-level `tini -s` wrapper only if StartOS launch-init gains
  equivalent descendant reaping.** Hermes goal continuations and terminal tools
  can orphan descendants after their immediate session process exits. The
  package wraps both long-lived Hermes daemons so those children are adopted,
  the daemon's own process group receives stop signals, and every adopted child
  is reaped on exit instead of accumulating as a zombie. A descendant which
  created a separate session is not implied to receive the daemon-group signal.

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
