"use client";

import React, { useState } from "react";

import Link from "next/link";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import axios from "axios";

const TodoNavigation = () => {
	const router = useRouter();

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

	return (
		<>
			<div className="flex justify-between items-center px-5 py-3">
				<h1 className="font-bold text-orange-300">User</h1>
				<ul className="text-white flex gap-5 justify-end items-center">
					<li>
						<Link href="/todo/list">Todo</Link>
					</li>
					<li>
						<Link href="/notes">Notes</Link>
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
