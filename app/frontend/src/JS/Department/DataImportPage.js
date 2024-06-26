import React, { useState } from 'react';      // Import React core and useState hook
import { useDropzone } from 'react-dropzone';   // Import the useDropzone hook
import '../../CSS/Department/DataImportPage.css';
import axios from 'axios';                       // Import axios for HTTP requests
import { useAuth } from '../AuthContext.js';    // Import your custom auth context
import { FaFile, FaTimes } from 'react-icons/fa'; // Import file and "X" icons

// Define the functional component
function FileUpload() {
  const { authToken } = useAuth();            // Get authToken from context

  const [selectedFile, setSelectedFile] = useState(null); // State to store the file

  // Get properties and state from useDropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => { // Callback when files are dropped
      setSelectedFile(acceptedFiles[0]); // Update state with the first dropped file
    }
  });

  // Function to handle the file upload
  const handleUpload = async () => {
    if (selectedFile) {             // Check if a file is selected
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await axios.post(
          `http://localhost:3001/api/upload`, formData, { 
          headers: {
            Authorization: `Bearer ${authToken.token}` // Add auth token
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error.response.data.error);
      }
    }
  };

  // Function to handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null); 
  };

  return (
    <div className="dropzone-container" {...getRootProps()}>
      <input {...getInputProps()} />

      {/* Conditional rendering of file info or instructions */}
      {selectedFile ? (
        <div className="file-info">
          <div className="file-preview"> {/* Container for icon, name, and "X" */}
            <FaTimes 
              className="remove-button" 
              onClick={handleRemoveFile} 
            />
            <FaFile size={40} />
            <p>{selectedFile.name}</p>
          </div>
        </div>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
