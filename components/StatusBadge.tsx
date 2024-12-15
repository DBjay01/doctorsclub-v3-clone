import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

import { StatusIcon } from '@/constants';  

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "pending",
        "bg-red-600": status === "cancelled", // Red background for cancelled status
      })}>
        <Image 
            src={StatusIcon[status]} 
            alt="status icon"
            width={24} 
            height={24}
            className="h-fit w-3"
        /> 
        <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "cancelled", // Red text for cancelled status
        })}
        >
        {status}
        </p>   
    </div>   
  );
}

export default StatusBadge;