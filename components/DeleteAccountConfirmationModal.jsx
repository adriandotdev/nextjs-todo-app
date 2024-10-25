"use client";

import { CircularProgress } from "@mui/material";
import { useState } from "react";

const DeleteAccountConfirmationModal = ({
	confirmationModal,
	setConfirmationModal,
	event,
	isConfirmationProgress,
	user,
}) => {
	const CloseModal = () => {
		setConfirmationModal({
			...confirmationModal,
			is_visible: false,
			button_confirmation_text: "",
			confirmation_message: "",
			event: null,
		});
	};

	const [confirmationName, setConfirmationName] = useState(() => "");
	const [showConfirmationButton, setShowConfirmationButton] = useState(
		() => false
	);

	return (
		<div
			className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-25 flex justify-center items-end z-10 lg:items-center"
			onClick={() =>
				setConfirmationModal({
					...confirmationModal,
					is_visible: false,
					confirmation_message: "",
					button_confirmation_text: "",
					event: null,
				})
			}
		>
			<div
				className="bg-white lg:max-w-[30rem] xl:max-w-[30rem] w-full pt-5 px-4 rounded-md flex flex-col max-h-[14rem] h-full pb-4 gap-3"
				onClick={(e) => e.stopPropagation()}
			>
				<h1 className="font-bold text-lg text-red-500">
					{confirmationModal.confirmation_message}
				</h1>
				<p className="font-medium text-red-500">
					Please type
					<span className="font-bold text-red-800"> {user.name}</span> to
					confirm
				</p>

				<input
					className="input input-bordered input-error font-semibold placeholder:text-red-300"
					type="text"
					onChange={(e) => {
						setConfirmationName(e.target.value);
						if (e.target.value) setShowConfirmationButton(true);
						else setShowConfirmationButton(false);
					}}
					placeholder="Please confirm your account deletion"
				/>
				<div className="self-end flex">
					{showConfirmationButton ? (
						<button
							disabled={isConfirmationProgress}
							className="btn-md font-bold bg-red-500 p-2 rounded-md text-white border hover:bg-red-700 transition-all mr-3 w-full min-w-[9rem] disabled:bg-gray-300"
							onClick={() => {
								if (user.name !== confirmationName) {
									console.log("Invalid");
									return;
								}

								event();
							}}
						>
							{isConfirmationProgress ? (
								<CircularProgress size={"1rem"} />
							) : (
								confirmationModal.button_confirmation_text
							)}
						</button>
					) : (
						<button
							disabled
							className="btn-md font-bold bg-red-500 p-2 rounded-md text-white border hover:bg-red-700 transition-all mr-3 w-full min-w-[9rem] disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							{confirmationModal.button_confirmation_text}
						</button>
					)}
					<button
						className="btn border-slate-100 p-2 rounded-md text-slate-950 border  transition-all"
						onClick={CloseModal}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteAccountConfirmationModal;
