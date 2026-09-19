from pathlib import Path


def test_spike_contains_no_database_credentials_contract() -> None:
    root = Path(__file__).resolve().parents[1]
    source = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (root / "genesis_intelligence").glob("*.py")
    )
    forbidden = [
        "DATABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
        "create_client(",
        "psycopg",
        "asyncpg",
    ]
    for token in forbidden:
        assert token not in source, f"Agent runtime must not contain DB credential/access token: {token}"


def test_only_three_read_tools_are_declared_in_spike() -> None:
    source = (
        Path(__file__).resolve().parents[1]
        / "genesis_intelligence"
        / "gds_agent.py"
    ).read_text(encoding="utf-8")
    assert source.count("@gds_agent.tool") == 3
    assert "write_" not in source
