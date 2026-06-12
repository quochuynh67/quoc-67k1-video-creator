#!/usr/bin/env bash
# deploy.sh — Build & deploy WVC Editor client to Vercel
#
# Usage:
#   ./deploy.sh              # type-check + build + deploy preview
#   ./deploy.sh --prod       # type-check + build + deploy production
#   ./deploy.sh --skip-build # deploy current dist/ without rebuilding
#   ./deploy.sh --dev        # start local dev server (client + server)
#   ./deploy.sh --help       # show this help
#
# Requirements: node >= 18, npm, vercel CLI (npm i -g vercel)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
CLIENT="$ROOT/client"
SERVER="$ROOT/server"

PROD=0
SKIP_BUILD=0
DEV=0

# ── Parse flags ────────────────────────────────────────────────────────────────
for arg in "$@"; do
  case "$arg" in
    --prod)       PROD=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    --dev)        DEV=1 ;;
    --help|-h)
      sed -n '/^# Usage/,/^$/p' "$0"
      exit 0
      ;;
    *) echo "Unknown flag: $arg  (try --help)" && exit 1 ;;
  esac
done

# ── Colours ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✗${NC} $*" >&2; exit 1; }
step() { echo -e "\n${YELLOW}▶${NC} $*"; }

# ── Guard: vercel CLI ──────────────────────────────────────────────────────────
if ! command -v vercel &>/dev/null; then
  fail "Vercel CLI not found. Install with: npm i -g vercel"
fi

# ── Dev mode (starts both client + server) ────────────────────────────────────
if [[ $DEV -eq 1 ]]; then
  step "Starting dev servers (Ctrl+C to stop)"
  cd "$ROOT"
  npm run dev
  exit 0
fi

# ── Install deps if node_modules missing ─────────────────────────────────────
if [[ ! -d "$CLIENT/node_modules" ]]; then
  step "Installing client dependencies"
  cd "$CLIENT" && npm install
  ok "Client deps installed"
fi

# ── Build ─────────────────────────────────────────────────────────────────────
if [[ $SKIP_BUILD -eq 0 ]]; then
  step "Type-checking (tsc --noEmit)"
  cd "$CLIENT"
  npx tsc --noEmit && ok "TypeScript: no errors"

  step "Building client (vite build)"
  npm run build
  ok "Build complete → client/dist/"
else
  warn "Skipping build (--skip-build)"
  [[ -d "$CLIENT/dist" ]] || fail "client/dist/ does not exist — run without --skip-build first"
fi

# ── Deploy ────────────────────────────────────────────────────────────────────
step "Deploying to Vercel${PROD:+ (PRODUCTION)}"
cd "$ROOT"

if [[ $PROD -eq 1 ]]; then
  vercel deploy --prod
else
  vercel deploy
fi

ok "Done!"
