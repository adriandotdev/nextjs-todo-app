import { redirect, RedirectType } from "next/navigation";

const TodoPage = () => {
	return redirect("/todo/list", RedirectType.replace);
};

export default TodoPage;
