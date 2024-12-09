"use client";

import { Button } from "@/components/ui/button";
import { createRequest } from "@/lib/actions/request.action";
import { User } from "@prisma/client";
import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function UploadForm({ user }: User) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <div className="">
      <h1>قم برفع الملف وارسال الطلب</h1>

      <form
        className="mt-10"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          const response = await fetch(
            `/api/avatar/upload?filename=${file.name}`,
            {
              method: "POST",
              body: file,
            }
          );

          const newBlob = (await response.json()) as PutBlobResult;
          console.log(newBlob);

          setBlob(newBlob);
          try {
            const request = await createRequest(user.id, newBlob.url);
            toast.success("تم ارسال الطلب بنجاح");
            console.log(request);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <Button type="submit">ارسال الطلب</Button>
      </form>
      {blob && (
        <div>
          رابط الملف: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </div>
  );
}
