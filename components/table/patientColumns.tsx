"use client";   

import { ColumnDef } from "@tanstack/react-table";

export type Patient = {
  id: string;
  name: string;
  address: string;
  phone: string;
  reason: string;
  serialNo: string; 
  addedAt: string;  
  gender: string;    // New field
  notes: string;     // New field
};

export const patientColumns: ColumnDef<Patient>[] = [
  {
        accessorKey: "serialNo",
        header: "Serial No.",
        cell: ({ row }) => <div>{row.getValue("serialNo")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "reason",
    header: "Reason",   
    cell: ({ row }) => <div>{row.getValue("reason")}</div>,
  },
  {
    accessorKey: "dateAdded",
    header: "Date Added",
    cell: ({ row }) => <div>{row.getValue("dateAdded")}</div>,
  },
  {
    accessorKey: "timeAdded",
    header: "Time Added",
    cell: ({ row }) => <div>{row.getValue("timeAdded")}</div>,
  },   
  {
    accessorKey: "gender", // New column for gender
    header: "Gender",
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "notes", // New column for notes
    header: "Notes",
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
  }, 
];   
