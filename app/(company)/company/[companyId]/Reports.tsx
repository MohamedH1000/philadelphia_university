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
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { daysOfWeek, rateColumns, rates } from "@/constants/constants";

export type Payment = {
  id: string;
  name: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export function Reports<TData, TValue>({
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
        const report = row.original;
        return <p>{report.user.name}</p>;
      },
    },
    {
      accessorKey: "uniNumber",
      header: "الرقم الجامعي",
      cell: ({ row }) => {
        const report = row.original;
        return <p>{report.user.uniNumber}</p>;
      },
    },
    {
      accessorKey: "specialization",
      header: `التخصص`,
      cell: ({ row }) => {
        const report = row.original;
        return <p>{report.user.specialization}</p>;
      },
    },
    {
      accessorKey: "reports",
      header: "التقارير الخاصة بالطالب",
      cell: ({ row }) => {
        const report = row.original; // Assuming the row contains the report data
        return (
          <Dialog>
            <DialogTrigger className="bg-primary text-white rounded-md p-2 font-bold flex gap-2">
              عرض التقرير
            </DialogTrigger>
            <DialogContent className="h-[700px] overflow-y-auto">
              <form className="space-y-8">
                {/* Display Student Name */}
                <div>
                  <label className="block text-gray-700 font-bold my-5">
                    اسم الطالب
                  </label>
                  <Input value={report.user.name} readOnly />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    تاريخ التقرير
                  </label>
                  <Input
                    value={report.createdAt.toLocaleDateString("ar-EG", {
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
                                checked={report.attendance[day]}
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
                        {Object.keys(report.rate).map((criterion) => (
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
                                  checked={report.rate[criterion] === column}
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
                  <Textarea value={report.diSupNote} readOnly />
                </div>
              </form>
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ انشاء التقرير",
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return date.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
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

export default Reports;
