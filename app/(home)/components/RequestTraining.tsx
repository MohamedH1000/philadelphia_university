"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createRequestTraining } from "@/lib/actions/request.action";
import toast from "react-hot-toast";

const RequestTraining = ({ activeCompanies, currentUser }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const requestTraining = async (companyId: string) => {
    setIsLoading(true);
    try {
      await createRequestTraining(currentUser.id, companyId);
      toast.success("تم ارسال طلب تدريبك في الشركة بنجاح");
    } catch (error) {
      console.log(error);
      toast.error("حصل خطأ اثناء ارسال طلب التدريب");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex items-start justify-center gap-4 mt-5">
      {activeCompanies?.map((company: Company) => (
        <Sheet key={company.id}>
          <SheetTrigger className="rounded-md shadow-md font-bold text-2xl px-10 py-3 w-[300px] text-center">
            {company.name}
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle className="text-right mt-5 font-bold text-3xl">
                بيانات الشركة
              </SheetTitle>
              <div className="mt-5 flex flex-col items-start justify-center gap-3 w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h2 className="font-bold">اسم الشركة:</h2>
                    <p>{company.name}</p>
                  </div>
                  <div>
                    <h2 className="font-bold">للتواصل عبر الايميل التالي:</h2>
                    <p>{company.email}</p>
                  </div>
                </div>
                <h2 className="font-bold">مجال النشاط التدريبي:</h2>
                <p>{company.traActAr}</p>
                <h2 className="font-bold">المكان:</h2>
                <p>{company.location}</p>
              </div>
              <Button
                className="w-[300px] max-md:w-full"
                onClick={() => requestTraining(company.id)}
                disabled={isLoading}
              >
                {isLoading ? "جاري إرسال الطلب" : "قدم طلب التدريب"}
              </Button>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
};

export default RequestTraining;
