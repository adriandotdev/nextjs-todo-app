import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ConfirmationModal = ({
	confirmationModal,
	setConfirmationModal,
	event,
	isConfirmationProgress,
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
				className="bg-white xl:max-w-[30rem] w-full pt-5 px-4 rounded-md flex flex-col justify-between max-h-[10rem] h-full pb-4"
				onClick={(e) => e.stopPropagation()}
			>
				<h1 className="font-semibold text-lg">
					{confirmationModal.confirmation_message}
				</h1>
				<div className="self-end flex">
					<button
						disabled={isConfirmationProgress}
						className="btn-md font-bold bg-red-500 p-2 rounded-md text-white border hover:bg-red-700 transition-all mr-3 w-full min-w-[9rem] disabled:bg-gray-300"
						onClick={event}
					>
						{isConfirmationProgress ? (
							<CircularProgress size={"1rem"} />
						) : (
							confirmationModal.button_confirmation_text
						)}
					</button>
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

export default ConfirmationModal;
