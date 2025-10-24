import React from 'react';

function FileList({ files, apiUrl, onSearch }) {
    
    const handleDownload = (filename) => {
        window.open(`${apiUrl}/download/${filename}`, "_blank");
    };

    return (
        <section className="card">
            <h2>Stored Files</h2>
            <input 
                type="text" 
                placeholder="Search files..." 
                className="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
            <ul className="file-list">
                {files.length > 0 ? (
                    files.map(file => (
                        <li key={file}>
                            <span>{file}</span>
                            <button onClick={() => handleDownload(file)}>Download</button>
                        </li>
                    ))
                ) : (
                    <li>No files found.</li>
                )}
            </ul>
        </section>
    );
}

export default FileList;