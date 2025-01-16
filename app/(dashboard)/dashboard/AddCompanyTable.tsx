"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rejectCompany, acceptCompany } from "@/lib/actions/company.action";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export type Payment = {
  id: string;
  name: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}
export function AddCompanyTable<TData, TValue>({
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
      accessorKey: "name",
      header: "اسم الشركة",
      cell: ({ row }) => {
        const company = row.original;
        return <p>{company.name}</p>;
      },
    },
    {
      accessorKey: "email",
      header: `ايميل الشركة`,
      cell: ({ row }) => {
        const company = row.original;
        return <p>{company.email}</p>;
      },
    },
    {
      accessorKey: "traActAr",
      header: `مجال نشاط التدريب`,
      cell: ({ row }) => {
        const company = row.original;

        return <div>{company.traActAr}</div>;
      },
    },
    {
      accessorKey: "location",
      header: `مكان الشركة`,
      cell: ({ row }) => {
        const company = row.original;
        // console.log(request);
        return (
          <div className="text-lg">
            <p>{company?.location}</p>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "admission",
    //   header: `القبول`,
    //   cell: ({ row }) => {
    //     const company = row.original;
    //     const status = company.status;
    //     // console.log("users", user);

    //     return (
    //       <div className="flex flex-col items-center gap-3">
    //         {status === "active" && (
    //           <Button
    //             variant="destructive"
    //             className=" font-bold text-lg"
    //             onClick={async () => {
    //               await rejectCompany(company.id);
    //               toast.error("تم رفض قبول اضافة الشركة");
    //               router.refresh();
    //             }}
    //           >
    //             رفض
    //           </Button>
    //         )}

    //         {status === "rejected" && (
    //           <Button
    //             className="bg-[green] text-white font-bold text-lg"
    //             onClick={async () => {
    //               await acceptCompany(company.id);
    //               toast.success("تم قبول اضافة الشركة");
    //               router.refresh();
    //             }}
    //           >
    //             قبول
    //           </Button>
    //         )}
    //         {status === "pending" && (
    //           <>
    //             <Button
    //               className="bg-[green] text-white font-bold text-lg"
    //               onClick={async () => {
    //                 await acceptCompany(company.id);
    //                 toast.success("تم قبول اضافة الشركة");
    //                 router.refresh();
    //               }}
    //             >
    //               قبول
    //             </Button>
    //             <Button
    //               variant="destructive"
    //               className=" font-bold text-lg"
    //               onClick={async () => {
    //                 await rejectCompany(company.id);
    //                 toast.error("تم رفض قبول اضافة الشركة");
    //                 router.refresh();
    //               }}
    //             >
    //               رفض
    //             </Button>
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "createdAt",
      header: "تاريخ طلب الاضافة",
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
      accessorKey: "status",
      header: `الحالة`,
      cell: ({ row }) => {
        const company = row.original;
        // console.log(request);
        return <div className=" text-lg">{company.status}</div>;
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
          <div className="flex flex-col items-start py-4 w-full">
            <div className="flex justify-between items-center w-full">
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

            <h2 className="font-bold text-lg mt-2">Companies Table</h2>
          </div>
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

export default AddCompanyTable;
