"""Load and validate the simulation field configuration."""

import json

from ..config import PROJECT_ROOT


def get_field_config() -> dict:
    """Return field.json, raising ValueError when it is missing or invalid."""
    config_path = PROJECT_ROOT / "field.json"
    try:
        with config_path.open(encoding="utf-8") as config_file:
            config = json.load(config_file)
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError("Field configuration is unavailable or invalid.") from error

    field = config.get("field")
    if not isinstance(field, dict):
        raise ValueError("Field configuration must include a field object.")
    if not isinstance(field.get("rows"), int) or not isinstance(field.get("columns"), int):
        raise ValueError("Field rows and columns must be integers.")
    if field["rows"] <= 0 or field["columns"] <= 0:
        raise ValueError("Field rows and columns must be greater than zero.")

    return config
