"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "react-select";
import countries from "i18n-iso-countries";
import arLocale from "i18n-iso-countries/langs/ar.json";
import "./register.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createUser } from "@/lib/actions/user.action";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "rsuite";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Select as SelectSpec,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    universityNo: z.string().min(2).max(18),
    birthDate: z.string().datetime(),
    nationalNumber: z.string(),
    nationality: z.string(),
    specialization: z.string(),
    password: z
      .string()
      .min(8, { message: `كلمة المرور لا تقل عن 8 احرف` })
      .max(20, { message: `كلمة المرور لا تزيد عن 20 حرف` }),
    confirmPassword: z
      .string()
      .refine((data) => data.password === data.confirmPassword, {
        message: "الباسوورد غير متطابق",
        path: ["confirmPassword "],
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      universityNo: "",
      birthDate: "",
      nationalNumber: "",
      nationality: "",
      specialization: "",
      password: "",
      confirmPassword: "",
    },
  });

  countries.registerLocale(arLocale);

  const countryOptions = Object.entries(countries.getNames("ar")).map(
    ([code, name]) => ({
      value: code,
      label: name,
    })
  );

  async function onSubmit(values) {
    setError("");
    try {
      setIsLoading(true);
      await createUser(values);
      toast.success(`تم تسجيل الحساب بنجاح`);
      const loginData = {
        universityNo: values.universityNo,
        password: values.password,
      };
      signIn("credentials", {
        ...loginData,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          router.push("/");
        }
      });
    } catch (error) {
      setError(error.message || "An error occurred");
      console.error(error);
      toast("مشكلة في انشاء المستخدم");
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
          {"تسجيل حساب جديد"}
        </h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">{"الاسم"}:</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder={"الاسم"}
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
          name="universityNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">{"الرقم الجامعي"}:</FormLabel>
              <FormControl>
                <Input
                  required
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
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">{"تاريخ الميلاد"}:</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Button
                    variant="outline"
                    className="w-full text-right p-4 rounded-[12px] placeholder:opacity-65"
                    onClick={() => setShowCalendar(!showCalendar)} // Toggles calendar visibility
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString("ar-EG")
                      : "اختر تاريخ الميلاد"}
                  </Button>

                  {showCalendar && (
                    <div className="absolute z-10 mt-2 w-full border rounded-md shadow-lg bg-white">
                      <Calendar
                        onChange={(date) => {
                          setShowCalendar(false); // Close calendar after selection
                          field.onChange(date.toISOString()); // Update the form value
                        }}
                        value={field.value ? new Date(field.value) : null}
                        locale="ar-EG" // Sets the calendar to Arabic
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationalNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">{"الرقم الوطني"}:</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder={"الرقم الوطني"}
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
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">{"الجنسية"}:</FormLabel>
              <FormControl>
                <Select
                  required
                  options={countryOptions}
                  placeholder="اختر الجنسية"
                  value={countryOptions.find(
                    (option) => option.label === field.label
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">{"التخصص"}:</FormLabel>
              <FormControl>
                <SelectSpec required>
                  <SelectTrigger className="w-full" dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="هندسة برمجيات">هندسة برمجيات</SelectItem>
                    <SelectItem value="حاسبات ومعلومات">
                      حاسبات ومعلومات
                    </SelectItem>
                    <SelectItem value="نظم وتكنولوجيا المعلومات">
                      نظم وتكنولوجيا المعلومات
                    </SelectItem>
                  </SelectContent>
                </SelectSpec>
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
                  required
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className="text-[22px]">{"تكرار الباسوورد"}</FormLabel>
              <FormControl>
                <Input
                  required
                  type="password"
                  placeholder={"تاكيد الباسوورد"}
                  {...field}
                  className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Repeat other form fields similarly */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-[12px] bg-[#003b95] text-white mt-8 h-[40px] hover:opacity-75 transition duration-300"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.025 }}
        >
          {isLoading ? (
            <Loader size="md" content={`برجاء الانتظار`} />
          ) : (
            "تسجيل حساب جديد"
          )}
        </motion.button>
        <Separator className="bg-[gray] mt-8" />
        <div className="mt-4 flex justify-center items-center gap-3">
          <p>هل لديك حساب بالفعل؟</p>
          <Link href={"/sign-in"}>
            <p className="font-bold hover:underline">تسجيل الدخول</p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default Register;
