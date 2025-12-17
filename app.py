"""SMAS Debate - Multi-Agent AI Debate System using GitHub Models API"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# GitHub Models API Configuration
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
API_BASE = "https://models.inference.ai.azure.com/chat/completions"
DEFAULT_MODEL = os.getenv('DEFAULT_MODEL', 'gpt-4o-mini')
MAX_ROUNDS = int(os.getenv('MAX_DEBATE_ROUNDS', 5))

@app.route('/')
def index():
    """Render the main application page"""
    return render_template('index.html')

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'api_configured': bool(GITHUB_TOKEN),
        'model': DEFAULT_MODEL,
        'api_endpoint': API_BASE
    })

@app.route('/api/debate', methods=['POST'])
def debate():
    """Run a debate between AI agents using GitHub Models"""
    data = request.json
    topic = data.get('topic', '')
    rounds = min(data.get('rounds', 3), MAX_ROUNDS)
    model = data.get('model', DEFAULT_MODEL)
    
    if not GITHUB_TOKEN:
        return jsonify({'error': 'GITHUB_TOKEN not configured. This should be automatic in Codespaces.'}), 500
    
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400
    
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json"
    }
    
    debate_history = []
    
    try:
        for round_num in range(rounds):
            # Pro agent argument
            pro_payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": f"You are Agent Pro. Your role is to argue in favor of: '{topic}'. Be concise, logical, and persuasive. Use facts and reasoning. Keep your response under 150 words."},
                    {"role": "user", "content": f"Present your argument for round {round_num + 1}."}
                ],
                "temperature": 0.7,
                "max_tokens": 300
            }
            
            pro_response = requests.post(API_BASE, headers=headers, json=pro_payload, timeout=30)
            
            if pro_response.status_code != 200:
                return jsonify({'error': f'GitHub Models API error: {pro_response.text}'}), 500
            
            pro_text = pro_response.json()['choices'][0]['message']['content']
            
            # Con agent response
            con_payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": f"You are Agent Con. Your role is to argue against: '{topic}'. Be concise, logical, and persuasive. Use facts and reasoning. Keep your response under 150 words."},
                    {"role": "user", "content": f"Respond to this argument: {pro_text}"}
                ],
                "temperature": 0.7,
                "max_tokens": 300
            }
            
            con_response = requests.post(API_BASE, headers=headers, json=con_payload, timeout=30)
            
            if con_response.status_code != 200:
                return jsonify({'error': f'GitHub Models API error: {con_response.text}'}), 500
            
            con_text = con_response.json()['choices'][0]['message']['content']
            
            debate_history.append({
                'round': round_num + 1,
                'pro': pro_text,
                'con': con_text
            })
        
        return jsonify({
            'topic': topic,
            'model': model,
            'rounds': debate_history
        })
    
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout. Please try again.'}), 500
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500

@app.route('/api/models')
def list_models():
    """List available GitHub models"""
    models = [
        {'id': 'gpt-4o', 'name': 'GPT-4o', 'description': 'Most capable OpenAI model'},
        {'id': 'gpt-4o-mini', 'name': 'GPT-4o Mini', 'description': 'Fast and efficient'},
        {'id': 'meta-llama-3.1-405b-instruct', 'name': 'Llama 3.1 405B', 'description': 'Meta largest model'},
        {'id': 'mistral-large', 'name': 'Mistral Large', 'description': 'Mistral flagship model'}
    ]
    return jsonify({'models': models})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    print(f"\n🎭 SMAS Debate System Starting...")
    print(f"📍 Server: http://0.0.0.0:{port}")
    print(f"🤖 Model: {DEFAULT_MODEL}")
    print(f"🔑 GitHub Token: {'✅ Configured' if GITHUB_TOKEN else '❌ Not Found'}\n")
    app.run(host='0.0.0.0', port=port, debug=True)