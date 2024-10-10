import { redirect, RedirectType } from "next/navigation";
import React from "react";

const RootPage = () => {
	return redirect("/signin", RedirectType.replace);
};

export default RootPage;
