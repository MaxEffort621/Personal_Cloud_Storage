from flask import Flask, request, jsonify, send_from_directory, render_template
from werkzeug.utils import secure_filename
import os
from file_handler import handle_file_upload, create_folder, move_file
from search_filter import search_files
from analytics import get_storage_stats

app = Flask(__name__,
            template_folder="../frontend/templates",
            static_folder="../frontend/static")

UPLOAD_FOLDER = '/app/uploads'  # volume mount location
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    files = []
    for root, dirs, filenames in os.walk(app.config['UPLOAD_FOLDER']):
        for f in filenames:
            rel_dir = os.path.relpath(root, app.config['UPLOAD_FOLDER'])
            rel_file = os.path.join(rel_dir, f) if rel_dir != '.' else f
            files.append(rel_file)
    return render_template('index.html', files=files)

@app.route('/upload', methods=['POST'])
def upload_file():
    return handle_file_upload(request, app.config['UPLOAD_FOLDER'])

@app.route('/create-folder', methods=['POST'])
def create_new_folder():
    data = request.get_json()
    folder_name = data.get('folder_name')
    return create_folder(folder_name, app.config['UPLOAD_FOLDER'])

@app.route('/move-file', methods=['POST'])
def move_file_to_folder():
    data = request.get_json()
    filename = data.get('filename')
    target_folder = data.get('target_folder')
    return move_file(filename, target_folder, app.config['UPLOAD_FOLDER'])

@app.route('/files', methods=['GET'])
def list_files():
    files = []
    for root, dirs, filenames in os.walk(app.config['UPLOAD_FOLDER']):
        for f in filenames:
            rel_dir = os.path.relpath(root, app.config['UPLOAD_FOLDER'])
            rel_file = os.path.join(rel_dir, f) if rel_dir != '.' else f
            files.append(rel_file)
    return jsonify({'files': files})

@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    return search_files(query, app.config['UPLOAD_FOLDER'])

@app.route('/analytics', methods=['GET'])
def analytics():
    return get_storage_stats(app.config['UPLOAD_FOLDER'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
