"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const ProfilePage = () => {
	const {
		register,
		handleSubmit,
		resetField,
		setValue,
		unregister,
		formState: { errors, isSubmitting },
	} = useForm();

	const [profile, setProfile] = useState(() => ({
		name: {
			value: "",
			isDisabled: true,
		},
		username: {
			value: "",
			isDisabled: true,
		},
		password: {
			value: "",
			isDisabled: true,
		},
	}));

	const [user, setUser] = useState(() => null);

	const [dataInProgress, setDataProgress] = useState(() => true);

	const EditField = (field, isDisabled) => {
		setProfile({
			...profile,
			[field]: { value: profile[field].value, isDisabled: isDisabled },
		});
	};

	const apiClient = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	const EditProfile = (data) => {
		console.log(data);
	};

	useEffect(() => {
		setDataProgress(true);

		let interceptorID;

		async function GetUserDetails() {
			interceptorID = apiClient.interceptors.response.use(
				(response) => {
					return response;
				},
				async (error) => {
					const originalRequest = error.config;

					if (
						error.response &&
						error.response.status === 401 &&
						!originalRequest._retry
					) {
						originalRequest._retry = true;

						try {
							const result = await axios.get("/api/refresh");

							if (result.status === 200)
								// Retry the original request with refreshed token
								return apiClient(originalRequest);
							else {
								// If refresh fails, redirect to the sign-in page
								await axios.get("/api/users/logout");
								router.push("/signin");
								return Promise.reject(new Error("Token refresh failed"));
							}
						} catch (refreshError) {
							// In case of refresh failure, redirect to sign-in page and reject
							await axios.get("/api/users/logout");
							router.push("/signin");
							return Promise.reject(refreshError);
						}
					}

					// For other types of errors, reject the promise as usual
					return Promise.reject(error);
				}
			);

			try {
				const result = await apiClient.get("/api/users/details");

				setUser(result.data.data);
				setValue("name", result.data.data.name);
				setValue("username", result.data.data.username);

				setDataProgress(false);
			} catch (err) {
				console.error("Error fetching user details:", err);
			}
		}

		GetUserDetails();

		return () => {
			apiClient.interceptors.response.eject(interceptorID);
		};
	}, []);

	useEffect(() => {
		if (profile.password.isDisabled) {
			unregister(["current_password", "new_password", "confirm_password"]);
			resetField("current_password");
			resetField("new_password");
			resetField("confirm_password");
		}
	}, [profile]);

	return (
		<div className="flex flex-col items-center  w-full h-full pt-12 gap-3 pb-12">
			<h1 className="text-3xl font-bold font-[Poppins] text-orange-500">
				Profile
			</h1>
			<form
				className="max-w-[25rem] w-full flex flex-col gap-3 mt-3"
				onSubmit={handleSubmit(EditProfile)}
			>
				{/* Name */}
				{dataInProgress ? (
					<section className="flex flex-col gap-2">
						<div className="skeleton w-[3.5rem] h-[23px] "></div>
						<div className="skeleton w-full h-[3rem] "></div>
					</section>
				) : (
					<section className="w-full relative">
						<label className="font-medium font-[Poppins] mb-2" htmlFor="name">
							Name
						</label>
						<section className="flex items-center gap-3">
							<input
								type="text"
								className={`input input-bordered w-full disabled:text-slate-950 disabled:bg-white disabled:cursor-pointer  ${
									errors.name?.message ? "input-error" : "input input-bordered"
								}`}
								disabled={profile.name.isDisabled}
								{...register("name", {
									required: "Please provide your name",
								})}
							/>

							{profile.name.isDisabled ? (
								<EditIcon
									onClick={() => EditField("name", false)}
									aria-label="button"
									role="button"
								/>
							) : (
								<CloseIcon
									onClick={() => EditField("name", true)}
									aria-label="button"
									role="button"
								/>
							)}
						</section>

						{errors.name?.message && (
							<small className={errors.name?.message && "text-red-500"}>
								{errors.name?.message}
							</small>
						)}
					</section>
				)}

				{/* Username */}
				{dataInProgress ? (
					<section className="flex flex-col gap-2">
						<div className="skeleton w-[3.5rem] h-[23px] "></div>
						<div className="skeleton w-full h-[3rem] "></div>
					</section>
				) : (
					<section className="w-full relative">
						<label
							className="font-medium font-[Poppins] mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<section className="flex items-center gap-3">
							<input
								type="text"
								className={`input input-bordered w-full disabled:text-slate-950 disabled:bg-white disabled:cursor-pointer  ${
									errors.username?.message
										? "input-error"
										: "input input-bordered"
								}`}
								disabled={profile.username.isDisabled}
								{...register("username", {
									required: "Please provide your username",
									minLength: {
										value: 8,
										message:
											"Username must be atleast eight (8) characters long",
									},
								})}
							/>
							{profile.username.isDisabled ? (
								<EditIcon
									onClick={() => EditField("username", false)}
									aria-label="button"
									role="button"
								/>
							) : (
								<CloseIcon
									onClick={() => EditField("username", true)}
									aria-label="button"
									role="button"
								/>
							)}
						</section>

						{errors.username?.message && (
							<small className={errors.username?.message && "text-red-500"}>
								{errors.username?.message}
							</small>
						)}
					</section>
				)}

				{/* Password */}
				{dataInProgress ? (
					<section className="flex flex-col gap-2">
						<div className="skeleton w-[3.5rem] h-[23px] "></div>
						<div className="skeleton w-full h-[3rem] "></div>
					</section>
				) : (
					<section className="w-full relative">
						<label
							className="font-medium font-[Poppins] mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<section className="flex items-center gap-3">
							<input
								type="password"
								className={`input input-bordered w-full disabled:text-slate-950 disabled:bg-white disabled:cursor-pointer  ${
									errors.password?.message
										? "input-error"
										: "input input-bordered"
								}`}
								disabled={true}
								value={"****************"}
							/>
							{profile.password.isDisabled ? (
								<EditIcon
									onClick={() => EditField("password", false)}
									aria-label="button"
									role="button"
								/>
							) : (
								<CloseIcon
									onClick={() => EditField("password", true)}
									aria-label="button"
									role="button"
								/>
							)}
						</section>

						{!profile.password.isDisabled && (
							<div className="flex flex-col mt-5 gap-3">
								<section>
									<label
										className="font-medium font-[Poppins] mb-2"
										htmlFor="current-password"
									>
										Current Password
									</label>
									<input
										id="current-password"
										name="current-password"
										type="text"
										className={`input input-bordered w-full disabled:text-slate-950 disabled:bg-white disabled:cursor-pointer ${
											errors.current_password?.message
												? "input-error"
												: "input input-bordered"
										}`}
										{...register("current_password", {
											required: "Please provide your current password",
										})}
										placeholder="Please provide your current password"
									/>
								</section>

								<section>
									<label
										className="font-medium font-[Poppins] mb-2"
										htmlFor="new-password"
									>
										New Password
									</label>
									<input
										type="text"
										id="new-password"
										name="new-password"
										className={`input input-bordered w-full disabled:text-slate-950 disabled:bg-white disabled:cursor-pointer ${
											errors.new_password?.message
												? "input-error"
												: "input input-bordered"
										}`}
										{...register("new_password", {
											required: "Please provide your new password",
										})}
										placeholder="Please provide your new password"
									/>
								</section>

								<section>
									<label
										className="font-medium font-[Poppins] mb-2"
										htmlFor="confirm-password"
									>
										Confirm Password
									</label>
									<input
										type="text"
										id="confirm-password"
										name="confirm-password"
										className={`input input-bordered w-full disabled:text-slate-950 disabled:bg-white disabled:cursor-pointer ${
											errors.confirm_password?.message
												? "input-error"
												: "input input-bordered"
										}`}
										{...register("confirm_password", {
											required: "Please confirm your new password",
										})}
										placeholder="Please confirm your new password"
									/>
								</section>
							</div>
						)}

						{errors.password?.message && (
							<small className={errors.password?.message && "text-red-500"}>
								{errors.password?.message}
							</small>
						)}
					</section>
				)}

				<button className="btn btn-primmary bg-slate-900 text-white hover:bg-slate-800 mt-2">
					Update
				</button>
			</form>
		</div>
	);
};

export default ProfilePage;
