import React from "react";

import "@styles/globals.css";
const RootLayout = ({ children }) => {
	return (
		<html data-theme="light">
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;
