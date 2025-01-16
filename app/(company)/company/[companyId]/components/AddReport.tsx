"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Company, User } from "@prisma/client";
import { CirclePlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createReport } from "@/lib/actions/report.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { daysOfWeek, rates, rateColumns } from "@/constants/constants";

const formSchema = z.object({
  name: z.string(),
  attendance: z.record(z.boolean()),
  rate: z.object({}),
  diSupNote: z.string().min(3).max(180),
});
interface Props {
  students: User[];
  company: Company[];
}
const AddReport = ({ students, company }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      attendance: daysOfWeek.reduce(
        (acc, day) => ({ ...acc, [day]: false }),
        {}
      ),
      rate: Object.keys(rates).reduce(
        (acc, key) => ({ ...acc, [key]: "" }),
        {}
      ),
      diSupNote: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const realTimeValues = form.getValues();
    // console.log(realTimeValues);
    setIsLoading(true);
    try {
      await createReport(company?.id, realTimeValues);
      toast.success("تم ارسال التقرير بنجاح");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء ارسال التقرير");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }
  const handleSelect = (studentId: string) => {
    form.setValue("name", studentId);
  };
  //   console.log("Form Values:", form.watch());

  return (
    <Dialog open={open} onOpenChange={(prev) => setOpen(prev)}>
      <DialogTrigger className="bg-primary text-white rounded-md p-2 font-bold flex gap-2">
        <CirclePlus /> اضف تقرير للطالب
      </DialogTrigger>
      <DialogContent className="h-[700px] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={handleSelect} dir="rtl">
                    <SelectTrigger className="w-[180px]" className="mt-5">
                      <SelectValue placeholder="اختر اسم الطالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student: User) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الحضور</FormLabel>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 px-4 py-2 text-right">
                            اليوم
                          </th>
                          <th className="border border-gray-200 px-4 py-2 text-right">
                            الحضور
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {daysOfWeek.map((day) => (
                          <tr key={day}>
                            <td className="border border-gray-200 px-4 py-2">
                              {day}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              <input
                                type="checkbox"
                                checked={field.value[day]}
                                onChange={(e) => {
                                  const updatedAttendance = {
                                    ...field.value,
                                    [day]: e.target.checked,
                                  };
                                  field.onChange(updatedAttendance); // Use field.onChange to notify react-hook-form of the update
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تقييم الطالب</FormLabel>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 px-4 py-2 text-right">
                            المعايير
                          </th>
                          {rateColumns.map((column) => (
                            <th
                              key={column}
                              className="border border-gray-200 px-4 py-2 text-center"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(rates).map((criterion) => (
                          <tr key={criterion}>
                            <td className="border border-gray-200 px-4 py-2 text-right">
                              {criterion}
                            </td>
                            {rateColumns.map((column) => (
                              <td
                                key={`${criterion}-${column}`}
                                className="border border-gray-200 px-4 py-2 text-center"
                              >
                                <input
                                  type="radio"
                                  name={criterion} // Ensure unique grouping for each row
                                  checked={field.value[criterion] === column}
                                  onChange={() => {
                                    // Ensure that onChange properly updates the `rate` field
                                    const updatedRate = {
                                      ...field.value,
                                      [criterion]: column,
                                    };
                                    field.onChange(updatedRate); // Update form state
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diSupNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    ملاحظة الرئيس المباشر
                  </FormLabel>
                  <Textarea
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري ارسال التقرير" : "ارسال التقرير"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReport;
