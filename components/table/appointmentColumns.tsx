import { StatusIcon } from "@/constants";
// import { StatusIcon } from '@/components/icons/StatusIcon';
import Image from 'next/image';  
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../StatusBadge";

// type Status = 'scheduled' | 'pending' | 'cancelled';

export const appointmentColumns: ColumnDef<any>[] = [
  {
    header: "S.No",
    cell: ({ row }) => row.index + 1, // Serial number based on the row index (starting from 1)
  },
  {
    accessorKey: "appointmentId",   
    header: "Appointment ID",
  },
  {
    accessorKey: "patientName",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "schedule",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.schedule);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }); // Format as "10 Sept 2024"
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const time = new Date(row.original.schedule);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); // Format time (e.g., 01:00 PM)
    },
  }, 
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",  
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">    
          <StatusBadge status={appointment.status} />    
        </div> 
      );   
    },     
  },
  {
    accessorKey: "note", // Assuming the note field in your data structure
    header: "Notes",
  },
];  