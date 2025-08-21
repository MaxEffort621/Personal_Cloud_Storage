import os
import shutil
from flask import jsonify
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = None  # set to list like {'png','jpg','pdf'} to restrict

def allowed_file(filename):
    if ALLOWED_EXTENSIONS is None:
        return True
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_file_upload(request, upload_root):
    """
    Expects multipart/form-data with:
      - file: the uploaded file
      - folder (optional): folder name to save into (single level)
    Saves file into upload_root[/folder]/filename
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    folder = (request.form.get('folder') or '').strip()
    folder_secure = secure_filename(folder) if folder else ''
    target_dir = os.path.join(upload_root, folder_secure) if folder_secure else upload_root
    os.makedirs(target_dir, exist_ok=True)

    filename = secure_filename(file.filename)
    save_path = os.path.join(target_dir, filename)
    file.save(save_path)
    return jsonify({'message': 'File uploaded', 'path': os.path.relpath(save_path, upload_root)}), 200

def list_files_in_folder(upload_root, folder=''):
    """
    Returns a list of file paths relative to upload_root.
    If folder provided, lists that folder's files.
    """
    if folder:
        folder_secure = secure_filename(folder)
        search_path = os.path.join(upload_root, folder_secure)
        if not os.path.exists(search_path):
            return []
        entries = os.listdir(search_path)
        return [os.path.join(folder_secure, e) for e in entries if os.path.isfile(os.path.join(search_path, e))]
    else:
        # list files in root and also return folder/file for nested files
        results = []
        for root, _, files in os.walk(upload_root):
            for f in files:
                rel = os.path.relpath(os.path.join(root, f), upload_root)
                results.append(rel)
        return results

def create_folder(folder_name, upload_root):
    if not folder_name:
        return jsonify({'error': 'Folder name required'}), 400
    folder_secure = secure_filename(folder_name)
    path = os.path.join(upload_root, folder_secure)
    try:
        os.makedirs(path, exist_ok=True)
        return jsonify({'message': f'Folder {folder_secure} created'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def move_file(filename, target_folder, upload_root):
    if not filename or not target_folder:
        return jsonify({'error': 'filename and target_folder required'}), 400

    src = os.path.join(upload_root, filename)
    if not os.path.exists(src):
        return jsonify({'error': 'Source file not found'}), 404

    dst_dir = os.path.join(upload_root, secure_filename(target_folder))
    os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, os.path.basename(filename))
    try:
        shutil.move(src, dst)
        return jsonify({'message': 'File moved', 'new_path': os.path.relpath(dst, upload_root)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
