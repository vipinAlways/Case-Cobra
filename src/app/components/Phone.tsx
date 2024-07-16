"use client";
import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

export interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  className:string,
  dark?: boolean;
}

function Phone({ className, imgSrc, dark = false, ...props }: PhoneProps) {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden ",
        className
      )}
      {...props}
    >
      <img
        src={
          dark ? "/phone-template-dark-edges.png" : "/phone-template-white-edges.png"
        }
        alt="see what happened"
        className="pointer-events-none z-50 select-none "
      />
      <div className="absolute -z-10 inset-0">
        <img src={imgSrc} className=" object-cover min-w-full min-h-full"  alt="phone img"/>
      </div>
    </div>
  );
}

export default Phone;
