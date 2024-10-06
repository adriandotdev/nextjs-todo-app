"use client";

import { CircularProgress, IconButton } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

const AddTodoModal = ({ setModal }) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const AddNewTodo = (data) => {
		console.log(errors);
	};

	const CloseModal = (e) => {
		e.stopPropagation();

		setModal(false);
	};

	return (
		<div
			className="bg-black bg-opacity-20 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-end lg:items-center"
			onClick={CloseModal}
		>
			<div
				className="lg:max-w-[25rem] w-full p-3 bg-white rounded-md"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between">
					<h1 className="font-bold text-xl lg:text-2xl xl:text-2xl">
						What's your new To-Do?
					</h1>
					<IconButton
						color="error"
						aria-label="close"
						onClick={() => setModal(false)}
					>
						<CloseIcon />
					</IconButton>
				</div>

				<form
					onSubmit={handleSubmit(AddNewTodo)}
					className="flex flex-col gap-4 w-full mt-3"
				>
					<section className="flex flex-col gap-1">
						<label className="font-medium" htmlFor="title">
							Title
						</label>
						<input
							{...register("title", {
								required: "Please provide a title",
								maxLength: {
									value: 25,
									message: "Title must be maximum of 8 characters",
								},
							})}
							className={`p-2 border ${
								errors.title?.message
									? "border-red-500 outline-red-500"
									: "border outline-black"
							}`}
							type="text"
							name="title"
							id="title"
							placeholder="Ex. wash the dishes"
						/>
						{errors.title?.message && (
							<small className={errors.title?.message && "text-red-500"}>
								{errors.title?.message}
							</small>
						)}
					</section>

					<section className="flex flex-col gap-1">
						<label className="font-medium" htmlFor="priority">
							Priority Level
						</label>

						<select
							{...register("priority", { required: true })}
							className="border p-2"
							name="priority"
							id="priority"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</section>

					<button
						disabled={isSubmitting}
						className="font-bold bg-slate-900 text-white p-3 mt-3 cursor-pointer hover:bg-slate-800 transition-all active:scale-110 active:bg-slate-600 rounded-md"
					>
						{isSubmitting ? <CircularProgress size={"1em"} /> : "Add"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddTodoModal;
