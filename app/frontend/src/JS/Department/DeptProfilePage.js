import React, { useState, useEffect } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Button } from '../../ui/button';

//Tailwind
import '../../CSS/tailwindOutput.css';

const ProfilePage = () => {
	const { profileId, authToken } = useAuth();
	const navigate = useNavigate();
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
		working_hours: 0
	});

	useEffect(() => {
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
				setProfileData({ ...data });
			} catch (error) {
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken');
					navigate('/Login');
				} else {
					console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
				}
			}
		};

		fetchUserProfileData();
	});

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
									<img
										src={`http://localhost:3001/api/image/${profileId}`}
										alt="Profile image"
										style={{ cursor: 'pointer' }}
										onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/default/image.jpg' }}
										className="[&]:w-40 [&]:h-40 [&]:rounded-full [&]:mr-10"
									/>
									<div>
										<h3 className="[&]:text-2xl [&]:font-bold">{profileData.name}</h3>
										<p className="[&]:text-sm [&]:text-gray-400 [&]:mt-1">UBC ID: {profileData.UBCId}</p>
										<p className="[&]:text-lg [&]:text-gray-600">{profileData.email}</p>
									</div>
								</div>
								<Button className="[&]:ml-auto [&]:text-lg [&]:px-6 [&]:py-3 [&]:bg-gray-800 [&]:rounded">Edit</Button>
							</div>

							<div className="[&]:grid [&]:grid-cols-2 [&]:gap-x-8 [&]:mt-8">
								<div className="[&]:col-span-1">
									<h4 className="[&]:text-2xl [&]:font-bold [&]:text-gray-900 [&]:mb-4">Personal Information</h4>
									<hr className="[&]:border-t [&]:border-gray-300 [&]:mb-4" />
									<div className="[&]:grid [&]:grid-cols-1 [&]:gap-y-4">
										<div>
											<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Office Location</h4>
											<p className="[&]:text-xl [&]:font-medium">{profileData.office_location}</p>
										</div>
										<div>
											<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Phone Number</h4>
											<p className="[&]:text-xl [&]:font-medium">{profileData.phone_number}</p>
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
												<p className="[&]:text-xl [&]:font-medium">{profileData.current_courses}</p>
											</div>
										</div>
									</div>
									<div>
										<h4 className="[&]:text-2xl [&]:font-bold [&]:text-gray-900 [&]:mb-4">Service</h4>
										<hr className="[&]:border-t [&]:border-gray-300 [&]:mb-4" />
										<div className="[&]:grid [&]:grid-cols-1 [&]:gap-y-4">
											<div>
												<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Current Service Role(s)</h4>
												<p className="[&]:text-xl [&]:font-medium">{profileData.current_service_roles}</p>
											</div>
											<div>
												<h4 className="[&]:text-xl [&]:font-medium [&]:text-gray-500 [&]:mb-2">Working Hours</h4>
												<p className="[&]:text-xl [&]:font-medium">{profileData.working_hours} Hours</p>
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