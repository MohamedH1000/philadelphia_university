import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestTable from "../components/RequestTable";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "admin") {
    redirect("/");
  }
  async function getData(): Promise<any[]> {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      // ...
    ];
  }

  const data = await getData();
  return (
    <div className="w-full flex flex-col justify-center items-center px-[150px] max-md:px-[5px]">
      <div className="bg-gray-400  h-auto mt-5 px-7 py-3 rounded-md w-full">
        {" "}
        <p className="text-[#2b3e96] text-3xl font-bold text-shadow-lg">
          التدريب الميداني
        </p>
      </div>
      <div className="mt-10 flex justify-start items-center w-full">
        <Tabs defaultValue="requests" className="w-[400px]" dir="rtl">
          <TabsList className="mb-10">
            <TabsTrigger value="requests" className="text-lg font-bold">
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="admission" className="text-lg font-bold">
              قبول الطلبات
            </TabsTrigger>
            <TabsTrigger value="test3" className="text-lg font-bold">
              test3
            </TabsTrigger>
          </TabsList>
          <TabsContent value="requests">
            <RequestTable data={data} />
          </TabsContent>
          <TabsContent value="admission">
            Change your password here.
          </TabsContent>
          <TabsContent value="test3">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
