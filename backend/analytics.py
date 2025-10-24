import os
from flask import jsonify

def get_storage_stats(upload_root):
    total_files = 0
    total_size = 0
    per_folder = {}
    for root, _, files in os.walk(upload_root):
        folder = os.path.relpath(root, upload_root)
        count = 0
        for f in files:
            count += 1
            total_files += 1
            total_size += os.path.getsize(os.path.join(root, f))
        per_folder[folder] = count
    return jsonify({
        'total_files': total_files,
        'total_size_bytes': total_size,
        'total_size_kb': round(total_size / 1024, 2),
        'files_per_folder': per_folder
    })
