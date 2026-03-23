#!/bin/bash
# Publish guideflow-app.html to GitHub Pages
# Usage: ./publish.sh  (or: bash publish.sh)
#
# What this does:
# 1. Copies guideflow-app.html to the guideflow-html repo
# 2. Commits and pushes it
# 3. Your live site updates in ~30 seconds
#
# Live URL: https://bilalmirza96.github.io/guideflow-html/

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$SCRIPT_DIR/guideflow-app.html"
PAGES_REPO="/tmp/guideflow-html"

# Clone if not already there
if [ ! -d "$PAGES_REPO/.git" ]; then
  echo "Cloning guideflow-html repo..."
  rm -rf "$PAGES_REPO"
  git clone https://github.com/bilalmirza96/guideflow-html.git "$PAGES_REPO"
fi

# Pull latest
cd "$PAGES_REPO"
git pull origin main --quiet

# Copy and push
cp "$SOURCE" "$PAGES_REPO/index.html"

if git diff --quiet index.html; then
  echo "No changes to publish — already up to date."
  exit 0
fi

git add index.html
git commit -m "update: sync prototype $(date +%Y-%m-%d_%H:%M)"
git push origin main --quiet

echo ""
echo "Published! Live at: https://bilalmirza96.github.io/guideflow-html/"
echo "(May take 30-60 seconds to update)"
