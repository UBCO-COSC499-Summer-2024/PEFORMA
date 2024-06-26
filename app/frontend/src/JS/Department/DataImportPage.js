import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.js';

function FileUpload() {

  const { authToken } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await axios.post(`http://localhost:3001/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${authToken.token}` // Add the token in the headers
          }
        });
        console.log(response.data); // Handle success response from backend
      } catch (error) {
        console.error('Error uploading file:', error.response.data.error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
