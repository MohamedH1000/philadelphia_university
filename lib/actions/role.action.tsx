"use server";
import prisma from "@/lib/prisma";
export async function updateStudentRole(roleId: string, newRoleValue: string) {
  try {
    const updatedRole = await prisma.role.update({
      where: {
        id: roleId, // Specify which role to update
      },
      data: {
        name: newRoleValue, // Update the value of the role
      },
    });

    return updatedRole; // Return the updated role data
  } catch (error) {
    console.error("Error updating roleStudent:", error);
    throw error;
  }
}
