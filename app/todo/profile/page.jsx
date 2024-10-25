"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import CustomAlert from "@components/CustomAlert";
import { CircularProgress } from "@mui/material";

const ProfilePage = () => {
	const {
		register,
		handleSubmit,
		resetField,
		setValue,
		unregister,
		watch,
		setError,
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

	const [alert, setAlert] = useState(() => ({
		is_visible: false,
		message: "",
		severity: "",
	}));

	let timeout = useRef(null);

	const CloseAlert = () => {
		if (timeout.current) {
			clearTimeout(timeout.current);
		}

		timeout.current = setTimeout(() => {
			setAlert({
				is_visible: false,
				message: "",
				severity: "error",
			});
			timeout.current = null;
		}, 1500);
	};

	const EditField = (field, isDisabled) => {
		setProfile({
			...profile,
			[field]: { value: profile[field].value, isDisabled: isDisabled },
		});

		if (isDisabled) setError(field, { message: "" });
	};

	const apiClient = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	const EditProfile = async (data) => {
		const payload = {
			name: data.name,
			username: data.username,
			password: !profile.password.isDisabled
				? data.new_password
				: user.password,
			current_password: data.current_password,
		};

		console.log(payload);

		let interceptorID = apiClient.interceptors.response.use(
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
			const result = await apiClient.put("/api/users/details", payload);

			if (result.status === 200) {
				setUser(result.data.data);
				setProfile({
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
				});
				setAlert({
					is_visible: true,
					message: "Profile updated successfully",
					severity: "success",
				});

				CloseAlert();
			}
		} catch (err) {
			setAlert({
				is_visible: true,
				message: err.response.data.data?.message || "Server Error",
				severity: "error",
			});

			CloseAlert();
		}
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

	const new_password = watch("new_password");

	return (
		<>
			<div className="flex flex-col items-center justify-center  w-full h-full pt-12 gap-3 pb-12">
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
										errors.name?.message
											? "input-error"
											: "input input-bordered"
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
										onClick={() => {
											EditField("name", true);
											setValue("name", user.name);
										}}
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
										onClick={() => {
											EditField("username", true);
											setValue("username", user.username);
										}}
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
										{errors.current_password?.message && (
											<small
												className={
													errors.current_password?.message && "text-red-500"
												}
											>
												{errors.current_password?.message}
											</small>
										)}
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
												minLength: {
													value: 8,
													message:
														"Password must be at least 8 characters long",
												},
											})}
											placeholder="Please provide your new password"
										/>

										{errors.new_password?.message && (
											<small
												className={
													errors.new_password?.message && "text-red-500"
												}
											>
												{errors.new_password?.message}
											</small>
										)}
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
												validate: (value) =>
													value === new_password || "Password do not match",
											})}
											placeholder="Please confirm your new password"
										/>
										{errors.confirm_password?.message && (
											<small
												className={
													errors.confirm_password?.message && "text-red-500"
												}
											>
												{errors.confirm_password?.message}
											</small>
										)}
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

					<button
						disabled={isSubmitting}
						className="btn btn-primmary bg-slate-900 text-white hover:bg-slate-800 mt-2"
					>
						{isSubmitting ? <CircularProgress size={"1em"} /> : "Update"}
					</button>
				</form>
				<button className="btn w-full max-w-[25rem] btn-outline text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500">
					Delete Account
				</button>
				{alert.is_visible && (
					<CustomAlert
						is_visible={alert.is_visible}
						message={alert.message}
						severity={alert.severity}
					/>
				)}
			</div>
		</>
	);
};

export default ProfilePage;
