import TodoNavigation from "@components/TodoNavigation";
import React from "react";

const TodoLayout = ({ children }) => {
	return (
		<>
			<nav className="bg-slate-900">
				<TodoNavigation />
			</nav>
			<main>{children}</main>
		</>
	);
};

export default TodoLayout;
