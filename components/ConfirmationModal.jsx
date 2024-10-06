import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const ConfirmationModal = ({ confirmationModal, setConfirmationModal }) => {
	const router = useRouter();

	const CloseModal = () => {
		setConfirmationModal({
			...confirmationModal,
			is_visible: false,
			confirmation_message: "",
		});
	};

	const Logout = async () => {
		await axios.get("/api/users/logout");

		router.push("/signin");
	};
	return (
		<div
			className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-25 flex justify-center items-end z-10 lg:items-center"
			onClick={() =>
				setConfirmationModal({
					...confirmationModal,
					is_visible: false,
					confirmation_message: "",
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
				<div className="self-end">
					<button
						className="bg-red-500 p-2 rounded-md text-white border hover:bg-red-700 transition-all mr-3"
						onClick={Logout}
					>
						Sign Out
					</button>
					<button
						className="border-slate-100 p-2 rounded-md text-slate-950 border  transition-all"
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
