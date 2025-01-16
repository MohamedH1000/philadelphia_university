"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.universityNo) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        uniNumber: session.user.universityNo as string,
      },
      include: {
        role: true,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error: any) {
    return null;
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        uniNumber: true,
        role: true,
        specialization: true,
        nationality: true,
        nationalNumber: true,
        birthDate: true,
        createdAt: true,
        hashedPassword: false, // Include the related roles
      },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      birthDate: user.birthDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      createdAt: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    return formattedUsers;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(userData: any) {
  try {
    const {
      name,
      birthDate,
      nationalNumber,
      nationality,
      specialization,
      universityNo,
      password,
    } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        uniNumber: universityNo,
        birthDate,
        nationalNumber,
        nationality,
        specialization,
        hashedPassword,
      },
    });

    return user;
  } catch (e: any) {
    throw new Error(e);
  }
}
