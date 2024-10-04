import React from "react";

const TodoLayout = ({ children }) => {
	return (
		<>
			<nav className="bg-slate-900">
				<ul className="text-white flex gap-5 px-10 py-5 justify-end">
					<li>Todo</li>
					<li>Notes</li>
				</ul>
			</nav>
			<main>{children}</main>
		</>
	);
};

export default TodoLayout;
