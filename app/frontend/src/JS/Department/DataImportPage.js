import '../../CSS/Department/DataImportPage.css';
import React, { useState } from 'react';      // Import React core and useState hook
import { useDropzone } from 'react-dropzone';   // Import the useDropzone hook
import axios from 'axios';                       // Import axios for HTTP requests
import { useAuth } from '../AuthContext.js';    // Import your custom auth context
import { FaFile, FaTimes, FaCheckCircle } from 'react-icons/fa'; // Import icons
import { Modal } from 'react-responsive-modal'; // Import Modal component
import 'react-responsive-modal/styles.css';   // Import the default styles

function FileUpload() {
  // Get the authentication token from your context
  const { authToken } = useAuth();

  // State to manage file selection and modal visibility
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => { // Callback when files are dropped
      setSelectedFile(acceptedFiles[0]); // Update state with the dropped file
    }
  });

  // Function to handle file upload
  const handleUpload = async () => {
    if (selectedFile) {             // Check if a file is selected
      const formData = new FormData(); // Create a FormData object for the request
      formData.append('file', selectedFile); // Append the file to the formData

      try {
        const response = await axios.post(   // Send a POST request to the backend
          `http://localhost:3001/api/upload`, formData, { 
          headers: {
            Authorization: `Bearer ${authToken.token}` // Include the authentication token
          }
        });
        console.log(response.data);
        setShowModal(true);  // Show the modal on successful upload
      } catch (error) {
        console.error('Error uploading file:', error.response.data.error); // Log any errors
      }
    }
  };

  // Function to handle closing the modal and resetting the state
  const onCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null); // Clear the selected file
  };

  // Function to handle removing file from dropzone
  const handleRemoveFile = () => {
    setSelectedFile(null); 
  };

  return (
    <div>
      <div className="dropzone-container" {...getRootProps()}> {/* Container for the dropzone */}
        <input {...getInputProps()} /> {/* Hidden input for file selection */}

        {/* Conditional rendering of file info or instructions */}
        {selectedFile ? (
          <div className="file-info">
            <div className="file-preview">
              <FaTimes className="remove-button" onClick={handleRemoveFile} /> 
              <FaFile size={40} />
              <p>{selectedFile.name}</p>
            </div>
          </div>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p> 
        )}
      </div>

      <button onClick={handleUpload} disabled={!selectedFile}>Upload</button>

      {/* Success Modal */}
      <Modal open={showModal} onClose={onCloseModal} center> {/* Modal component */}
        <div className="popup-content">
          <FaCheckCircle size={32} color="green" /> 
          <p>File uploaded successfully!</p>
        </div>
      </Modal>
    </div>
  );
}

export default FileUpload; 
