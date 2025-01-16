"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addCompany } from "@/lib/actions/company.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(5).max(50),
  traSupViNa: z.string().min(3).max(10),
  traActAr: z.string().min(10).max(300),
  location: z.string().min(2).max(20),
  email: z.string().email(),
});

const AddCompany = ({ currentUser }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      traSupViNa: "",
      traActAr: "",
      location: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    setIsLoading(true);
    try {
      await addCompany(currentUser, values);
      toast.success("تم اضافة الشركة بنجاح");
      form.reset();
      setIsDialogOpen(false); // Close the dialog on success
    } catch (error) {
      console.log(error);
      toast.error("حدثت مشكلة اثناء اضافة الشركة");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger className="mt-5 shadow-md text-md rounded-lg bg-primary text-white p-4">
          إضافة شركة <ControlPointIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">إضافة شركة</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الشركة</FormLabel>
                    <FormControl>
                      <Input placeholder="الاسم" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="traSupViNa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المسؤول عن التدريب</FormLabel>
                    <FormControl>
                      <Input placeholder="المسؤول عن التدريب" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="traActAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مجال النشاط التدريبي</FormLabel>
                    <FormControl>
                      <Input placeholder="مجال نشاط التدريب" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مكان الشركة</FormLabel>
                    <FormControl>
                      <Input placeholder="المكان" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>للتواصل عبر الايميل:</FormLabel>
                    <FormControl>
                      <Input placeholder="ايميل الشركة" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="mt-5"
              disabled={isLoading}
            >
              {isLoading ? "جاري الإرسال..." : "قم بإضافة الشركة"}
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCompany;
