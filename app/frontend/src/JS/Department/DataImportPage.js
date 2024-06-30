import { CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import { CiFileOn } from "react-icons/ci";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.js';
import { useDropzone } from 'react-dropzone';
import { FaFile, FaTimes, FaCheckCircle, FaFileUpload, FaRegTrashAlt } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../../CSS/Department/DataImportPage.css';

function FileUpload() {
	const { authToken } = useAuth();

	const [selectedFiles, setSelectedFiles] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [isHovering, setIsHovering] = useState(false);
	const fileInputRef = useRef(null);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => {
			const newFiles = acceptedFiles.filter(file =>
				!selectedFiles.some(existingFile => existingFile.name === file.name)
			);
			setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
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
				if (error.response && error.response.data && error.response.data.error) {
					setErrorMessage(error.response.data.error);
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

	const handleContainerClick = (event) => {
		if (event.target.closest('.dropzone-container') || event.target.closest('.file-preview')) {
			return;
		}
		fileInputRef.current.click();
	};

	return (
		<div className="dashboard">
			<CreateSidebarDept />
			<div className='container'>
				<CreateTopbar />
				<div className="main">
					<h1>Import Data</h1>
					<div className="dropzone-container" {...getRootProps()}>
						<input {...getInputProps()} ref={fileInputRef} />
						<div className="dropzone-content">
							<FaFileUpload size={32} style={{ color: 'grey' }} className="dropzone-icon" />
							<p className="drag-and-drop">Drag & drop files here, or click to select files</p>
							<p className="accepted-type">Excel or CSV</p>
						</div>
					</div>

					{selectedFiles.length > 0 && (
						<div className="file-list-vertical">
							{selectedFiles.map((file, index) => (
								<div
									key={index}
									className="file-preview"
									onClick={(e) => e.stopPropagation()}
									onMouseEnter={() => setHoveredIndex(index)}
									onMouseLeave={() => setHoveredIndex(null)}
								>
									<button className="remove-button" onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}>
										<FaRegTrashAlt style={{ color: 'red', fontSize: hoveredIndex === index ? '20px' : '16px' }} />
									</button>
									<div className="file-icon-name">
										<CiFileOn size={24} />
										<span>{file.name}</span>
									</div>
								</div>
							))}
						</div>
					)}

					<button onClick={handleUpload} disabled={!selectedFiles.length} className="upload-button">Upload</button>

					<Modal open={showModal} onClose={onCloseModal} center styles={{
						modal: {
							width: 250,
							height: 180,
							borderRadius: '10px',
						}
					}}
						closeIcon={<FaTimes size={20}
							style={{
								color: isHovering ? 'black' : 'gray',
								cursor: 'pointer',
								position: 'absolute',
								top: '-15px',
								right: '0px'
							}}
							onMouseEnter={() => setIsHovering(true)}
							onMouseLeave={() => setIsHovering(false)}
						/>}
					>
						<div className="popup-content">
							{errorMessage ? (
								<>
									<FaTimes size={40} color="red" />
									<p>{errorMessage}</p>
								</>
							) : (
								<>
									<div className="success-icon">
										<FaCheckCircle size={45} color="green" />
									</div>
									<p>File(s) uploaded successfully!</p>
								</>
							)}
						</div>
					</Modal>
				</div>
			</div>
		</div>
	);
}


export default FileUpload;
