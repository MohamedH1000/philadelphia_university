"use server";
import prisma from "@/lib/prisma";
import { Company, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";

export async function getAllCompanies() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        user: true,
      },
    });

    return companies;
  } catch (error) {
    console.log(error);
  }
}

export async function getCompanyById(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    return company;
  } catch (error) {
    console.log(error);
  }
}

export async function requestAddCompany(
  userId: string,
  companyDetails: Company
) {
  const currentUser = await getCurrentUser();

  const { name, email, location, traActAr } = companyDetails;

  if (currentUser?.role.name !== "student") {
    throw new Error("the request should be by the student");
  }

  try {
    const requestAdd = await prisma.company.create({
      data: {
        name,
        email,
        userId,
        location,
        traActAr,
      },
    });
    return requestAdd;
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/");
}

export async function acceptCompany(companyId: string) {
  try {
    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        status: "active",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
export async function rejectCompany(companyId: string) {
  try {
    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        status: "rejected",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function addCompany(user: User, companyDetails: Company) {
  const { name, email, location, traActAr } = companyDetails;

  if (user.role.name !== "university") {
    throw new Error("The role should be university");
  }
  try {
    const addCompany = await prisma.company.create({
      data: {
        name,
        email,
        userId: user.id,
        location,
        traActAr,
        status: "active",
      },
    });

    return addCompany;
  } catch (error) {
    console.log(error);
  }
}
