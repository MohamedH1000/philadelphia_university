"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Loader } from "rsuite";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    universityNo: z.string(),
    password: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      universityNo: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const loginData = {
      universityNo: values.universityNo,
      password: values.password,
    };

    try {
      setIsLoading(true);
      signIn("credentials", {
        ...loginData,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          toast.success("تم تسجيل دخول الطالب بنجاح");
          router.push("/");
        }

        if (callback?.error) {
          toast.error("حدث خطأ اثناء تسجيل الدخول");
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-[1.5px] px-4 py-8 rounded-[14px] shadow-md max-w-[500px] w-full"
      >
        <h1 className="text-[#003b95] text-center font-bold text-3xl">
          {"بوابة دخول الطالب"}
        </h1>
        <FormField
          control={form.control}
          name="universityNo"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-[22px]">الرقم الجامعي</FormLabel>
              <FormControl>
                <Input
                  placeholder={"قم بادخال الرقم الجامعي"}
                  {...field}
                  className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className="text-[22px]">{"الباسوورد"}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={"الباسوورد"}
                  {...field}
                  className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="w-full rounded-[12px] bg-[#003b95] mt-8 text-white h-[40px] hover:opacity-75 transition duration-300 hover:scale-[1.025] active:scale-[0.95]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size="md" content={`${t("Login.Loading")}`} />
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
        <div className="mt-4 flex justify-center items-center gap-3">
          <p>{"ليس لديك حساب؟"}</p>
          <Link href={"/sign-up"}>
            <p className="font-bold hover:underline">{"قم بتسجيل حساب جديد"}</p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default Login;
