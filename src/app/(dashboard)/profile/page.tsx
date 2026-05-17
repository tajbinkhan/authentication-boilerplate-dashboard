import ProfilePage from "@/features/profile/components/profile-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "Profile page of the Next.js boilerplate."
};

export default function Profile() {
	return <ProfilePage />;
}
