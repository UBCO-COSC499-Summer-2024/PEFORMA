import React, { useState, useCallback } from 'react';
import { FaFileUpload, FaFile, FaRegTrashAlt, FaTimes } from "react-icons/fa";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAuth } from '../../common/AuthContext.js';

import '../../../CSS/Department/DataImportImports/DeptImportModal.css';

const ImportModal = ({ isOpen, onClose }) => {
    const { authToken } = useAuth();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({ message: '', status: null });

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            alert("Only CSV and Excel files are accepted.");
        }

        const newFiles = acceptedFiles.filter(file =>
            !selectedFiles.some(existingFile => existingFile.name === file.name)
        );

        if (newFiles.length > 0) {
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setUploadStatus({ message: '', status: null });
        }
    }, [selectedFiles]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        }
    });

    const handleFileUpload = async () => {
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append(`files`, file);
            });

            try {
                const response = await axios.post(
                    `http://localhost:3001/api/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                console.log(response.data);
                setUploadStatus({
                    message: response.data.message,
                    status: response.data.status
                });
                if (response.data.status === 'success') {
                    setSelectedFiles([]);
                }
            } catch (error) {
                console.error('Error uploading file:', error.response);
                setUploadStatus({
                    message: error.response?.data?.message || 'Error uploading file(s). Please try again.',
                    status: 'error'
                });
            }
        }
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setUploadStatus({ message: '', status: null });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2>Import Data</h2>
                <div className="dropzone-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                        <FaFileUpload size={40} style={{ color: 'grey' }} className="dropzone-icon" />
                        <p className="drag-and-drop">Drag & drop files here, or click to select files</p>
                        <p className="accepted-type">Excel or CSV</p>
                    </div>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="file-list-vertical">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="file-preview">
                                <div className="file-icon-name">
                                    <FaFile size={24} />
                                    <span>{file.name}</span>
                                </div>
                                <button className="remove-button" onClick={() => handleRemoveFile(index)}>
                                    <FaRegTrashAlt style={{ color: 'red' }} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {uploadStatus.message && (
                    <p className={`message ${uploadStatus.status}`}>
                        {uploadStatus.message}
                    </p>
                )}

                <div className="modal-buttons">
                    <button
                        onClick={handleFileUpload}
                        disabled={selectedFiles.length === 0}
                        className="import-modal-upload-button"
                    >
                        Upload
                    </button>
                    <button onClick={() => {
                        onClose();
                        setUploadStatus({ message: '', status: null });
                        setSelectedFiles([]);
                    }} className="import-modal-close-button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;