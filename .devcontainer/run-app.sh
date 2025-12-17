#!/bin/bash
set -e

echo "🎭 Starting SMAS Debate with GitHub Models API..."
echo "================================================"

# Check for GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  Warning: GITHUB_TOKEN not found!"
    echo "   This should be automatically set in Codespaces."
    echo "   Outside Codespaces, set it manually: export GITHUB_TOKEN=your_token"
else
    echo "✅ GitHub token configured"
fi

PORT=${PORT:-8080}

echo ""
echo "🌐 Starting Flask server on port $PORT..."
echo ""
echo "📍 Your app will be available at:"
echo "   Local: http://localhost:$PORT"
echo "   Codespace: Check the PORTS tab for the forwarded URL"
echo ""
echo "🤖 Available GitHub Models:"
echo "   - gpt-4o"
echo "   - gpt-4o-mini"
echo "   - meta-llama-3.1-405b-instruct"
echo "   - mistral-large"
echo "   - and many more at https://github.com/marketplace/models"
echo ""

# Detect the application type and start accordingly
if [ -f "app.py" ]; then
    echo "🐍 Starting Flask application..."
    export FLASK_APP=app.py
    export FLASK_ENV=development
    python app.py
elif [ -f "main.py" ]; then
    echo "🐍 Starting Python application..."
    python main.py
elif [ -f "package.json" ]; then
    echo "📦 Starting Node.js application..."
    if grep -q "\"dev\"" package.json; then
        npm run dev
    elif grep -q "\"start\"" package.json; then
        npm start
    else
        echo "❌ No start script found in package.json"
        exit 1
    fi
else
    echo "❌ No recognized application entry point found!"
    echo "📝 Please create one of: app.py, main.py, or package.json"
    echo ""
    echo "💡 To create a basic Flask app, run:"
    echo "   echo 'from flask import Flask; app = Flask(__name__); @app.route(\"/\") def home(): return \"Hello!\"; app.run(host=\"0.0.0.0\", port=8080)' > app.py"
    exit 1
fi