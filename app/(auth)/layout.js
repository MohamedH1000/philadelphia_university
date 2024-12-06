import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }) => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/");
  }
  return <div>{children}</div>;
};

export default layout;
