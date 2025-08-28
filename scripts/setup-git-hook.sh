#!/bin/bash

# Setup Git Hook for Automatic Mirroring
# This script sets up a post-commit hook that automatically mirrors to GitHub

echo "⚙️  Setting up Git hook for automatic mirroring..."

# Create the hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create the post-commit hook
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash

# Auto-mirror to GitHub after each commit
echo "🔄 Auto-mirroring to GitHub..."

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    # Push to GitHub
    if git push github main 2>/dev/null; then
        echo "✅ Successfully auto-mirrored to GitHub!"
    else
        echo "⚠️  Failed to auto-mirror to GitHub (you may need to push manually)"
    fi
else
    echo "ℹ️  Not on main branch, skipping auto-mirror"
fi
EOF

# Make the hook executable
chmod +x .git/hooks/post-commit

echo "✅ Git hook setup completed!"
echo "   Now every commit to main branch will automatically mirror to GitHub"
echo "   To disable: rm .git/hooks/post-commit"
