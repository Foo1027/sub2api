#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required but not found."
  exit 1
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

mkdir -p data postgres_data redis_data

replace_if_empty() {
  local key="$1"
  local value="$2"
  perl -0pi -e "s/^${key}=\\s*\$/$(printf '%s' "${key}=${value}" | sed 's/[\\/&]/\\&/g')/m" .env
}

generated_admin_password=""

replace_if_empty "JWT_SECRET" "$(openssl rand -hex 32)"
replace_if_empty "TOTP_ENCRYPTION_KEY" "$(openssl rand -hex 32)"
replace_if_empty "POSTGRES_PASSWORD" "$(openssl rand -hex 24)"
replace_if_empty "REDIS_PASSWORD" "$(openssl rand -hex 24)"

if grep -Eq '^ADMIN_PASSWORD=\s*$' .env; then
  generated_admin_password="$(openssl rand -base64 18 | tr -d '\n' | tr '/+' '_-')"
  replace_if_empty "ADMIN_PASSWORD" "$generated_admin_password"
fi

echo "Prepared .env and data directories."
echo "Edit .env if you want to change the bind host, port, or admin email."

if [[ -n "$generated_admin_password" ]]; then
  echo "Generated admin password: $generated_admin_password"
fi
