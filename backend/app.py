from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import collections

app = Flask(__name__)
# Enable CORS for requests from any origin
CORS(app)

UPLOAD_FOLDER = "/data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    # Sanitize filename to prevent directory traversal attacks
    filename = os.path.basename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return jsonify({"message": f"File '{filename}' uploaded successfully"}), 201

@app.route("/files", methods=["GET"])
def list_files():
    try:
        query = request.args.get("name", "")
        files_in_dir = os.listdir(UPLOAD_FOLDER)
        
        if query:
            # Filter files based on the search query
            filtered_files = [f for f in files_in_dir if query.lower() in f.lower()]
            return jsonify({"files": filtered_files})
        else:
            # Return all files if no query
            return jsonify({"files": files_in_dir})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download/<path:filename>", methods=["GET"])
def download_file(filename):
    # Ensure the filename is safe
    safe_filename = os.path.basename(filename)
    if not os.path.isfile(os.path.join(UPLOAD_FOLDER, safe_filename)):
        return jsonify({"error": "File not found"}), 404
    return send_from_directory(UPLOAD_FOLDER, safe_filename, as_attachment=True)

@app.route("/analysis", methods=["GET"])
def analysis():
    try:
        files = os.listdir(UPLOAD_FOLDER)
        total_size = sum(os.path.getsize(os.path.join(UPLOAD_FOLDER, f)) for f in files)
        
        # Calculate file type distribution
        file_extensions = [os.path.splitext(f)[1].lower() or '.other' for f in files]
        file_type_counts = collections.Counter(file_extensions)
        
        return jsonify({
            "total_files": len(files), 
            "total_size_bytes": total_size,
            "file_types": dict(file_type_counts)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
