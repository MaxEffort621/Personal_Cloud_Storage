import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ apiUrl, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(`${apiUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUploadSuccess(response.data.message);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed.");
        }
    };

    return (
        <section className="card">
            <h2>Upload File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </section>
    );
}

export default FileUpload;