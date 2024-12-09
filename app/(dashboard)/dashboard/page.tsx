import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserTable from "./UserTable";
import { getAllUsers, getCurrentUser } from "@/lib/actions/user.action";
import { use } from "react";
import RequestTable from "./RequestTable";
import {
  getAllRequests,
  getAllTrainingRequests,
} from "@/lib/actions/request.action";
import RequestTrainingTable from "./RequestTrainingTable";
// import { getProducts } from '@/lib/db';

export default async function ProductsPage(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? "";
  const offset = searchParams.offset ?? 0;
  const users = await getAllUsers();
  const request = await getAllRequests();
  const trainingRequests = await getAllTrainingRequests();
  let requests: any = [];
  // console.log(users);
  // const { products, newOffset, totalProducts } = await getProducts(
  //   search,
  //   Number(offset)
  // );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between w-full">
        <TabsList>
          <TabsTrigger value="archived" className="hidden sm:flex">
            الارشيف
          </TabsTrigger>
          <TabsTrigger value="training">قبول التدريب</TabsTrigger>
          <TabsTrigger value="requests">قبول طلبات الشركات</TabsTrigger>
          <TabsTrigger value="admission">قبول الطلاب بالمادة</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          {/* <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button> */}
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              اضافة طلب
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="admission">
        <UserTable data={users} />
      </TabsContent>
      <TabsContent value="requests">
        <RequestTable data={request} />
      </TabsContent>
      <TabsContent value="training">
        <RequestTrainingTable data={trainingRequests} />
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
