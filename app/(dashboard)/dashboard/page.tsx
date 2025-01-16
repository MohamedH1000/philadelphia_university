import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUsers, getCurrentUser } from "@/lib/actions/user.action";
import { getAllCompanies } from "@/lib/actions/company.action";
import RequestAddCoTable from "./RequestAddCoTable";
import Trainees from "./Trainees";
import { getAllRequests } from "@/lib/actions/request.action";
import Archive from "./Archive";
import AddCompany from "./AddCompany";
import AddCompanyTable from "./AddCompanyTable";

export default async function ProductsPage(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const companies = await getAllCompanies();
  const request = await getAllRequests();
  const currentUser = await getCurrentUser();
  // console.log("request", request);

  const rejectedRequest = request?.filter(
    (req) => req.universityStatus === "rejected"
  );
  // console.log(rejectedRequest);
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between w-full">
        <TabsList>
          <TabsTrigger value="archived" className="hidden sm:flex">
            الارشيف
          </TabsTrigger>
          <TabsTrigger value="trainees">المتدربين</TabsTrigger>
          <TabsTrigger value="requestAddCompany">طلبات شركات جديدة</TabsTrigger>
          <TabsTrigger value="addCompany">اضافة شركة</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="trainees">
        <Trainees data={request} />
      </TabsContent>
      <TabsContent value="requestAddCompany">
        <RequestAddCoTable data={companies} />
      </TabsContent>
      <TabsContent value="addCompany">
        <div className="flex items-center justify-end">
          <AddCompany currentUser={currentUser} />
        </div>
        <AddCompanyTable data={companies} />
      </TabsContent>
      <TabsContent value="archived">
        <Archive data={rejectedRequest} />
      </TabsContent>
    </Tabs>
  );
}
