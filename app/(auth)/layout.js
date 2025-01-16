import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }) => {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  if (currentUser) {
    redirect("/");
  }
  return <div>{children}</div>;
};

export default layout;
