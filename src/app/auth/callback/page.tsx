import { handleAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const AuthCallbackPage = async (props: Props) => {
  // Authentication
  const auth = await handleAuthenticateUser();

  if (auth.status === 200 || auth.status === 201) {
  
    return redirect(`/dashboard/${auth.user?.firstname}${auth.user?.lastname}`);
  }

  if (auth.status === 500 || auth.status === 400 || auth.status === 404) {
   
    return redirect("/auth/sign-in");
  }

  // const { user } = useUser()
  return <div>AuthCallbackPage</div>;
};

export default AuthCallbackPage;
