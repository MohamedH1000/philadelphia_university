"use client";
import { Company } from "@prisma/client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const CompanySelect = ({ companies }: any) => {
  const router = useRouter();

  const handleSelect = (companyId: string) => {
    router.push(`/company/${companyId}`);
  };
  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="اختر الشركة" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company: Company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanySelect;
