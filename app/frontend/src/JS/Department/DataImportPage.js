// Import necessary modules and components
import React, { useState } from 'react';      // React core and state management
import { useDropzone } from 'react-dropzone';   // Dropzone functionality
import '../../CSS/Department/DataImportPage.css';
import axios from 'axios';                       // HTTP requests
import { useAuth } from '../AuthContext.js';    // Your custom authentication context

// Define the FileUpload functional component
function FileUpload() {

  // Access the authentication token from your context
  const { authToken } = useAuth(); 

  // State variable to hold the selected file (initially null)
  const [selectedFile, setSelectedFile] = useState(null);

  // Use the useDropzone hook to create the dropzone functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => { // Callback function for when files are dropped
      setSelectedFile(acceptedFiles[0]); // Set the first dropped file as the selected file
    }
  });

  // Function to handle the file upload
  const handleUpload = async () => {
    if (selectedFile) {  // Check if a file is selected
      const formData = new FormData(); // Create a FormData object for the request
      formData.append('file', selectedFile); // Append the selected file to the formData
      try {
        const response = await axios.post(   // Send a POST request to the backend
          `http://localhost:3001/api/upload`, formData, { 
          headers: {
            Authorization: `Bearer ${authToken.token}` // Include the authentication token
          }
        });
        console.log(response.data);  // Log the response data from the backend (success)
      } catch (error) {
        console.error('Error uploading file:', error.response.data.error); // Log any errors
      }
    }
  };

  // JSX to render the component
  return (
    <div className="dropzone-container" {...getRootProps()}> {/* Container for the dropzone */}
      <input {...getInputProps()} /> {/* Hidden input for file selection */}

      {/* Conditional display of instructions or feedback */}
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }

      {/* Button to trigger the file upload */}
      <button onClick={handleUpload}>Upload</button> 
    </div>
  );
}

// Export the FileUpload component for use in other parts of your app
export default FileUpload;
