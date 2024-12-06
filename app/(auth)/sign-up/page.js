import React from "react";
// import { getCurrentUser } from "@/lib/actions/user.action";
import Register from "./components/Register";

export const metadata = {
  title: "تسجيل حساب جديد",
  description: "بوابة تسجيل الطالب",
};

const page = async () => {
  // const currentUser = await getCurrentUser();
  // if (currentUser) {
  //   redirect("/");
  // }
  return (
    <div className="flex justify-center items-center min-h-screen w-full mt-[64px] px-5">
      <Register />
    </div>
  );
};

export default page;
