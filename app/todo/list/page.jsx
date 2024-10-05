"use client";
import React, { useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import Todo from "@components/Todo";

const TodoListPage = () => {
	const [todos, setTodos] = useState([
		{ title: "Task 1", priority: "medium" },
		{ title: "Task 2", priority: "high" },
		{ title: "Task 3", priority: "low" },
	]);
	const [draggedElement, setDraggedElement] = useState(null);
	const container = useRef(null);

	const GetDragAfterElement = (container, y) => {
		const draggableElements = [
			...container.querySelectorAll(".draggable:not(.dragging)"),
		];

		return draggableElements.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();
				const offset = y - box.top - box.height / 2;

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{ offset: Number.NEGATIVE_INFINITY }
		).element;
	};

	const OnDragOver = (e) => {
		e.preventDefault();

		const afterElement = GetDragAfterElement(container.current, e.clientY);

		if (afterElement === null) {
			container.current.appendChild(draggedElement);
		} else {
			container.current.insertBefore(draggedElement, afterElement);
		}
	};

	return (
		<div className="flex justify-center items-center flex-col">
			<div className="mt-5 flex gap-3 justify-between w-full max-w-[30rem]">
				<h1 className="text-3xl font-sans font-bold">My To-Do</h1>
				<IconButton color="primary" aria-label="add">
					<AddIcon />
				</IconButton>
			</div>
			<div
				ref={container}
				className="container max-w-[30rem] w-[30rem]"
				onDragOver={OnDragOver}
			>
				{todos.map((todo) => (
					<Todo todo={todo.title} setDraggedElement={setDraggedElement} />
				))}
			</div>
		</div>
	);
};

export default TodoListPage;
