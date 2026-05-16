# Quiz App

Serverless quiz application using Netlify Functions and static HTML pages.

## Cursor Cloud specific instructions

### Services

| Service | Command | Port |
|---------|---------|------|
| Netlify Dev Server (serves static files + functions) | `npx netlify dev` | 8888 |

### Key commands

- **Dev server:** `npx netlify dev` (serves HTML pages and Netlify Functions locally)
- **Lint:** `npm run lint` (runs ESLint on `netlify/functions/*.js`)
- **Test:** `npm test` (runs Jest tests in `__tests__/`)
- **Build:** `npm run build` (static site, no build step needed)

### Architecture notes

- No database: functions use in-memory storage (data resets on each server restart).
- Netlify Functions are in `netlify/functions/` and exposed at `/.netlify/functions/<name>`.
- The `netlify.toml` `[[redirects]]` block maps `/api/*` to `/.netlify/functions/:splat` for convenience.
- All HTML pages fetch functions via `/.netlify/functions/` URLs. The Netlify dev server handles both static serving and function proxying on port 8888.

### Gotchas

- `npx netlify dev` will log a harmless "Unable to open browser automatically: Running inside a docker container" error in headless/container environments; the server still works fine on the printed port.
- The Netlify CLI may take a moment to set up Edge Functions on first run; wait for the "Server now ready" message before making requests.
