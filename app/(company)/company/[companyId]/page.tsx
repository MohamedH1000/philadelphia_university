import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllRequestByCompany } from "@/lib/actions/request.action";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { AcceptTrainees } from "./AcceptTrainees";
import Trainees from "./Trainees";
import Reports from "./Reports";
import { getAllUsers } from "@/lib/actions/user.action";
import AddReport from "./components/AddReport";
import { getCompanyById } from "@/lib/actions/company.action";
import { getAllReportsById } from "@/lib/actions/report.action";
// import { getProducts } from '@/lib/db';

export default async function ProductsPage({ params }: { params: Params }) {
  const { companyId } = params;
  const request = await getAllRequestByCompany(companyId);

  const validRequest = request?.filter(
    (req) => req.universityStatus === "active"
  );

  const trainees = request?.filter(
    (req) => req.universityStatus === "active" && req.companyStatus === "active"
  );

  const users = await getAllUsers();

  const company = await getCompanyById(companyId);

  const students = users?.filter((user) => user.role.name === "student");

  const reports = await getAllReportsById(companyId);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between w-full">
        <TabsList>
          <TabsTrigger value="archived" className="hidden sm:flex">
            الارشيف
          </TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="trainees">المتدربين</TabsTrigger>
          <TabsTrigger value="acceptTraining">قبول التدريب</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="reports">
        <div className="flex items-center justify-end">
          <AddReport students={students} company={company} />
        </div>
        <Reports data={reports} />
      </TabsContent>
      <TabsContent value="trainees">
        <Trainees data={trainees} />
      </TabsContent>
      <TabsContent value="acceptTraining">
        <AcceptTrainees data={validRequest} />
      </TabsContent>
      <TabsContent value="archived">
        {/* <ProductsTable
          products={products}
          offset={newOffset ?? 0}
          totalProducts={totalProducts}
        /> */}
      </TabsContent>
    </Tabs>
  );
}
