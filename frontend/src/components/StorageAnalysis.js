import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StorageAnalysis({ analysisData, onRefresh }) {
    if (!analysisData) {
        return (
            <section className="card">
                <h2>Storage Analysis</h2>
                <p>Loading analysis...</p>
                <button onClick={onRefresh}>Refresh</button>
            </section>
        );
    }
    
    const { total_files, total_size_bytes, file_types } = analysisData;

    const chartData = {
        labels: Object.keys(file_types),
        datasets: [{
            label: '# of Files',
            data: Object.values(file_types),
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <section className="card">
            <h2>Storage Analysis</h2>
            <div className="analysis-summary">
                <p><strong>Total Files:</strong> {total_files}</p>
                <p><strong>Total Size:</strong> {formatBytes(total_size_bytes)}</p>
            </div>
            <div className="chart-container">
                {total_files > 0 ? (
                    <Pie data={chartData} />
                ) : (
                    <p>Upload files to see analysis.</p>
                )}
            </div>
             <button onClick={onRefresh}>Refresh Analysis</button>
        </section>
    );
}

export default StorageAnalysis;