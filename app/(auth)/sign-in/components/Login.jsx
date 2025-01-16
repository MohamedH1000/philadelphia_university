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
          toast.success("تم تسجيل الدخول بنجاح");
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
    <div className="min-h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-lg p-6 sm:p-10 max-w-md w-full border border-gray-200"
        >
          <h1 className="text-blue-900 text-center font-extrabold text-2xl sm:text-3xl mb-6">
            بوابة دخول الطالب
          </h1>
          <FormField
            control={form.control}
            name="universityNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700">
                  الرقم الجامعي
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="قم بادخال الرقم الجامعي"
                    {...field}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
              <FormItem className="mt-4">
                <FormLabel className="text-lg font-medium text-gray-700">
                  الباسوورد
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="الباسوورد"
                    {...field}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size="md" content="جاري التحميل..." />
            ) : (
              "تسجيل الدخول"
            )}
          </button>
          <div className="mt-6 flex justify-center text-sm text-gray-600">
            <p>ليس لديك حساب؟</p>
            <Link href="/sign-up">
              <p className="ml-1 font-bold text-blue-600 hover:underline">
                قم بتسجيل حساب جديد
              </p>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
