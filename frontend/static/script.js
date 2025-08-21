async function listFiles() {
    const res = await fetch('/files');
    const files = await res.json();
    const ul = document.getElementById('fileList');
    ul.innerHTML = '';
    files.forEach(f => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/download/${encodeURIComponent(f)}`;
        a.textContent = f;
        a.setAttribute('download', '');
        li.appendChild(a);

        // Add move/delete buttons (optional)
        const span = document.createElement('span');
        span.innerHTML = ` &nbsp; <button onclick="movePrompt('${f}')">Move</button> <button onclick="deleteFile('${f}')">Delete</button>`;
        li.appendChild(span);

        ul.appendChild(li);
    });
}

async function uploadFile() {
    const input = document.getElementById('fileInput');
    if (!input.files || input.files.length === 0) { alert('Select a file'); return; }

    const folder = document.getElementById('folderInput').value;
    const fd = new FormData();
    fd.append('file', input.files[0]);
    if (folder && folder.trim().length) fd.append('folder', folder.trim());

    const res = await fetch('/upload', { method: 'POST', body: fd });
    const data = await res.json();
    alert(data.message || data.error);
    listFiles();
    loadAnalytics();
}

async function searchFiles() {
    const q = document.getElementById('searchInput').value;
    if (!q) { listFiles(); return; }
    const res = await fetch(`/search?q=${encodeURIComponent(q)}`);
    const results = await res.json();
    const ul = document.getElementById('fileList');
    ul.innerHTML = '';
    results.forEach(f => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/download/${encodeURIComponent(f)}`;
        a.textContent = f;
        a.setAttribute('download', '');
        li.appendChild(a);
        ul.appendChild(li);
    });
}

async function createFolder(name) {
    const res = await fetch('/create-folder', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ folder_name: name })
    });
    return res.json();
}

async function movePrompt(filename) {
    const target = prompt('Enter target folder name:');
    if (!target) return;
    const res = await fetch('/move-file', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ filename: filename, target_folder: target })
    });
    const data = await res.json();
    alert(data.message || data.error);
    listFiles();
    loadAnalytics();
}

async function deleteFile(relativePath) {
    // simple delete API (not implemented server-side as part of earlier code)
    const confirmed = confirm(`Delete ${relativePath}?`);
    if (!confirmed) return;
    const res = await fetch(`/delete-file`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ filename: relativePath })
    });
    const data = await res.json();
    alert(data.message || data.error);
    listFiles();
    loadAnalytics();
}

async function loadAnalytics(){
    const res = await fetch('/analytics');
    const data = await res.json();
    document.getElementById('analyticsPre').textContent = JSON.stringify(data, null, 2);
}

// Bind UI
document.getElementById('uploadBtn').addEventListener('click', uploadFile);
document.getElementById('searchBtn').addEventListener('click', searchFiles);

// On load
window.onload = () => {
    listFiles();
    loadAnalytics();
};
