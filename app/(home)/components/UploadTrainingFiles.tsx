"use client";

import { Button } from "@/components/ui/button";
import {
  createRequest,
  createRequestTraining,
} from "@/lib/actions/request.action";
import { User } from "@prisma/client";
import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function UploadTrainingFiles({ user }: User) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]); // State for multiple files

  return (
    <div className="">
      <h1>قم برفع الملفات وارسال الطلب</h1>

      <form
        className="mt-10"
        onSubmit={async (event) => {
          event.preventDefault();

          if (
            !inputFileRef.current?.files ||
            inputFileRef.current.files.length === 0
          ) {
            throw new Error("No files selected");
          }

          const files = Array.from(inputFileRef.current.files); // Convert FileList to an array
          const uploadedBlobs: PutBlobResult[] = [];
          const newFileUrls: string[] = [];

          try {
            for (const file of files) {
              const response = await fetch(
                `/api/avatar/upload?filename=${file.name}`,
                {
                  method: "POST",
                  body: file,
                }
              );

              const newBlob = (await response.json()) as PutBlobResult;
              newFileUrls.push(newBlob.url);

              // Create a request for each uploaded file
              await createRequestTraining(user.id, newFileUrls);
            }

            setBlobs(uploadedBlobs);
            toast.success("تم ارسال الطلب بنجاح لجميع الملفات");
          } catch (error) {
            console.log(error);
            toast.error("حدث خطأ أثناء رفع الملفات");
          }
        }}
      >
        <input name="files" ref={inputFileRef} type="file" multiple required />
        <Button type="submit">ارسال الطلب</Button>
      </form>

      {blobs.length > 0 && (
        <div>
          <h2>روابط الملفات:</h2>
          <ul>
            {blobs.map((blob, index) => (
              <li key={index}>
                <a href={blob.url} target="_blank" rel="noopener noreferrer">
                  {blob.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
