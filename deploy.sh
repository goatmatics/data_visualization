#!/bin/bash

# DataDriven Nepal - Deployment Script
# This script copies files from the private backend repository to the public deployment repository

echo "🚀 DataDriven Nepal - Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "polls-config.md" ]; then
    echo "❌ Error: polls-config.md not found. Please run this script from the backend repository root."
    exit 1
fi

# Generate HTML from markdown
echo "📝 Generating HTML from polls-config.md..."
python3 update-polls.py

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to generate HTML from markdown"
    exit 1
fi

echo "✅ HTML generated successfully"

# Check if public repository directory exists
PUBLIC_REPO_DIR="../DataDrivenNepal-Website"
if [ ! -d "$PUBLIC_REPO_DIR" ]; then
    echo "📁 Creating public repository directory..."
    mkdir -p "$PUBLIC_REPO_DIR"
    cd "$PUBLIC_REPO_DIR"
    git init
    git remote add origin https://github.com/goatmatics/DataDrivenNepal.git
    git branch -m main
    cd ..
fi

echo "📋 Copying files to public repository..."

# Copy essential files for the website
cp hamroawaz.html "$PUBLIC_REPO_DIR/"
cp js/hamroawaz.js "$PUBLIC_REPO_DIR/js/"
cp css/hamroawaz.css "$PUBLIC_REPO_DIR/css/"
cp config.js "$PUBLIC_REPO_DIR/"
cp translations.js "$PUBLIC_REPO_DIR/"
cp -r assets "$PUBLIC_REPO_DIR/"
cp index.html "$PUBLIC_REPO_DIR/" 2>/dev/null || echo "⚠️  index.html not found, skipping..."

echo "✅ Files copied successfully"

# Commit and push to public repository
cd "$PUBLIC_REPO_DIR"
echo "📤 Committing and pushing to public repository..."

git add .
git commit -m "Deploy website updates from backend repository

- Updated polls from polls-config.md
- Generated HTML with latest poll configuration
- Deployed at: $(date '+%Y-%m-%d %H:%M:%S')"

git push origin main

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "🌐 Website: https://goatmatics.github.io/DataDrivenNepal/"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

cd ..
echo "✨ Deployment complete!"
