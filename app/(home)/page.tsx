import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import SignOut from "./components/SignOut";
import UploadForm from "./components/UploadForm";
import DownloadPdf from "./components/DownloadPdf";
import DownloadTrainingPdf from "./components/DownloadTrainingPdf";
import UploadTrainingFiles from "./components/UploadTrainingFiles";

export default async function Home() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  if (currentUser.role === "admin") {
    redirect("/dashboard");
  }

  // console.log(currentUser);
  const dateObject = new Date(currentUser?.birthDate);

  const formattedDate = dateObject.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="w-[90%] bg-gray-400 grid grid-cols-3 h-auto mt-20 px-7 py-3 rounded-md gap-y-4 max-md:grid-cols-1">
        {" "}
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">الاسم:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser?.name}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">الرقم الجامعي:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser?.uniNumber}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">تاريخ الميلاد:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {formattedDate}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">
            الرقم الوطني/ الشخصي:
          </p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser?.nationalNumber}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">الجنسية:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser?.nationality}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">التخصص:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser?.specialization}
          </span>
        </div>
        <SignOut onClick />
      </div>

      {currentUser.roleStudent[0].name === "مقدم" && (
        <>
          <div className="w-[90%] bg-gray-400 grid grid-cols-4 h-auto mt-5 px-7 py-3 rounded-md">
            {" "}
            <p className="text-[#2b3e96] text-3xl font-bold text-shadow-lg">
              القبول الاكاديمي
            </p>
          </div>
          <div className="mt-10 font-bold text-3xl">
            <h1>برجاء الانتظار حتى يتم قبولك اكاديميا</h1>
          </div>
        </>
      )}
      {/* تقديم الملفات */}
      {currentUser.roleStudent[0].name === "مقبول" && (
        <>
          <div className="w-[90%] bg-gray-400 grid grid-cols-4 h-auto mt-5 px-7 py-3 rounded-md">
            {" "}
            <p className="text-[#2b3e96] text-3xl font-bold text-shadow-lg">
              القبول الاكاديمي
            </p>
          </div>
          <div className="mt-10 text-3xl font-bold w-[90%]">
            <h1 className="mt-10">تم القبول اكاديميا</h1>
            <h1>قم بتنزيل الملف وتعبئته ثم قم برفعه</h1>
            <DownloadPdf />
            <div className="mt-10">
              <UploadForm user={currentUser} />
            </div>
          </div>
        </>
      )}
      {currentUser.roleStudent[0].name === "تم القبول في التدريب" && (
        <>
          <div className="w-[90%] bg-gray-400 grid grid-cols-4 h-auto mt-5 px-7 py-3 rounded-md">
            {" "}
            <p className="text-[#2b3e96] text-3xl font-bold text-shadow-lg">
              التدريب الميداني
            </p>
          </div>
          <div className="my-10 text-3xl font-bold w-[90%]">
            <h1 className="mt-5">تم قبولك في التدريب الميداني</h1>
            <h1 className="mt-5">
              قم بتنزيل الملفات الخاصة بالتدريب ورفعها عند الانتهاء
            </h1>
            <DownloadTrainingPdf />
            <div className="mt-10">
              <UploadTrainingFiles user={currentUser} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
