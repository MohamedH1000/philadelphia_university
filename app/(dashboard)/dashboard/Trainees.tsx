"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { acceptTraUni, rejectTraUni } from "@/lib/actions/request.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { daysOfWeek, rateColumns } from "@/constants/constants";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export type Trainer = {
  id: string;
  name: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export function Trainees<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<TData, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "username",
      header: "اسم الطالب",
      cell: ({ row }) => {
        const request = row.original;
        return <p>{request.user.name}</p>;
      },
    },
    {
      accessorKey: "uniNumber",
      header: "الرقم الجامعي",
      cell: ({ row }) => {
        const request = row.original;
        return <p>{request.user.uniNumber}</p>;
      },
    },
    {
      accessorKey: "name",
      header: "اسم الشركة",
      cell: ({ row }) => {
        const request = row.original;
        return <p>{request.company.name}</p>;
      },
    },
    {
      accessorKey: "specialization",
      header: `التخصص`,
      cell: ({ row }) => {
        const request = row.original;
        return <p>{request.user.specialization}</p>;
      },
    },
    {
      accessorKey: "admission",
      header: `القبول`,
      cell: ({ row }) => {
        const request = row.original;
        const status = request.universityStatus;
        // console.log("users", user);

        return (
          <div className="flex flex-col items-center gap-3">
            {status === "active" && (
              <Button
                variant="destructive"
                className=" font-bold text-lg"
                onClick={async () => {
                  await rejectTraUni(request.id);
                  toast.error("تم رفض التدريب في الشركة");
                  router.refresh();
                }}
              >
                رفض
              </Button>
            )}

            {status === "rejected" && (
              <Button
                className="bg-[green] text-white font-bold text-lg"
                onClick={async () => {
                  await acceptTraUni(request.id);
                  toast.success("تم قبول التدريب في الشركة");
                  router.refresh();
                }}
              >
                قبول
              </Button>
            )}
            {status === "pending" && (
              <>
                <Button
                  className="bg-[green] text-white font-bold text-lg"
                  onClick={async () => {
                    await acceptTraUni(request.id);
                    toast.success("تم قبول التدريب في الشركة");
                    router.refresh();
                  }}
                >
                  قبول
                </Button>
                <Button
                  variant="destructive"
                  className=" font-bold text-lg"
                  onClick={async () => {
                    await rejectTraUni(request.id);
                    toast.error("تم رفض التدريب في الشركة");
                    router.refresh();
                  }}
                >
                  رفض
                </Button>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ طلب التدريب",
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return date.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      accessorKey: "reports",
      header: "التقارير الخاصة بالطالب",
      cell: ({ row }) => {
        const request = row.original;
        const companyId = request?.company?.id;
        const userId = request?.user?.id; // Get the user ID

        const filteredReports = request.user.report.filter(
          (rep: any) => rep.companyId === companyId && rep.userId === userId
        );

        return (
          <Dialog>
            <DialogTrigger className="bg-primary text-white rounded-md p-2 font-bold flex gap-2">
              عرض التقارير
            </DialogTrigger>
            <DialogContent className="h-[700px] overflow-y-auto">
              <form className="space-y-8">
                {/* Display Student Name */}
                <div>
                  <label className="block text-gray-700 font-bold my-5">
                    اسم الطالب
                  </label>
                  <Input value={request.user.name} readOnly />
                </div>
                {filteredReports.map((rep: any, i: number) => (
                  <>
                    <div className="w-full">
                      <h1 className="font-bold text-2xl">
                        التقرير رقم {i + 1}
                      </h1>
                      <Separator className="mt-5" />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        تاريخ التقرير
                      </label>
                      <Input
                        value={rep.createdAt?.toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        readOnly
                      />
                    </div>

                    {/* Display Attendance */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        الحضور
                      </label>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-200 px-4 py-2 text-right">
                                اليوم
                              </th>
                              <th className="border border-gray-200 px-4 py-2 text-right">
                                الحضور
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {daysOfWeek.map((day) => (
                              <tr key={day}>
                                <td className="border border-gray-200 px-4 py-2">
                                  {day}
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={rep.attendance[day]}
                                    disabled
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Display Rate */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        تقييم الطالب
                      </label>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-200 px-4 py-2 text-right">
                                المعايير
                              </th>
                              {rateColumns.map((column) => (
                                <th
                                  key={column}
                                  className="border border-gray-200 px-4 py-2 text-center"
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(rep.rate).map((criterion) => (
                              <tr key={criterion}>
                                <td className="border border-gray-200 px-4 py-2 text-right">
                                  {criterion}
                                </td>
                                {rateColumns.map((column) => (
                                  <td
                                    key={`${criterion}-${column}`}
                                    className="border border-gray-200 px-4 py-2 text-center"
                                  >
                                    <input
                                      type="radio"
                                      name={criterion}
                                      checked={rep.rate[criterion] === column}
                                      disabled
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Display Supervisor Notes */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        ملاحظة الرئيس المباشر
                      </label>
                      <Textarea value={rep.diSupNote} readOnly />
                    </div>
                  </>
                ))}
              </form>
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "endTraining",
      header: "انهاء التدريب",
      cell: ({ row }) => {
        const request = row.original;
        // console.log(request);
        return (
          <Dialog>
            <DialogTrigger className="bg-[red] text-white p-2 rounded-md text-md font-bold">
              انهاء التدريب
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-right mt-5">
                  هل انت متاكد بإنهاء تدريب الطالب {request.user.name} ؟
                </DialogTitle>
                <div className="flex justify-start items-center gap-3 mt-10">
                  <Button>تاكيد</Button>
                  <Button>الغاء</Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "universityStatus",
      header: `الحالة`,
      cell: ({ row }) => {
        const request = row.original;
        // console.log(request);
        return (
          <div className="font-bold text-lg">{request.universityStatus}</div>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div>
        <div className="flex justify-start items-center gap-2">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter names..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                الاعمدة
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 text-sm text-muted-foreground">
          {table?.getFilteredSelectedRowModel().rows.length} of{" "}
          {table?.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="rounded-[12px] border mt-3">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header?.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            القادم
          </Button>
        </div>
      </div>
    </>
  );
}

export default Trainees;
