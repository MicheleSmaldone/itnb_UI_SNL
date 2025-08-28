#!/bin/bash

# Git Repository Mirroring Script
# This script mirrors changes from Git Kvant to GitHub

echo "🔄 Starting repository mirroring from Git Kvant to GitHub..."

# Ensure we're in the correct directory
cd "$(dirname "$0")/.." || exit 1

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: Not on main branch. Current branch: $CURRENT_BRANCH"
    echo "   Continuing anyway..."
fi

# Fetch latest changes from Git Kvant
echo "📥 Fetching latest changes from Git Kvant (origin)..."
git fetch origin

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push github main; then
    echo "✅ Successfully mirrored to GitHub!"
    echo "🔗 GitHub repository: https://github.com/MicheleSmaldone/itnb_ui_snl"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo "🎉 Mirroring completed successfully!"
