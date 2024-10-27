"use client";

import React, { useContext, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import SessionContext from "@contexts/SessionContext";

const TodoNavigation = () => {
	const router = useRouter();
	const { user, setUser } = useContext(SessionContext);

	// const [user, setUser] = useState(() => ({}));

	const [confirmationModal, setConfirmationModal] = useState({
		is_visible: false,
		confirmation_message: "",
		button_confirmation_text: "",
		event: null,
	});
	const [isConfirmationProgress, setConfirmationProgress] = useState(
		() => false
	);
	const [menu, showMenu] = useState(() => false);
	const [dataInProgress, setDataInProgress] = useState(() => true);
	const menuRef = useRef();

	const Logout = async () => {
		setConfirmationProgress(true);

		await axios.get("/api/users/logout");

		setConfirmationProgress(false);

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
				setDataInProgress(false);
			} catch (err) {
				console.error("Error fetching user details:", err);
			}
		}

		GetUserDetails();

		return () => {
			apiClient.interceptors.response.eject(interceptorID);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (menuRef.current && !menuRef.current.contains(event.target)) {
			showMenu(false);
		}
	};

	useEffect(() => {
		// Add event listener for clicks
		document.addEventListener("mousedown", handleClickOutside);

		// Clean up the event listener on component unmount
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return (
		<>
			<div
				className="navbar px-5 justify-between"
				onClick={(e) => showMenu(false)}
			>
				<Link href="/todo/list">
					<div className="avatar placeholder cursor-pointer">
						<div className="bg-neutral text-neutral-content w-12 rounded-full  border-slate-800 border-2">
							{!user ? (
								<div className="skeleton h-12 w-12 rounded-full"></div>
							) : !user.profile_photo_url ? (
								<span className="text-3xl">
									{user.name.substring(0, 2).toUpperCase()}
								</span>
							) : (
								<img
									src={user.profile_photo_url}
									alt="Profile"
									className="rounded-full w-full h-full"
								/>
							)}
						</div>
					</div>
				</Link>

				<div className="flex-none">
					<ul className=" text-white flex gap-5 justify-end items-center">
						<li className="font-bold">
							<Link href="/todo/list">To-Dos</Link>
						</li>
						<li className="font-bold">
							<Link href="/todo/notes">Notes</Link>
						</li>

						<li className="inline-block relative">
							<button
								className="btn btn-ghost btn-md btn-circle"
								onClick={(e) => {
									e.stopPropagation();
									showMenu(menu ? false : true);
								}}
							>
								<ul className="flex gap-1">
									<li className="w-[.4rem] h-[.4rem] bg-white rounded-full"></li>
									<li className="w-[.4rem] h-[.4rem] bg-white rounded-full"></li>
									<li className="w-[.4rem] h-[.4rem] bg-white rounded-full"></li>
								</ul>
							</button>
							{menu && (
								<div
									ref={menuRef}
									className="bg-slate-950 rounded-md absolute z-10 right-0 mt-2  min-w-[10rem] "
								>
									<ul className="w-full font-semibold rounded-md">
										<li className=" text-white text-center hover:cursor-pointer hover:bg-slate-700 transition-all rounded-tl-md rounded-tr-md w-full px-5 py-3">
											<Link href="/todo/profile">Profile</Link>
										</li>
										<li
											className=" text-white text-center hover:bg-slate-700 transition-all rounded-bl-md rounded-br-md"
											onClick={() => {
												setConfirmationModal({
													...confirmationModal,
													is_visible: true,
													confirmation_message:
														"Are you sure you want to sign out?",
													button_confirmation_text: "Sign Out",
													event: Logout,
												});
											}}
										>
											<button className="w-full px-5 py-3 text-red-500">
												Logout
											</button>
										</li>
									</ul>
								</div>
							)}
						</li>
					</ul>
				</div>
			</div>

			{confirmationModal.is_visible && (
				<ConfirmationModal
					confirmationModal={confirmationModal}
					setConfirmationModal={setConfirmationModal}
					event={confirmationModal.event}
					isConfirmationProgress={isConfirmationProgress}
				/>
			)}
		</>
	);
};

export default TodoNavigation;
