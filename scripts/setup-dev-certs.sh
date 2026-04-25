#!/usr/bin/env bash
# Generate self-signed certificates for local HTTPS development.
# Run once; certs are gitignored and persist in .certs/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CERT_DIR="$ROOT_DIR/.certs"

if [ -f "$CERT_DIR/cert.pem" ] && [ -f "$CERT_DIR/key.pem" ]; then
  echo "Certificates already exist in .certs/"
  echo "  CA:   .certs/ca.pem"
  echo "  Cert: .certs/cert.pem"
  echo "  Key:  .certs/key.pem"
  echo "Delete .certs/ and re-run to regenerate."
  exit 0
fi

echo "Building liquidjs-cert tool..."
cd "$ROOT_DIR/tools/liquidjs-cert"
go build -o liquidjs-cert .

echo "Generating certificates..."
./liquidjs-cert -out "$CERT_DIR" -cn localhost -sans "localhost,127.0.0.1,::1" -days 365

echo ""
echo "Done. Certificates are in .certs/"
echo "To start dev server with HTTPS:"
echo "  cd site && npm run dev"
