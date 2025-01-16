"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const SignOut = () => {
  const handleClick = () => {
    signOut();
    toast.success("تم تسجيل الخروج بنجاح");
  };
  return (
    <Button onClick={handleClick} className="mt-5 text-xl font-bold w-[250px]">
      تسجيل الخروج
    </Button>
  );
};

export default SignOut;
