"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";

const SignOut = () => {
  return (
    <DropdownMenuItem>
      <form>
        <button
          type="submit"
          onClick={() => {
            signOut();
            toast.success("تم تسجيل الخروج بنجاح");
          }}
        >
          تسجيل الخروج
        </button>
      </form>
    </DropdownMenuItem>
  );
};

export default SignOut;
