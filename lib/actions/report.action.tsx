"use server";
import prisma from "@/lib/prisma";
import { Report } from "@prisma/client";

export async function createReport(companyId: string, values: any) {
  const { attendance, rate, diSupNote, name: userId } = values;
  try {
    const report = await prisma.report.create({
      data: {
        userId,
        companyId,
        attendance,
        rate,
        diSupNote,
      },
    });

    return report;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllReports() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: true,
        company: true,
      },
    });
    return reports;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllReportsById(companyId: string) {
  try {
    const reports = await prisma.report.findMany({
      where: {
        companyId,
      },
      include: {
        user: true,
        company: true,
      },
    });

    return reports;
  } catch (error) {
    console.log(error);
  }
}
