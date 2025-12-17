# 🎭 SMAS Debate - Smart Multi-Agent System

AI-Powered Debate System using GitHub Models API - watch AI agents debate any topic with intelligent Pro and Con arguments!

## 🚀 Quick Start in GitHub Codespaces

**No API keys needed!** GitHub Codespaces automatically provides the `GITHUB_TOKEN` for GitHub Models API.

1. **Open in Codespaces**
   - Click the green "Code" button on this repository
   - Select "Codespaces" tab
   - Click "Create codespace on main" (or your branch)

2. **Wait for Setup** (automatic)
   - Dev container builds and configures Python environment
   - Dependencies install automatically via `setup.sh`
   - This takes about 2-3 minutes

3. **Start the Application**
   ```bash
   bash .devcontainer/run-app.sh
   ```

4. **Access the Web UI**
   - Click the pop-up notification for port 8080, or
   - Go to the "PORTS" tab in VS Code
   - Click the globe icon next to port 8080
   - Your debate app opens in a new browser tab!

## ✨ Key Features

- 🤖 **Multi-Agent AI Debates** - Pro and Con agents debate any topic
- 🔌 **GitHub Models API** - Access GPT-4o, Llama 3.1, Mistral and more
- 🔑 **Zero Configuration** - No API keys required in Codespaces
- 🎨 **Beautiful Web UI** - Modern, responsive interface with real-time results
- ⚡ **Fast & Free** - Leverage GitHub's AI infrastructure

## 🔑 No API Keys Required

When running in **GitHub Codespaces**, the `GITHUB_TOKEN` is automatically configured for you! This token provides:
- ✅ Free access to GitHub Models API
- ✅ No manual setup or configuration
- ✅ Secure token management
- ✅ Rate limits appropriate for development

**Learn more:** [GitHub Models Marketplace](https://github.com/marketplace/models)

## 📦 Manual Setup (Local Development)

If you want to run this locally outside Codespaces:

### Prerequisites
- Python 3.11+
- GitHub Personal Access Token with Models API access

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/doditz/SMAS-debate.git
   cd SMAS-debate
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure GitHub Token**
   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```
   
   Get your token from: https://github.com/settings/tokens

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the app**
   - Open browser to: http://localhost:8080

## 🌐 Usage

### Web UI
1. **Enter a debate topic** (e.g., "Artificial Intelligence will benefit humanity")
2. **Select an AI model** from the dropdown
3. **Choose number of rounds** (1-5)
4. **Click "Start Debate"** and watch the agents argue!

### API Endpoints

#### Health Check
```bash
GET /api/health
```
Returns system status and token configuration.

#### Start Debate
```bash
POST /api/debate
Content-Type: application/json

{
  "topic": "Artificial Intelligence will benefit humanity",
  "model": "gpt-4o-mini",
  "rounds": 3
}
```

Returns debate results with Pro and Con arguments for each round.

#### List Models
```bash
GET /api/models
```
Returns available GitHub Models.

## 🤖 Available Models

| Model | ID | Description |
|-------|-----|-------------|
| **GPT-4o Mini** | `gpt-4o-mini` | Fast and efficient (Recommended) |
| **GPT-4o** | `gpt-4o` | Most capable OpenAI model |
| **Llama 3.1 405B** | `meta-llama-3.1-405b-instruct` | Meta's largest model |
| **Mistral Large** | `mistral-large` | Mistral flagship model |

Explore more models at: https://github.com/marketplace/models

## 🛠️ Tech Stack

- **Backend:** Flask (Python)
- **AI API:** GitHub Models API
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Infrastructure:** Dev Containers, GitHub Codespaces
- **Dependencies:** Flask-CORS, Requests, Python-Dotenv

## 📍 Access Points

| Service | Port | URL (Codespaces) |
|---------|------|------------------|
| Web UI | 8080 | Check PORTS tab |
| API | 8080 | `/api/*` endpoints |

## 🎯 Example Debate Topics

Try these interesting topics:

- "Artificial Intelligence will benefit humanity"
- "Remote work is more productive than office work"
- "Social media has a net positive impact on society"
- "Space exploration should be a priority"
- "Universal basic income is necessary"
- "Nuclear energy is the best solution for climate change"

## 🐛 Troubleshooting

### "GITHUB_TOKEN not configured" error
- **In Codespaces:** This shouldn't happen - token is automatic. Try restarting the codespace.
- **Local development:** Make sure you've set the environment variable:
  ```bash
  export GITHUB_TOKEN=your_token
  ```

### Port not forwarding in Codespaces
- Check the "PORTS" tab in VS Code terminal panel
- Ensure port 8080 is listed and has "Visibility: Public"
- Try clicking the "Forward a Port" button and add 8080 manually

### API timeout errors
- GitHub Models API may be rate-limited
- Try using a different model
- Wait a few minutes and try again

### Dependencies not installing
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Cannot access the web UI
- Make sure the app is running: `bash .devcontainer/run-app.sh`
- Check logs for any errors
- Verify port 8080 is forwarded (see PORTS tab)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available for educational purposes.

## 🔗 Links

- [GitHub Models Marketplace](https://github.com/marketplace/models)
- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

**Built with ❤️ using GitHub Models API**
