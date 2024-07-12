import React, { useState, useEffect, useRef } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

import '../../CSS/tailwindOutput.css';

const ProfilePage = () => {
	const { profileId, authToken } = useAuth();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [profileData, setProfileData] = useState({
		UBCId: 0,
		current_courses: [],
		current_service_roles: [],
		division: 0,
		email: "",
		name: "",
		office_location: "",
		performance_score: 0,
		phone_number: "",
		profileId: 1,
		working_hours: 0,
		benchmark: 0,
		image_type: "",
		image_data: ""
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const [tempImage, setTempImage] = useState(null);

	const inputStyle = "[&]:w-full [&]:px-3 [&]:py-2 [&]:text-gray-400 [&]:bg-white [&]:border [&]:border-gray-300 [&]:rounded-md [&]:shadow-sm [&]:focus:outline-none [&]:focus:ring-2 [&]:focus:ring-blue-500 [&]:focus:border-transparent [&]:transition [&]:duration-150 [&]:ease-in-out";

	useEffect(() => {
		fetchUserProfileData();
	}, [profileId, authToken]);

	const fetchUserProfileData = async () => {
		try {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			const res = await axios.get(`http://localhost:3001/api/profile/${profileId}`, {
				headers: { Authorization: `Bearer ${authToken.token}` },
			});
			const data = res.data;
			// Ensure image_data and image_type are set correctly
			setProfileData({
				...data,
				image_data: data.image_data || '',
				image_type: data.image_type || 'jpeg'
			});
			setEditedData({
				...data,
				image_data: data.image_data || '',
				image_type: data.image_type || 'jpeg'
			});
		} catch (error) {
			if (error.response && error.response.status === 401) {
				localStorage.removeItem('authToken');
				navigate('/Login');
			} else {
				console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
			}
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditedData({ ...profileData });
		setTempImage(null);
	};

	const handleSave = async () => {
		try {
			const formData = new FormData();
			Object.keys(editedData).forEach(key => {
				formData.append(key, editedData[key]);
			});
			if (tempImage) {
				formData.append('image', tempImage);
			}
			const res = await axios.put(
				`http://localhost:3001/api/profile/${profileId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken.token}`,
						'Content-Type': 'multipart/form-data'
					},
				}
			);
			setProfileData({ ...res.data });
			setIsEditing(false);
			setTempImage(null);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedData({ ...profileData });
		setTempImage(null);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedData({ ...editedData, [name]: value });
	};

	const handleImageClick = () => {
		if (isEditing) {
			fileInputRef.current.click();
		}
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setTempImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result;
				const base64Data = result.split(',')[1];
				setEditedData(prev => ({
					...prev,
					image_data: base64Data,
					image_type: file.type.split('/')[1]
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const renderNewlineSeparatedText = (text) => {
		if (typeof text === 'string') {
			return text.split('\n').map((item, index) => (
				<p key={index} className="[&]:text-xl [&]:font-medium">{item}</p>
			));
		} else if (Array.isArray(text)) {
			return text.map((item, index) => (
				<p key={index} className="[&]:text-xl [&]:font-medium">{item}</p>
			));
		} else {
			console.error('Expected string or array, received:', typeof text, text);
			return <p className="[&]:text-xl [&]:font-medium">No data available</p>;
		}
	};

	if (!profileData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />
				<div id="tailwind-scope" className="[&]:bg-gray-950 [&]:p-4 [&]:min-h-screen">
					<Card className="[&]:w-[95%] [&]:mx-auto [&]:my-8 [&]:bg-white [&]:rounded-xl [&]:shadow-md [&]:pb-16">
						<CardHeader className="[&]:flex [&]:justify-between [&]:items-center [&]:p-6 [&]:rounded-t-xl [&]:bg-gradient-to-r [&]:from-blue-200 [&]:to-yellow-100">
							<h2 className="[&]:text-4xl [&]:font-bold">Faculty Profile</h2>
							<div className="[&]:text-right">
								<div className="[&]:text-lg [&]:text-gray-600">Performance Score</div>
								<div className="[&]:text-4xl [&]:font-bold">{profileData.performance_score}</div>
							</div>
						</CardHeader>
						<CardContent className="[&]:px-12 [&]:py-8">
							<div className="[&]:flex [&]:items-center [&]:justify-between [&]:mb-2">
								<div className="[&]:flex [&]:items-center">
									<div
										className="[&]:relative [&]:w-40 [&]:h-40 [&]:rounded-full [&]:mr-10 [&]:overflow-hidden [&]:cursor-pointer"
										onClick={handleImageClick}
									>
										{editedData.image_data ? (
											<img
												src={`data:image/${editedData.image_type};base64,${editedData.image_data}`}
												alt="Profile"
												className="[&]:w-full [&]:h-full [&]:object-cover"
											/>
										) : (
											<div className="[&]:w-full [&]:h-full [&]:bg-gray-200 [&]:flex [&]:items-center [&]:justify-center">
												<span className="[&]:text-gray-500 [&]:text-lg">No Image</span>
											</div>
										)}
										{isEditing && (
											<div className="[&]:absolute [&]:inset-0 [&]:bg-black [&]:bg-opacity-50 [&]:flex [&]:items-center [&]:justify-center">
												<span className="[&]:text-white [&]:text-lg [&]:font-bold">Click to upload</span>
											</div>
										)}
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleImageChange}
											className="[&]:hidden"
											accept="image/*"
										/>
									</div>
									<div>
										{isEditing ? (
											<Input
												name="name"
												value={editedData.name}
												onChange={handleInputChange}
												className={`[&]:text-2xl [&]:font-bold [&]:mb-2 ${inputStyle}`}
											/>
										) : (
											<h3 className="[&]:text-2xl [&]:font-bold">{profileData.name}</h3>
										)}
										<p className="[&]:text-sm [&]:text-gray-400 [&]:mt-1">UBC ID: {profileData.UBCId}</p>
										{isEditing ? (
											<Input
												name="email"
												value={editedData.email}
												onChange={handleInputChange}
												className={`[&]:text-lg ${inputStyle}`}
											/>
										) : (
											<p className="[&]:text-lg [&]:text-gray-600">{profileData.email}</p>
										)}
									</div>
								</div>
								{isEditing ? (
									<div className="[&]:flex [&]:gap-2">
										<Button
											className="[&]:text-lg [&]:px-6 [&]:py-3 [&]:bg-blue-600 [&]:text-white [&]:rounded [&]:hover:bg-blue-700 [&]:transition [&]:duration-150 [&]:ease-in-out"
											onClick={handleSave}
										>
											Save
										</Button>
										<Button
											className="[&]:text-lg [&]:px-6 [&]:py-3 [&]:bg-gray-500 [&]:text-white [&]:rounded [&]:hover:bg-gray-600 [&]:transition [&]:duration-150 [&]:ease-in-out"
											onClick={handleCancel}
										>
											Cancel
										</Button>
									</div>
								) : (
									<Button
										className="[&]:text-lg [&]:px-6 [&]:py-3 [&]:bg-blue-600 [&]:text-white [&]:rounded [&]:hover:bg-blue-700 [&]:transition [&]:duration-150 [&]:ease-in-out"
										onClick={handleEdit}
									>
										Edit
									</Button>
								)}
							</div>

							<div className="[&]:grid [&]:grid-cols-2 [&]:gap-x-8 [&]:mt-8">
								<div className="[&]:col-span-1">
									<h4 className="[&]:text-2xl [&]:font-bold [&]:text-gray-900 [&]:mb-4">Personal Information</h4>
									<hr className="[&]:border-t [&]:border-gray-300 [&]:mb-4" />
									<div className="[&]:grid [&]:grid-cols-1 [&]:gap-y-4">
										<div>
											<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Office Location</h4>
											{isEditing ? (
												<Input
													name="office_location"
													value={editedData.office_location}
													onChange={handleInputChange}
													className={`[&]:text-xl ${inputStyle}`}
												/>
											) : (
												<p className="[&]:text-xl [&]:font-medium">{profileData.office_location}</p>
											)}
										</div>
										<div>
											<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Phone Number</h4>
											{isEditing ? (
												<Input
													name="phone_number"
													value={editedData.phone_number}
													onChange={handleInputChange}
													className={`[&]:text-xl ${inputStyle}`}
												/>
											) : (
												<p className="[&]:text-xl [&]:font-medium">{profileData.phone_number}</p>
											)}
										</div>
										<div>
											<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Division</h4>
											<p className="[&]:text-xl [&]:font-medium">{profileData.division}</p>
										</div>
									</div>
								</div>
								<div className="[&]:col-span-1">
									<div className="[&]:mb-8">
										<h4 className="[&]:text-2xl [&]:font-bold [&]:text-gray-900 [&]:mb-4">Teaching</h4>
										<hr className="[&]:border-t [&]:border-gray-300 [&]:mb-4" />
										<div className="[&]:grid [&]:grid-cols-1 [&]:gap-y-4">
											<div>
												<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Current Course(s)</h4>
												<div className="[&]:text-xl [&]:font-medium">
													{renderNewlineSeparatedText(profileData.current_courses)}
												</div>
											</div>
										</div>
									</div>
									<div>
										<h4 className="[&]:text-2xl [&]:font-bold [&]:text-gray-900 [&]:mb-4">Service</h4>
										<hr className="[&]:border-t [&]:border-gray-300 [&]:mb-4" />
										<div className="[&]:grid [&]:grid-cols-1 [&]:gap-y-4">
											<div>
												<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Current Service Role(s)</h4>
												<div className="[&]:text-xl [&]:font-medium">
													{renderNewlineSeparatedText(profileData.current_service_roles)}
												</div>
											</div>
											<div>
												<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Hours Completed</h4>
												<p className="[&]:text-xl [&]:font-medium">{profileData.working_hours} / {profileData.benchmark} Hours</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;