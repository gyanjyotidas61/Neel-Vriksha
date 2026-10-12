"""Backend settings."""

from pathlib import Path
import os


PROJECT_ROOT = Path(__file__).resolve().parent.parent
HOST = os.environ.get("TEA_GARDEN_HOST", "127.0.0.1")
PORT = int(os.environ.get("TEA_GARDEN_PORT", "8000"))
