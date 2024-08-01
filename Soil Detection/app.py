from flask import Flask, render_template, request, jsonify
import requests
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

# Simulated sensor data
sensor_data = {
    'temperature': None,
    'humidity': None,
    'nutrients': None,
    'yield': None,
    'time': None
}

# OpenAI API Key
OPENAI_API_KEY = 'your_openai_api_key'

def get_plant_suggestion(data):
    if None in data.values():
        return "No information available"
    prompt = f"Given the following soil conditions: Temperature: {data['temperature']}, Humidity: {data['humidity']}, Nutrients: {data['nutrients']}, Yield: {data['yield']}, suggest the best plant to grow."
    response = requests.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        headers={'Authorization': f'Bearer {OPENAI_API_KEY}'},
        json={'prompt': prompt, 'max_tokens': 50}
    )
    return response.json()['choices'][0]['text'].strip()

def get_farmer_help(query):
    prompt = f"Help the farmer with the following query: {query}"
    response = requests.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        headers={'Authorization': f'Bearer {OPENAI_API_KEY}'},
        json={'prompt': prompt, 'max_tokens': 150}
    )
    return response.json()['choices'][0]['text'].strip()

def run_disease_detection(image_path):
    # Import your disease detection function from the script
    from disease_detection import predict_disease # type: ignore
    return predict_disease(image_path)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard')
def dashboard():
    return render_template('index.html', data=sensor_data)

@app.route('/help')
def help():
    return render_template('help.html')

@app.route('/disease-detection')
def disease_detection():
    return render_template('disease_detection.html')

@app.route('/api/data')
def api_data():
    return jsonify(sensor_data)

@app.route('/api/suggestion')
def api_suggestion():
    suggestion = get_plant_suggestion(sensor_data)
    return jsonify({'suggestion': suggestion})

@app.route('/api/help', methods=['POST'])
def api_help():
    query = request.json.get('query')
    response = get_farmer_help(query)
    return jsonify({'response': response})

@app.route('/api/disease-detection', methods=['POST'])
def api_disease_detection():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        result = run_disease_detection(filepath)
        return jsonify({'result': result})

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)

    
