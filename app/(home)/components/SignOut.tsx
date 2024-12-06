"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface SignOutProps {
  onClick?: () => void; // Optional onClick function passed from the parent
}
const SignOut = ({ onClick }: SignOutProps) => {
  const handleClick = () => {
    signOut();
    toast.success("تم تسجيل الخروج بنجاح");

    // Call the onClick function passed from the parent
    if (onClick) {
      onClick();
    }
  };
  return (
    <Button onClick={handleClick} className="mt-5 text-xl font-bold w-[250px]">
      تسجيل الخروج
    </Button>
  );
};

export default SignOut;
