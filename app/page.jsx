import { redirect, RedirectType } from "next/navigation";
import React from "react";

const RootPage = () => {
	return redirect("/signup", RedirectType.replace);
};

export default RootPage;
