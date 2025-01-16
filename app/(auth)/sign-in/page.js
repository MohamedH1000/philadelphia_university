import React from "react";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import Login from "./components/Login";

export const metadata = {
  title: "بوابة دخول الطالب",
  description: "بوابة دخول",
};

const page = async () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full mt-[64px] px-5">
      <Login />
    </div>
  );
};

export default page;
