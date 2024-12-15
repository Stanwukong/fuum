import { handleAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const DashboardPage = async (props: Props) => {
  // Authentication
  const auth = await handleAuthenticateUser();

  if (auth.status === 200 || auth.status === 201) {
    // Redirect to login page
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (auth.status === 500 || auth.status === 400 || auth.status === 404) {
    // Redirect to login page
    return redirect("/auth/sign-in");
  }

  // const { user } = useUser()
  return <div>DashboardPage</div>;
};

export default DashboardPage;
