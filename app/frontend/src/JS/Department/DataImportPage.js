import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.js';
import { useDropzone } from 'react-dropzone';
import { FaFile, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../CSS/Department/DataImportPage.css';

function FileUpload() {
  const { authToken } = useAuth();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.filter(file => 
          !selectedFiles.some(existingFile => existingFile.name === file.name)
      ); // filter out files with duplicate names
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]); // add filtered files
    },
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    } 
  });

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file); 
      });

      try {
        const response = await axios.post(
          `http://localhost:3001/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken.token}`,
              'Content-Type': 'multipart/form-data', 
            },
          }
        );
        console.log(response.data);
        setShowModal(true);
        setErrorMessage('');
      } catch (error) {
        console.error('Error uploading file:', error.response);
        if(error.response.data.error){ 
          setErrorMessage(error.response.data.error || 'An error occurred during upload.');
        } else {
          setErrorMessage('An error occurred during upload.');
        }
      }
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
    setSelectedFiles([]);
    setErrorMessage(''); 
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleContainerClick = (event) => { // renamed function
    if (event.target.closest('.dropzone-container') || event.target.closest('.file-preview')) {
      return; 
    }

    open();  // use open() provided from the useDropzone hook
  };

  return (
    <div onClick={handleContainerClick}> 
      <div className="dropzone-container" {...getRootProps()}>
        <input {...getInputProps()} />
        {selectedFiles.length > 0 ? (
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-preview" onClick={(e) => e.stopPropagation()}>
                <button className="remove-button" onClick={(e) => {e.stopPropagation(); handleRemoveFile(index);}}>
                  <FaTimes />
                </button>
                <div className="file-icon-name">
                  <FaFile size={24} />
                  <span>{file.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Drag & drop files here, or click to select files</p> 
        )}
      </div>

      <button onClick={handleUpload} disabled={!selectedFiles.length}>Upload</button>

      <Modal open={showModal} onClose={onCloseModal} center>
        <div className="popup-content">
          {errorMessage ? (
            <>
              <FaTimes size={32} color="red" />
              <p>{errorMessage}</p>
            </>
          ) : (
            <>
              <FaCheckCircle size={32} color="green" />
              <p>File(s) uploaded successfully!</p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}


export default FileUpload;
