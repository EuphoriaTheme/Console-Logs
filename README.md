# Console Logs (Blueprint Addon)
Adds a one-click "Copy console log" button to the Pterodactyl server terminal when using the Blueprint Framework.

## What This Addon Does
- Injects a copy icon into the server terminal command row.
- Buffers recent terminal output and copies it to your clipboard on click.
- Strips ANSI color codes so pasted logs are clean.

## Compatibility
- Blueprint Framework on Pterodactyl Panel
- Target: `beta-2026-01` (see `conf.yml`)

## Installation / Development Guides
Follow the official Blueprint guides for installing addons and developing components:
`https://blueprint.zip/guides`

Uninstall (as shown in the admin view):
`blueprint -remove consolelogs`

## How It Works (Repo Layout)
- `conf.yml`: Blueprint addon manifest (metadata, target version, entrypoints).
- `components/Components.yml`: Blueprint slot map that injects `copyConsole` into `Server -> Terminal -> CommandRow`.
- `components/copyConsole.tsx`: React component that listens for `CONSOLE_OUTPUT` and exposes the copy action.
- `client/wrapper.blade.php`: Loads Font Awesome for the copy icon in the dashboard.
- `admin/view.blade.php`: Admin page snippet shown in Blueprint's admin UI.

## Customization (Theme/UX)
You can customize the look/behavior to match your theme:
- Icon styling and tooltip text: `components/copyConsole.tsx`
- Max buffered lines (memory vs. copy length): `MAX_BUFFERED_LINES` in `components/copyConsole.tsx`

## Contributing
This repo is shared so the community can help improve and extend the addon, not because it's abandoned.
Where it helps, the code includes comments explaining non-obvious behavior; keep comments high-signal.

### Pull Request Requirements
- Clearly state what was added/updated and why.
- Include images or a short video of the change working/in action (especially for UI changes).
- Keep changes focused and avoid unrelated formatting-only churn.
- Keep credits/attribution intact (see `LICENSE`).

### Helpful Contribution Ideas
- Improve styling to better fit different themes.
- Add small UX improvements (tooltip placement, accessibility, etc.).
- Performance improvements (without changing behavior).

## License
Source-available. Redistribution and resale (original or modified) are not permitted, and original credits must be kept within the addon.
See `LICENSE` for the full terms.
