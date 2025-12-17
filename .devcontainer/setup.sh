#!/bin/bash
set -e

echo "🚀 Setting up SMAS Debate with GitHub Models API..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get install -y build-essential curl git

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install --upgrade pip

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    # Default dependencies for GitHub Models API
    pip install flask==3.0.0 flask-cors==4.0.0 requests==2.31.0 python-dotenv==1.0.0
fi

# Install Node.js dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Create templates directory if it doesn't exist
mkdir -p templates

# Make the automation script executable
if [ -f ".devcontainer/run-app.sh" ]; then
    chmod +x .devcontainer/run-app.sh
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 GitHub Models API is ready to use!"
echo "   - No API keys required in Codespaces"
echo "   - GITHUB_TOKEN is automatically configured"
echo ""
echo "🚀 To start the SMAS Debate app, run:"
echo "   bash .devcontainer/run-app.sh"
echo ""