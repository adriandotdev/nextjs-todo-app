"use client";

import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import AddTodoModal from "./AddTodoModal";
import Todo from "./Todo";
import axios from "axios";

const TodoList = () => {
	// State of list of todos
	const [todos, setTodos] = useState(() => []);

	// State for opening the AddTodoModal.
	const [modal, setModal] = useState(() => false);

	// State for knowing which todo element is dragged by the user.
	const [draggedElement, setDraggedElement] = useState(null);

	// Container of the todo to drag over.
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

	const apiClient = axios.create({
		baseURL: "http://localhost:3000",
		headers: {
			"Content-Type": "application/json",
		},
	});

	useEffect(() => {
		async function GetTodos() {
			apiClient.interceptors.response.use(
				(response) => {
					return response;
				},
				async (error) => {
					if (error.status === 401) {
						const result = await apiClient.get("/api/refresh");
					}
				}
			);

			const result = await apiClient.get("/api/todos");

			setTodos(result.data.data);
		}

		GetTodos();
	}, []);

	return (
		<>
			<div className="mt-5 flex gap-3 justify-between w-full max-w-[30rem]">
				<h1 className="text-3xl font-sans font-bold">My To-Do</h1>
				<IconButton
					color="primary"
					aria-label="add"
					onClick={() => setModal(true)}
				>
					<AddIcon />
				</IconButton>
			</div>
			<div
				ref={container}
				className="container max-w-[30rem]"
				onDragOver={OnDragOver}
			>
				{todos.map((todo) => (
					<Todo
						key={todo.id}
						todo={todo.title}
						setDraggedElement={setDraggedElement}
					/>
				))}
			</div>
			{modal && <AddTodoModal setModal={setModal} />}
		</>
	);
};

export default TodoList;
