# Backend

This starter backend uses Python's standard library, so it adds no third-party
dependencies. It serves the existing dashboard and exposes read-only JSON API
endpoints from the same origin.

## Run

From the project root:

```powershell
python -m backend
```

Set `TEA_GARDEN_HOST` or `TEA_GARDEN_PORT` to override the defaults. The server
binds to `127.0.0.1:8000` by default.

## API

- `GET /api/health` — server health
- `GET /api/field` — validated contents of the root `field.json`
- `GET /api/config` — alias for `/api/field`

All other GET requests serve existing project files. The API is read-only; the
browser simulation continues to run in JavaScript.
