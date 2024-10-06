import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { IconButton } from "@mui/material";

const Todo = ({ todo, setDraggedElement }) => {
	const OnDragStart = (e) => {
		setDraggedElement(e.target);
		e.target.classList.add("opacity-50", "dragging");
	};

	const OnDragEnd = (e) => {
		setDraggedElement(null);
		e.target.classList.remove("opacity-50", "dragging");
	};

	return (
		<div
			className="draggable bg-white flex justify-between items-center gap-3 border border-gray-200 p-2 max-w-[30rem] w-full mt-5 cursor-move "
			draggable="true"
			onDragStart={OnDragStart}
			onDragEnd={OnDragEnd}
		>
			<p className="font-semibold">{todo}</p>
			<section className="flex">
				<IconButton color="error" aria-label="delete">
					<DeleteIcon />
				</IconButton>
				<IconButton color="primary" aria-label="delete">
					<EditIcon />
				</IconButton>
				<IconButton color="success" aria-label="delete">
					<DoneIcon />
				</IconButton>
			</section>
		</div>
	);
};

export default Todo;
