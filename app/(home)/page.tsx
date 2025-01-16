import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import SignOut from "./components/SignOut";
import { getAllCompanies } from "@/lib/actions/company.action";
import AddCompany from "./components/AddCompany";
import { Company } from "@prisma/client";
import RequestTraining from "./components/RequestTraining";

export default async function Home() {
  const companies = await getAllCompanies();
  const currentUser = await getCurrentUser();
  // console.log(currentUser);
  // console.log(companies);
  if (!currentUser) {
    redirect("/sign-in");
  }

  if (currentUser.role.name === "university") {
    redirect("/dashboard");
  }
  if (currentUser.role.name === "company") {
    redirect("/company");
  }

  const activeCompanies = companies.filter(
    (company: Company) => company.status === "active"
  );

  const dateObject = new Date(currentUser?.birthDate);

  const formattedDate = dateObject.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-1 flex-col items-center">
      {/* بيانات الطالب */}
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
        <SignOut />
      </div>
      {/* الشركات الموجودة */}
      <div className="mt-10 w-[90%]">
        <h1 className="font-bold text-3xl text-right w-full">
          الشركات الموجودة
        </h1>

        {activeCompanies?.length > 0 && activeCompanies ? (
          <RequestTraining
            activeCompanies={activeCompanies}
            currentUser={currentUser}
          />
        ) : (
          <div className="mt-10">
            <h1 className="font-bold text-3xl text-[red]">
              لا يوجد شركات متوفرة الان
            </h1>
          </div>
        )}
        <AddCompany currentUser={currentUser} />
      </div>
    </div>
  );
}
