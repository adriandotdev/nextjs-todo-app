import React from "react";

import { Alert, Container, Fade } from "@mui/material";
Container;
const CustomAlert = ({ is_visible, message, severity }) => {
	return (
		<div className="absolute top-5 right-10">
			<Fade in={is_visible}>
				<Alert variant="filled" severity={severity}>
					{message}
				</Alert>
			</Fade>
		</div>
	);
};

export default CustomAlert;
