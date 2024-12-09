"use server";
import prisma from "@/lib/prisma";

export async function createRequest(userId: string, fileUrl: string) {
  try {
    // Check if a request already exists for the user
    const existingRequest = await prisma.request.findUnique({
      where: {
        userId,
      },
    });

    if (existingRequest) {
      // Update the existing request
      const updatedRequest = await prisma.request.update({
        where: {
          id: existingRequest.id,
        },
        data: {
          file: fileUrl,
          admission: "معلق",
        },
      });
      return updatedRequest;
    } else {
      // Create a new request
      const newRequest = await prisma.request.create({
        data: {
          file: fileUrl,
          userId,
          admission: "معلق",
        },
      });
      return newRequest;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create or update the request.");
  }
}

export async function createRequestTraining(
  userId: string,
  fileUrls: string[]
) {
  try {
    // Check if a request already exists for the user
    const existingRequest = await prisma.requestTraining.findUnique({
      where: { userId },
    });

    if (existingRequest) {
      // Update the existing request with new file URLs (replace the array)
      const updatedRequest = await prisma.requestTraining.update({
        where: { userId },
        data: {
          file: fileUrls,
          admission: "معلق",
        },
      });
      return updatedRequest;
    } else {
      // Create a new request with the file URLs
      const newRequest = await prisma.requestTraining.create({
        data: {
          userId,
          file: fileUrls,
          admission: "معلق",
        },
      });
      return newRequest;
    }
  } catch (error) {
    console.error("Error in createRequestTraining:", error);
    throw new Error("Failed to create or update the request.");
  }
}

export async function updateRequestAdmission(userId: string, value: string) {
  try {
    const updatedAdmission = await prisma.request.update({
      where: {
        userId,
      },
      data: {
        admission: value,
      },
    });
    return updatedAdmission;
  } catch (error) {
    console.log(error);
  }
}
export async function updateTrainingRequestAdmission(
  userId: string,
  value: string
) {
  try {
    const updatedAdmission = await prisma.requestTraining.update({
      where: {
        userId,
      },
      data: {
        admission: value,
      },
    });
    return updatedAdmission;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllRequests() {
  try {
    const requests = await prisma.request.findMany({
      include: {
        user: {
          include: {
            roleStudent: true,
          },
        },
      },
    });
    return requests;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllTrainingRequests() {
  try {
    const requests = await prisma.requestTraining.findMany({
      include: {
        user: {
          include: {
            roleStudent: true,
          },
        },
      },
    });
    return requests;
  } catch (error) {
    console.log(error);
  }
}
