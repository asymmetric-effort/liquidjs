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

mkdir -p "$CERT_DIR"

echo "Generating certificates with openssl..."
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"

# Copy cert as CA for convenience
cp "$CERT_DIR/cert.pem" "$CERT_DIR/ca.pem"

echo ""
echo "Done. Certificates are in .certs/"
echo "To start dev server with HTTPS:"
echo "  cd site && npm run dev"
