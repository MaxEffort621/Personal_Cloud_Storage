import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import StorageAnalysis from './components/StorageAnalysis';
import './App.css';

const API_URL = "http://localhost:5001";

function App() {
    const [files, setFiles] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [message, setMessage] = useState('');

    const fetchFiles = useCallback(async (query = '') => {
        try {
            const response = await axios.get(`${API_URL}/files`, { params: { name: query } });
            setFiles(response.data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
            setMessage('Could not fetch files.');
        }
    }, []);

    const fetchAnalysis = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/analysis`);
            setAnalysis(response.data);
        } catch (error) {
            console.error("Error fetching analysis:", error);
            setMessage('Could not fetch storage analysis.');
        }
    }, []);

    const refreshData = useCallback(() => {
        fetchFiles();
        fetchAnalysis();
    }, [fetchFiles, fetchAnalysis]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleUploadSuccess = (newMessage) => {
        setMessage(newMessage);
        refreshData();
    };
    
    const handleSearch = (query) => {
        fetchFiles(query);
    };

    return (
        <div className="App">
            <header>
                <h1>Personal Cloud Storage</h1>
                {message && <p className="message">{message}</p>}
            </header>
            
            <main>
                <div className="main-layout">
                    <div className="left-panel">
                        <FileUpload apiUrl={API_URL} onUploadSuccess={handleUploadSuccess} />
                        <FileList files={files} apiUrl={API_URL} onSearch={handleSearch} />
                    </div>
                    <div className="right-panel">
                        <StorageAnalysis analysisData={analysis} onRefresh={refreshData} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
