import os

def search_files(query, upload_root):
    """
    Returns list of relative file paths that contain `query` (case-insensitive)
    """
    if not query:
        return []
    q = query.lower()
    matches = []
    for root, _, files in os.walk(upload_root):
        for f in files:
            if q in f.lower():
                rel = os.path.relpath(os.path.join(root, f), upload_root)
                matches.append(rel)
    return matches
