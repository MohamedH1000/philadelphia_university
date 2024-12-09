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
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
import { updateStudentRole } from "@/lib/actions/role.action";
import {
  updateRequestAdmission,
  updateTrainingRequestAdmission,
} from "@/lib/actions/request.action";
import { request } from "http";
import Link from "next/link";

export type Payment = {
  id: string;
  name: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export function RequestTrainingTable<TData, TValue>({
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
      header: "الاسم",
      cell: ({ row }) => {
        const request = row.original;
        return <p>{request.user.name}</p>;
      },
    },
    {
      accessorKey: "uniNumber",
      header: `الرقم الجامعي`,
      cell: ({ row }) => {
        const request = row.original;
        return <p>{request.user.uniNumber}</p>;
      },
    },
    {
      accessorKey: "file",
      header: `ملف طلب المراجعة`,
      cell: ({ row }) => {
        const request = row.original;
        // console.log(request);

        const downloadAllFiles = async () => {
          try {
            const zip = new JSZip();
            // console.log("Files to download:", request.file); // Debugging log

            for (const [index, fileUrl] of request.file.entries()) {
              //   console.log(`Processing file ${index + 1}: ${fileUrl}`); // Debug log
              try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                  console.error(
                    `Failed to fetch file: ${fileUrl}`,
                    response.status
                  );
                  continue; // Skip this file
                }
                const blob = await response.blob();
                zip.file(`file-${index + 1}.pdf`, blob);
              } catch (error) {
                console.error(`Error fetching file: ${fileUrl}`, error);
              }
            }

            // console.log("Generating ZIP file...");
            const zipBlob = await zip.generateAsync({ type: "blob" });
            // console.log("ZIP file generated, starting download...");
            saveAs(zipBlob, "files.zip");
          } catch (error) {
            console.error("Error in downloadAllFiles:", error);
          }
        };

        return (
          <div className="flex flex-col gap-2">
            <Button
              onClick={downloadAllFiles}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              تحميل جميع الملفات
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "roleStudent",
      header: `role`,
      cell: ({ row }) => {
        const request = row.original;
        // console.log(request);
        return (
          <div className="font-bold text-lg">
            <p>{request?.user?.roleStudent[0]?.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "admission",
      header: `القبول`,
      cell: ({ row }) => {
        const request = row.original;
        // console.log("users", user);

        return (
          <div className="flex flex-col items-center gap-3">
            <Button
              className="bg-[green] text-white font-bold text-lg"
              onClick={async () => {
                await updateStudentRole(request.user.roleStudent[0].id, "ناجح");
                await updateTrainingRequestAdmission(request.user.id, "true");
                toast.success("تم قبول الطلب");
                router.refresh();
              }}
            >
              قبول
            </Button>
            <Button
              variant="destructive"
              className=" font-bold text-lg"
              onClick={async () => {
                await updateStudentRole(
                  request.user?.roleStudent[0].id,
                  "راسب"
                );
                await updateTrainingRequestAdmission(request.user?.id, "false");
                toast.error("تم رفض القبول للطالب");
                router.refresh();
              }}
            >
              رفض
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ طلب المراجعة",
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
      accessorKey: "admission",
      header: `الحالة`,
      cell: ({ row }) => {
        const request = row.original;
        // console.log(request);
        return (
          <div className="font-bold text-lg">
            <p className="text-[green]">
              {request?.admission === "true" && "تم النجاح في التدريب"}
            </p>
            <p className="text-[red]">
              {request?.admission === "false" && "لم يتم النجاح في التدريب"}
            </p>
            <p className="text-[gray]">
              {request?.admission === "معلق" && "معلق"}
            </p>
          </div>
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

export default RequestTrainingTable;
