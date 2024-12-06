import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import SignOut from "./components/SignOut";

export default async function Home() {
  const currentUser = await getCurrentUser();
  // console.log("current user", currentUser);
  if (!currentUser) {
    redirect("/sign-in");
  }

  if (currentUser.role === "admin") {
    redirect("/admin");
  }
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
            {currentUser.name}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">الرقم الجامعي:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser.uniNumber}
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
            {currentUser.nationalNumber}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">الجنسية:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser.nationality}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p className="font-bold text-lg max-md:text-[15px]">التخصص:</p>
          <span className="text-[#d9341d] font-bold text-xl max-md:text-[15px]">
            {currentUser.specialization}
          </span>
        </div>
        <SignOut onClick />
      </div>
      <div className="w-[90%] bg-gray-400 grid grid-cols-4 h-auto mt-5 px-7 py-3 rounded-md">
        {" "}
        <p className="text-[#2b3e96] text-3xl font-bold text-shadow-lg">
          التدريب الميداني
        </p>
      </div>
      <div className=""></div>
    </div>
  );
}
