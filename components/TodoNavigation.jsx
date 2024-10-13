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
			<ul className="text-white flex gap-5 px-2 py-5 justify-end items-center lg:px-10">
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
