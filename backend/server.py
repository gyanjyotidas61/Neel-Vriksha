"""HTTP server for the static dashboard and its small JSON API."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from urllib.parse import urlsplit

from .config import HOST, PORT, PROJECT_ROOT
from .services.field_service import get_field_config


class TeaGardenHandler(SimpleHTTPRequestHandler):
    """Serve project files and read-only API endpoints on the same origin."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def do_GET(self):
        path = urlsplit(self.path).path.rstrip("/") or "/"
        if path == "/api/health":
            self._send_json(200, {"status": "ok", "service": "smart-tea-garden"})
        elif path in ("/api/field", "/api/config"):
            try:
                self._send_json(200, get_field_config())
            except ValueError as error:
                self._send_json(500, {"error": str(error)})
        else:
            super().do_GET()

    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def main():
    server = ThreadingHTTPServer((HOST, PORT), TeaGardenHandler)
    print(f"Smart Tea Garden server running at http://{HOST}:{PORT}")
    print("API: GET /api/health and GET /api/field")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()
