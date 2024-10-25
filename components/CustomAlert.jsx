import React from "react";

import { Alert, Container, Fade } from "@mui/material";
Container;
const CustomAlert = ({ is_visible, message, severity }) => {
	return (
		<div className="fixed top-8 left-5 min-w-[12rem] shadow-2xl">
			<Fade in={is_visible}>
				<Alert variant="filled" severity={severity}>
					{message}
				</Alert>
			</Fade>
		</div>
	);
};

export default CustomAlert;
