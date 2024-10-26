import UpdateProfileForm from "@components/UpdateProfileForm";

const ProfilePage = () => {
	return (
		<>
			<div className="flex flex-col items-center justify-center  w-full h-full pt-12 gap-3 pb-12 px-7">
				<h1 className="text-3xl font-bold font-[Poppins] text-orange-500">
					Profile
				</h1>
				<UpdateProfileForm />
			</div>
		</>
	);
};

export default ProfilePage;
