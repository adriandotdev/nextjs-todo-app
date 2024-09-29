import React from "react";

import "@styles/globals.css";
const RootLayout = ({ children }) => {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;
