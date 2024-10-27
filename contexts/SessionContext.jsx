import React, { createContext, useState } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
	// Current user logged in. In this state, the info of the user is being set.
	const [user, setUser] = useState(() => undefined);

	return (
		<SessionContext.Provider value={{ user, setUser }}>
			{children}
		</SessionContext.Provider>
	);
};

export default SessionContext;
