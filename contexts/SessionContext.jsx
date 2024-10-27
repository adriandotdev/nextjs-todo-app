import React, { createContext, useState } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
	const [user, setUser] = useState(() => undefined);

	return (
		<SessionContext.Provider value={{ user, setUser }}>
			{children}
		</SessionContext.Provider>
	);
};

export default SessionContext;
