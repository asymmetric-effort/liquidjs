# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in SpecifyJS, please report it responsibly.

**Do NOT open a public issue for security vulnerabilities.**

Instead, please email: **security@asymmetric-effort.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgement**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix release**: As soon as a patch is ready, typically within 14 days

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.2.x   | ✅ Current |
| < 0.2   | ❌ No      |

## Security Practices

- **Zero runtime dependencies** — eliminates supply chain attack surface
- **SHA-pinned CI/CD** — all GitHub Actions pinned to verified commit hashes
- **HTTPS-only** — `secureFetch` rejects plaintext HTTP connections
- **Automatic HTML escaping** — prevents XSS in rendered output
- **CSP headers** — Content-Security-Policy set via `useHead`
- **CodeQL analysis** — static security scanning on every push
- **Dependabot** — automated dependency update monitoring
- **No server-side code execution** — browser-only framework
