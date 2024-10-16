"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import axios from "axios";

const TodoNavigation = () => {
	const router = useRouter();

	const [user, setUser] = useState(() => ({}));

	const [confirmationModal, setConfirmationModal] = useState({
		is_visible: false,
		confirmation_message: "",
		button_confirmation_text: "",
		event: null,
	});

	const Logout = async () => {
		await axios.get("/api/users/logout");

		router.push("/signin");
	};

	const apiClient = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	useEffect(() => {
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

				console.log(result);
				setUser(result.data.data);
			} catch (err) {
				console.error("Error fetching user details:", err);
			}
		}

		GetUserDetails();

		return () => {
			apiClient.interceptors.response.eject(interceptorID);
		};
	}, []);
	return (
		<>
			<div className="flex justify-between items-center px-5 py-3">
				<h1 className="font-bold text-orange-300">{user.name}</h1>
				<ul className="text-white flex gap-5 justify-end items-center">
					<li>
						<Link href="/todo/list">Todo</Link>
					</li>
					<li>
						<Link href="/todo/notes">Notes</Link>
					</li>
					<li>
						<IconButton
							aria-label="logout"
							color="error"
							onClick={() =>
								setConfirmationModal({
									...confirmationModal,
									is_visible: true,
									confirmation_message: "Are you sure you want to sign out?",
									button_confirmation_text: "Sign Out",
									event: Logout,
								})
							}
						>
							<LogoutIcon />
						</IconButton>
					</li>
				</ul>
			</div>

			{confirmationModal.is_visible && (
				<ConfirmationModal
					confirmationModal={confirmationModal}
					setConfirmationModal={setConfirmationModal}
					event={confirmationModal.event}
				/>
			)}
		</>
	);
};

export default TodoNavigation;
